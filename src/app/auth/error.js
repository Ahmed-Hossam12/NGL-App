import {AppError} from "../../lib/error/error.js";

export const otpExpired = new AppError("OTP expired , please resend new OTP" , 404); // 404
export const invalidCode = new AppError("Invalid code" , 400); // 400
export const invalidPassword = new AppError("Invalid password" , 403); // 403