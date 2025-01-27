"use server";

import { auth } from "@/auth"
import getBalance from "@/data/balance";
import { getUserByEmail } from "@/data/user";
import { db } from "@repo/db/src";

export const p2pTransaction = async (amount: number, email: string) => {
    try {
        const session = await auth();
        const from = session?.user;
        const fromId = from?.id;
        if (!fromId) return { error: "User not Found" };
        
        const receiver = await getUserByEmail(email);
        if (!receiver) return { error: "Email not found" };
        
        await db.$transaction(async (tx) => {
            tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromId} FOR UPDATE`;

            const balance = await getBalance();
            if (!balance || amount*100 > balance.amount) return { error: "Insufficient Balance" };

            await db.balance.update({
                where: { userId: fromId },
                data: { amount: { decrement: amount*100 } }
            })
            await db.balance.update({
                where: { userId:  receiver?.id },
                data: { amount: { increment: amount*100 } }
            })
            await db.p2pTranfer.create({
                data: {
                    amount: amount*100,
                    startTime: new Date(),
                    senderId: fromId,
                    receiverId: receiver?.id
                }
            })
        })
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}