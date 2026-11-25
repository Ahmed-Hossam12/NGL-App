import {Router} from "express";
import {withCache} from "../../lib/cache/withcache.js";
import {User} from "./model/user.model.js";
import {uploadArrayOfFiles, uploadSingleFile} from "../../lib/media/multer.js";
import {allowedFields, fileValidation} from "../../lib/media/file.validation.js";
import * as userRepository from "../user/repository/user.repository.js"
import {authGaurd} from "../../lib/auth/AuthGaurd.js";
import {userNotExist} from "./error.js";
import fs from "node:fs";
import * as userController from "../user/controller/user.controller.js"
const userRouter = Router();
userRouter.get(
    '/get-all-users',
    withCache(),
    async (req, res, next)=>{
        const users = await User.find()
        res.json(users)
    })
userRouter.post('/upload-profile-pic' ,
    authGaurd,
    uploadSingleFile('pp') ,
    fileValidation() ,
    userController.uploadProfilePic
    )
userRouter.post('/upload-cv' , uploadSingleFile('CV' ,allowedFields.files) , fileValidation(allowedFields.files) , (req, res, next)=>{
    res.json('OK')
})
userRouter.post('/upload-cover-images' , uploadArrayOfFiles('cover-images', (req, res, next)=>{
    res.json('OK')
}))
export default userRouter;