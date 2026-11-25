import * as userRepository from "../repository/user.repository.js";
import {userNotExist} from "../error.js";
import fs from "node:fs";

export const uploadProfilePic = async (userId , file)=>{
    // 1. get user old image
    const user = await userRepository.findUserById(userId)
    if(!user) throw userNotExist
    // 2. delete user old image
    if(user.profilePicPath){
        fs.unlinkSync(user.profilePicPath)
    }
    // 3. update new image
    await userRepository.updateUserByEmail(user.email , {profilePicPath:file.path})
}