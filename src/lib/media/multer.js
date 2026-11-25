import multer, {diskStorage} from 'multer'
import crypto from "crypto";
import {AppError} from "../error/error.js";
import {allowedFields} from "./file.validation.js";
// storage
// 1. disk [hdd]
// 2. RAM [memory]
function fileUpload(allowedTypes = allowedFields.images){
    return multer({
        fileFilter: (req, file, cb)=>{
            if(!allowedTypes.includes(file.mimetype)){
                return cb(new AppError('Invalid file format !' , 400) , false)
            }
            cb(null, true)
        },
        storage: diskStorage({
            destination: 'uploads',
            filename: function (req, file, cb) {
                console.log(file) // {fieldName , size , mimetype , encoding , originalName}
                cb(null , `${crypto.randomUUID()}-${file.originalname}`)
            }
        })
    })
}
export function uploadSingleFile(filedName , allowedTypes = allowedFields.images ){
    return fileUpload(allowedTypes).single(filedName)
}
export function uploadArrayOfFiles(filedNames){
    return fileUpload().array(filedNames)
}
export function uploadFields(fields){
   return fileUpload().fields(fields)
}
