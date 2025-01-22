"use server"

import { sendOtp } from "@/lib/mail"

export const send = async (email: string) => {
    await sendOtp(email);
    return { success: "OTP sent" };
}