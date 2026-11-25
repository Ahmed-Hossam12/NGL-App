import * as messageService from '../service/message.service.js'
import {validateBody} from "../../../lib/validation/validation.js";
import {sendMessageDto} from "../dto/message.dto.js";
export async function sendMessage(req, res , next){
    try{
       const data = validateBody(sendMessageDto , req.body)
       const {content , receiver} = data
        const sender = req.user?.id
       const createdMessage = await messageService.sendMessages(content , receiver , sender)
        res.status(201).json({
            message: 'message created successfully.',
            success: true,
            data: createdMessage,
        })
    }catch(err){
        next(err)
    }
}
export async function getAllMessages(req,res , next){
    try{
        const messages = await messageService.getAllMessages(req.user.id)
        res.json(
            {
                messages : 'OK',
                success: true,
                data: messages
            }
        )
    }catch(err){
        next(err)
    }
}