import {Router} from "express";
const authRouter = Router();
import * as authController from "./controller/auth.controller.js"
import {idempotency} from "../../lib/idempotency/idempotency.js";
import {logger} from "../../pkg/logger/logger.js";
authRouter.post("/register", authController.register)
authRouter.patch("/verify-account",authController.verifyAccount)
authRouter.post("/login", authController.login)
authRouter.post("/send-otp",authController.sendOTP)
authRouter.patch('/reset-password', idempotency(), authController.resetPassword)
authRouter.post('/login-with-google',authController.loginWithGoogle)
authRouter.patch('/enable-2-step-verification', authController.enable2StepVerification)
authRouter.post('/verify-to-login', authController.verifyCodeToLogin)
export default authRouter;