import {toMS} from "../../pkg/utils/time.js";

export async function setCookies(res , accessToken , refreshToken){
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: toMS(1 , 'hours'),
        path:'/'
    })
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: toMS(7 , 'days'),
        path:'/api/auth/refresh_token'
    })
}