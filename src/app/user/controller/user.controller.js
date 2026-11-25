import * as userService from '../service/user.service.js'
export const uploadProfilePic = async (req, res, next)=>{
    try{
        await userService.uploadProfilePic(req.user.id , req.file)
        res.json({
            message:"Uploaded Profile successfully",
            success:true
        })
    }catch(err){
        next(err)
    }
}