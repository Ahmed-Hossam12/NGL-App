import jwt from 'jsonwebtoken'
import {toMS} from "../../../pkg/utils/time.js";
import {env} from "../../../lib/config/env.js";
export function generateToken(payload){
    return jwt.sign(payload , env.jwt.secret, {expiresIn: toMS(1 , 'hours')});
}