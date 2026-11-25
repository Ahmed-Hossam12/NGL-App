// function
// get 2 params
// DTO vs body
import {z} from 'zod'
import {AppError} from "../error/error.js";
export function validateBody(DTO , body){
    const result = DTO.safeParse(body) // return {success: false , error:[]}
    if(result.success === false){
        // handle error
        // result.error.issues >>
        // [{message: 'is required',path:['email']},{message: 'is required' , path:['name']}, {message: 'must be >= 3',path:[password]}]
        const errMassages = result.error.issues.map((issue)=> `${issue.path[0]}: ${issue.message}`)
        throw new AppError( errMassages.join(', '),400)
    }
    return result.data
}