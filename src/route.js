import {Router} from "express";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import authRouter from "./app/auth/auth.route.js";
export const router = Router();
router.use('/auth',authRouter)
router.use('/user', userRouter);
router.use('/messages',messageRouter);