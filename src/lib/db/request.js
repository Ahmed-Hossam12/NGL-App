import {model , Schema} from "mongoose";
const messageSchema = new Schema({
    msgId: {type:Schema.Types.ObjectId, ref:"Message" , required:true},
    sender:{type:Schema.Types.ObjectId, ref:"User", required:true},
})
const schema = new Schema({
    messageId: {type:Schema.Types.ObjectId, ref:"Message", required:true},
    senderOfReq: {type:Schema.Types.ObjectId, ref:"User", required:true},
    receiverOfReq: {type:Schema.Types.ObjectId, ref:"User", required:true},
    status: {
        type: String ,
        enum: ['pending', 'accepted' , 'rejected'],
    }
},{
    timestamps:true
})
export const RequestModel = model("RequestModel", schema)