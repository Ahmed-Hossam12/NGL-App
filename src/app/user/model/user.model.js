import {model , Schema} from 'mongoose'
// Schema
const UserSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            minlength: 3 ,
            maxlength: 20,
            trim: true ,
        },
        email:{
            type: String,
            required: true,
            unique : true,
            trim: true ,
            lowercase: true,
        },
        password:{
            type: String,
            required: function (){
                return this.password === 'local';
            }
        },
        provider:{
            type: String,
            enum: ['local','google' , 'facebook'],
            default: 'local',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        dob:Date,
        gender:{
            type: String,
            enum: ['male','female'],
            default: 'male'
        },
        profilePicPath: String,
        coverImagePaths:[String],
        cvPath:String,
        twoStepVerification:{
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps:{
            createdAt: true,
            updatedAt: true,
        }
    }
    )
// model
export const User = model('User',UserSchema)