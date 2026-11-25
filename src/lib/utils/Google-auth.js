import {OAuth2Client} from "google-auth-library";
import {AppError} from "../error/error.js";
import {env} from "../config/env.js";

export async function verifyGoogleToken(idToken){
    try{
        const client = new OAuth2Client({client_id:env.google.webClientId});
        const ticket = await client.verifyIdToken({idToken:idToken})
        return ticket.getPayload()
    }catch(err){
        throw new AppError('invalid Google Token', 403)
    }
}