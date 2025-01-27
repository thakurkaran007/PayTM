"use server";

import { auth } from "@/auth"
import getBalance from "@/data/balance";
import { getUserByEmail } from "@/data/user";
import { db } from "@repo/db/src";

export const p2pTransaction = async (amount: number, email: string) => {
    try {
        const session = await auth();
        const userId = session?.user.id;
        if (!userId) return { error: "User not Found" };
        
        const balance = await getBalance();

        if (amount*100 > balance.amount) return { error: "Insufficient Balance" };

        const reciever = await getUserByEmail(email);
        if (!reciever) return { error: "Reciever not found" };

        await db.$transaction([
            db.balance.update({
                where: { userId: userId },
                data: { amount: { decrement: amount*100 } }
            }),
            db.balance.update({
                where: { userId:  reciever?.id},
                data: { amount: { increment: amount*100 } }
            })
        ])
    
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}