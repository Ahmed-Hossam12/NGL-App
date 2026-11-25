import * as userRepository from '../../user/repository/user.repository.js';
import * as messageRepository from '../repository/message.repository.js'
import {userNotExist, userNotFound} from "../../user/error.js";
import {AppError} from "../../../lib/error/error.js";
export async function sendMessages(content , receiver , sender){
    // 1. check receiver exists
   const user = await userRepository.findUserById(receiver)
    if(!user) throw userNotFound;
    // 2. save message into db
    return await messageRepository.createMessage(content,receiver,sender);
}
export async function getAllMessages (userId){
  const messages = messageRepository.getAllMessagesRelatedToUserId(userId)
    if(messages.length === 0) throw new AppError('No messages found' , 404)
    return messages
}