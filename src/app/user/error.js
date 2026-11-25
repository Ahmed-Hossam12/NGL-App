import {json} from "express";
import {AppError} from "../../lib/error/error.js";

export const userNotExist = new AppError("User not exist" , 404); // 404
export const userNotFound = new AppError("User not found" , 404); // 404
export const userAlreadyExist = new AppError('User already exists' , 409); // 409
export const  userAlreadyVerified = new AppError("User already verified" , 400); // 400
export const userNotAlreadyVerified = new AppError('User not  verified', 403); // 403

// Error {message , cause , stack , name}
// Error.statusCode = 409
// Error {message , cause , stack , name , statusCode: 409 }
// custom class AppError >> Error & {statusCode}


// class User{
//     userName;
//     email;
//     password;
//     age
// }
// const user = new User();
// console.log(user);
//
// class Customer{
//     phone;
//     age;
//     address;
//     isVerified;
//     isDeleted;
//     constructor(phone,age,address) {
//         this.phone = phone;
//         this.age = age;
//         this.address = address;
//         this.isVerified = false;
//         this.isDeleted = false;
//     }
// }
// const customer1 = new Customer('01024708090' , 25 , 'Maddi')
// const customer2 = new Customer('01024708091' , 40 , 'Helwan')
// setTimeout(()=>{
//     console.log('customer 1')
//     console.log(customer1);
//     console.log('/////////////////////////////////////////////////////////')
// },1000)
// setTimeout(()=>{
//    console.log('customer 2')
//     console.log(customer2)
//     console.log('ended')
// },2000)
