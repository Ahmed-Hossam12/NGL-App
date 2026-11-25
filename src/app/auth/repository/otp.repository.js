import {OTP} from '../model/otp.model.js'
export  async function createOtp(otpData){
    return await OTP.create(otpData)
}
export async function  getOtpByEmail(email){
   const otp =  await OTP.findOne({email:email})
    return otp
}
export async function deleteOtp(email){
    return await OTP.deleteMany({email:email})
}