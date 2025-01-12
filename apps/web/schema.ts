import * as z from 'zod';
import { ExtendedUser } from './next-auth';
import WebSocket from 'ws'
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const SignUpSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, 'OTP must be 6 characters'),
    password1: z.string().min(6, 'Password must be 6 characters'),
    password2: z.string().min(6, 'Password must be 6 characters'),
    name: z.string().min(1),
});
export type userType =  {
    socket: WebSocket | null;
    user: ExtendedUser;
}
export type onGoingCall = {
    participants: participants;
    isRinging: boolean;
}
export type participants = {
    caller: userType;
    reciever: userType;
}