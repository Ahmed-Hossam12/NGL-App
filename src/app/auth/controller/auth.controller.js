import * as authService from '../service/auth.service.js'
import {toMS} from "../../../pkg/utils/time.js";
import {validateBody} from "../../../lib/validation/validation.js";
import {loginDTO, registerDTO, resetDTO, sendOTPDTO, verifyAccountDTO} from "../dto/auth.dto.js";
import {logger} from "../../../pkg/logger/logger.js";
export async function register(req,res,next){
    try{
        // 1. add layer of validation >> throw error
        const data = validateBody(registerDTO , req.body)
        const createdUser = await authService.registerUser(data)
        res.status(201).json({message:"User created successfully" , success:true , data:createdUser})
    }catch(err){
        next(err)
    }
}
export async function verifyAccount(req,res,next){
    try {
        const data = validateBody(verifyAccountDTO , req.body )
        const {email , code} = data
        const updatedUser = await authService.verifyAccount(email,code)
        res.json({message:"User verified successfully",success:true , data:updatedUser})
    }catch(err){
        next(err)
    }
}

export async function enable2StepVerification(req,res,next){
    try{
        const {email , code} = req.body
        await authService.enable2StepVerification(email,code)
        res.json({message:'enable 2 step verification successfully.' , success:true })
    }catch(err){
        next(err)
    }
}

export async function login(req,res,next){
    try {
        const data = validateBody(loginDTO , req.body)
        const {email,password} = data
        const tokens = await authService.login(email,password)
        if(!tokens){
            return res.json({message:'check your inbox, we sent otp' , success:true})
        }
        res.cookie('access_token' , tokens , {
            httpOnly:true, // BE http request -> set or modify not js code
            maxAge: toMS(1 , 'hours'), // session >> 1h >> token >> remove >> logout >> login
        })
        res.json(
            {message:"User login successfully",
                success:true ,
        })
    }catch(err){
        next(err)
    }
}
export async function verifyCodeToLogin(req,res,next){
try {
    const {email , code} = req.body
    const {accessToken , refreshToken} = await authService.verifyCodeToLogin(email,code)
    res.cookie('access_token' , accessToken , {
        httpOnly:true,
        maxAge: toMS(1 , 'hours'),
    })
    res.cookie('refresh_token' , refreshToken, {
        httpOnly:true,
        maxAge: toMS(1 , 'hours'),
        path:"/api/auth/refresh_token",
    })
    res.json({message:"login successfully",success:true})
}catch(err){
    next(err)
}
}
export async function sendOTP(req,res,next){
    try {
        const data = validateBody(sendOTPDTO , req.body)
        const {email} = data;
        await authService.sendOTP(email)
        res.json({
            message:"new OTP send  successfully , check your email",
            success:true,
        })
    }catch(err){
        next(err)
    }
}
export async function resetPassword(req,res,next){
    try{
        const data = validateBody(resetDTO , req.body)
        const {email , code,newPassword} = data;
        await authService.resetPassword(email,code , newPassword)
        res.json({message:"Password reset successfully",success:true})
    }catch(err){
        next(err)
    }
}
export async function loginWithGoogle(req,res,next){
    try {
        const token = await authService.loginWithGoogle(req.body.idToken)
        res.cookie('access_token' , token, {
            httpOnly:true,
            maxAge: toMS(1 , 'hours'),
        })
        res.json({message:"User login successfully",success:true})
    }catch(err){
        next(err);
    }
}