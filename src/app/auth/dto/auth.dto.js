import {z} from 'zod'


export const registerDTO = z.object({
    email: z.email().toLowerCase().trim(),
    name: z.string().min(2).max(20).trim(),
    password: z.string().min(8).max(16).trim(),
    dob:z.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
})
export const verifyAccountDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().length(6).trim()
})
export const loginDTO = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(8).max(16).trim(),
})
export const sendOTPDTO = z.object({
    email: z.email().toLowerCase().trim(),
})
export const resetDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().length(6),
    newPassword: z.string().min(8).max(16).trim(),
})
