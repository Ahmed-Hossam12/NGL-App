import {User} from "../model/user.model.js";

export async function updateUserByEmail(email , userData) {
    const updateUser = await User.findOneAndUpdate(
        { email: email }, // filter
             userData, // updated data
        {returnDocument:'after'} // options
    )
    return updateUser
}

export async function findUserById(id){
    return  User.findOne({_id:id , isDeleted: false},{password:0})

}