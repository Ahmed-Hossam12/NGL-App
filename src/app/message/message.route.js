import {Router} from "express";
import * as messageController from "./controller/message.controller.js"
import {authGaurd} from "../../lib/auth/./AuthGaurd.js";
const messageRouter = Router();
messageRouter.post('/' , messageController.sendMessage )
messageRouter.post('/public' , authGaurd , messageController.sendMessage )
messageRouter.get('/' , authGaurd , messageController.getAllMessages)
export default messageRouter;
