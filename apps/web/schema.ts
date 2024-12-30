import * as z from 'zod';
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const signUpSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, 'OTP must be 6 characters'),
    password: z.string().min(6, 'Password must be 6 characters'),
    name: z.string().min(1),
});