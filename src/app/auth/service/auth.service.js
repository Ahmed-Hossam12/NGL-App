import * as authRepository from '../repository/auth.repository.js'
import bcrypt from 'bcrypt'  // bcryptjs - argon2
import crypto from 'crypto'
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js"
import {sendEmail} from "../../../lib/email/nodemailer.js";
import {toMS} from "../../../pkg/utils/time.js";
import jwt from 'jsonwebtoken';
import {
    invalidCode, invalidPassword,
    otpExpired,
} from "../error.js";
import {userNotExist , userNotAlreadyVerified , userAlreadyExist , userAlreadyVerified} from "../../user/error.js";
import {generateOtp} from "../../../lib/utils/otp.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";
import {AppError} from "../../../lib/error/error.js";
import {OAuth2Client} from "google-auth-library";
import {verifyGoogleToken} from "../../../lib/utils/Google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
import {cacheProvider} from "../../../lib/cache/init.js";
export async function registerUser(userData) {
    // 1. check user exists
    const userExist = await authRepository.checkUserExists(userData.email)
    // 2. if yes, throw an error
    if (userExist) throw userAlreadyExist;
    // 3. prepare data [hashPassword]
    userData.password = await hashPassword(userData.password)
    // 4. save user into db
    const createdUser = await authRepository.createUser(userData)
    // 5. generate and save otp into db
    let code = await generateOtp()
    await otpRepository.createOtp({
        code: code,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMS(5 , 'minutes'))
    })
    await cacheProvider.set(`otp:${email}`,code , toMS(3 , 'minutes') )
    // 6. send email verification OTP
    console.log("EMAIL TO:", userData.email);
    console.log("OTP:" , code)
    const result = await sendEmail(userData.email , 'verified code' , `<h1>Your verification code is ${code}</h1>`)
    console.log(result)
    return createdUser
}

// export async function  verifyAccount(email,code){
//     // 1. check user existance
//     const user = await  authRepository.checkUserExists(email)
//     // 1.1 if you don't exist >> error >> 'User doesn't exist'
//     if (!user) throw userNotExist;
//     // 1.2 if isVerified = true >> error 'You already verified'
//     if(user.isVerified === true) throw userAlreadyVerified;
//     // 2. check otp validation
//     const otp = await otpRepository.getOtpByEmail(email);
//     // 2.1 not exist in DB >> error >> 'otp expired' >> resend OTP
//     if(!otp) throw otpExpired;
//     // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid verification code'
//     if(otp.code !== code) throw invalidCode;
//     // 3. switch your isVerified to true [update user]
//     const updatedUser = await userRepository.updateUserByEmail(email , {isVerified: true})
//     // 4. delete otp from DB
//     await otpRepository.deleteOtp(email)
//     return updatedUser
// }




export async function  baseFunction(email,code , factory){
    // 1. check user existance
    const user = await  authRepository.checkUserExists(email)
    // 1.1 if you don't exist >> error >> 'User doesn't exist'
    if (!user) throw userNotExist;
    // 1.2 if isVerified = true >> error 'You already verified'
    // if(user.isVerified === true) throw userAlreadyVerified;
    // 2. check otp validation
    const otp = await otpRepository.getOtpByEmail(email);
    // 2.1 not exist in DB >> error >> 'otp expired' >> resend OTP
    if(!otp) throw otpExpired;
    // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid verification code'
    if(otp.code !== code) throw invalidCode;
    // 3. switch your isVerified to true [update user]
    const result = await factory(user)
    // const updatedUser = await userRepository.updateUserByEmail(email , {twoStepVerification: true})
    // 4. delete otp from DB
    await otpRepository.deleteOtp(email)
    return result;
}
export async function  verifyAccount(email,code){
   await baseFunction(email,code , async ()=>{
        await userRepository.updateUserByEmail(email,{isVerified:true})
    })
}
export async function enable2StepVerification(email,code){
    await baseFunction(email,code , async ()=>{
        await userRepository.updateUserByEmail(email,{twoStepVerification:true})
    })
}
export async function  verifyCodeToLogin(email,code) {
    const {accessToken , refreshToken} =await baseFunction(email,code , async (user)=>{
        const jti = crypto.randomUUID()
        const accessToken = generateAccessToken({sub:user._id , name:user.name});
        const refreshToken = generateRefreshToken({jti:jti , sub:user._id , name:user.name});
        await cacheProvider.set(`refreshToken:${jti}`,jti,toMS(7,'days'))
        return {
            accessToken,
            refreshToken,
        }
    })
    return {accessToken , refreshToken}
}
export async function login(email,password){
    let cachedTries = await cacheProvider.get(`login-tries:${email}`)
    if (cachedTries === '0') throw new AppError('too many requests to login' , 429)
    // 1. check user existance
   const user = await authRepository.checkUserExists(email) // {} | null
    // 1.1 user not exist
    if(!user) throw userNotExist
    // 1.2 not verified
    if(user.isVerified === false) throw userNotAlreadyVerified ;
    // 2. compare password
   const match = await comparePassword(password , user['password']) // return [true | false]
    if(!match) throw invalidPassword ;

    if(user.twoStepVerification == true){
        const code = await generateOtp();
        await cacheProvider.set(`otp:${email}`,code , toMS(3 , 'minutes'))
        await sendEmail(email , ' 2 step verification email code' , `<h3> Your otp to login is ${code} </h3>`)
        return
    }
    // 3. generate access  token
    const token = await generateToken({id: user._id , name: user.name})
    // set into cache >> 4 tries
    let cachedTTL = await cacheProvider.ttl(`login-tries:${email}`)
    cachedTries = cachedTries ?? 4
    const ttl = cachedTTL == -2 ? toMS(3 , 'minutes') : cachedTTL
    await cacheProvider.set(`login-tries:${email}` , cachedTries - 1 , ttl)
    return token

}

export async function sendOTP(email){
    // 1. check user existance
    const user = await  authRepository.checkUserExists(email)
    if(!user) throw userNotExist;
    // 2. delete all old OTPs
   await otpRepository.deleteOtp(email)
    // 3. generate and save OTP into DB.
    const code = await generateOtp()
    await otpRepository.createOtp({
        code: code,
        email: email,
        expiresAt: new Date(Date.now() + toMS(5 , 'minutes'))
    })
    await cacheProvider.set(`otp:${email}` , code , toMS(3 , 'minutes'))
    // 4. send OTP email
    await sendEmail(email,'New OTP' , `<p>Your new otp is ${code}</p>`)
}

export async function resetPassword(email , code , newPassword){
    // 1. verify otp code
    const otp = await otpRepository.getOtpByEmail(email)
    if(!otp) throw otpExpired ;
    if(otp.code !== code) throw invalidCode;
    // 2. hashing password
    const hashedPassword = await hashPassword(newPassword)
    // 3. update user password
    await userRepository.updateUserByEmail(email, {password: hashedPassword})
    // 4. delete OTP
    await otpRepository.deleteOtp(email)
}


export async function loginWithGoogle(idToken){
    // 1. verify idToken
    const payload = await verifyGoogleToken(idToken)
    // 2. check user exist
    const user = await authRepository.checkUserExists(payload.email)
    // 3. if user exist >> generate token
    if(user){
        return generateToken(
            {
                id: user._id ,
                email: user.email,
            }
        )
    }
    // 4. if not exist >> create user >> generate token
    const createdUser = await authRepository.createUser({
        name: payload.name,
        email: payload.email,
        provider: 'google',
        isVerified: true,
    })
    return generateToken({
        id: createdUser._id,
        email: createdUser.email
    })
}
// 1) Validations
// before using library
// let userName;
// if(typeof userName !== 'String') throw new AppError('userName must be string' , 400)
// if(userName.length < 8 || userName.length > 20) throw new AppError('userName must be at least 8 characters and maximum 20' , 400)
// After using library in validation  [zod - joi - yup - class-validator ]
// let userName;
// userName.string().min(8).max(20).trim().toLowerCase().required()
