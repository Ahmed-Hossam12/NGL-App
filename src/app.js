import './config/config.js'
import express, {Router} from 'express'
import './lib/db/mongoose.js'
import cors from 'cors'
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import authRouter from "./app/auth/auth.route.js";
import {OTP} from "./app/auth/model/otp.model.js";
import {logger} from "./pkg/logger/logger.js";
import {env} from "./lib/config/env.js";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";
import {correlationid} from "./lib/correlation/correlationid.js";
import cookieParser from "cookie-parser";
import {rateLimit} from "express-rate-limit";
import {toMS} from "./pkg/utils/time.js";
import {AppError} from "./lib/error/error.js";
export function createApp(){
    const app = express()
    const limiter = rateLimit({
        limit: 3 ,
        windowMs: toMS(1 , 'minutes'),
        standardHeaders:'draft-8',
        handler: (req,res,next)=>{
            next(new AppError(this.message , this.statusCode))
        }
    })
    app.use(limiter)

    app.use(cors({origin: 'http://localhost:4200'}));
    // get static files
    app.use('/uploads' , express.static('uploads'));
// parse incoming request convert from buffer to object
    app.use(express.json())
    app.use(cookieParser())
    app.use(correlationid)
// routes navigate to features
app.use('/api', router)
// global error handler
    app.use(globalErrorHandler)
    return app;
}
// OTP.create({
//     code: '123456',
//     email: 'user@example.com',
//     expiresAt: new Date(Date.now() + 15 * 60 * 1000)
// })
