import crypto from "crypto";

export async function generateOtp (){
    const code =  crypto.randomInt(100000,999999).toString()
    return code
}