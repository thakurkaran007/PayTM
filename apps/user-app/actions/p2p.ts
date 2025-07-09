"use server";

import { auth } from "@/auth"
import getBalance from "@/data/balance";
import { getUserByEmail } from "@/data/user";
import { db } from "@repo/db/src";
import { v4 as uuidv4 } from "uuid";

export const p2pTransaction = async (amount: number, email: string) => {
    try {
        const session = await auth();
        const from = session?.user;
        const fromId = from?.id;
        const balance = await getBalance();
        
        if (!fromId) return { error: "User not Found" };
        if (!balance || amount*100 > balance.amount) return { error: "Insufficient Balance" };
        
        const receiver = await getUserByEmail(email);
        if (!receiver) return { error: "Email not found" };
        
        
        await db.$transaction(async (tx) => {
            tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromId} FOR UPDATE`;
            tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${receiver.id} FOR UPDATE`;

            await tx.balance.update({
                where: { userId: fromId },
                data: { amount: { decrement: amount * 100 } }
            });

            await tx.balance.update({
                where: { userId: receiver.id },
                data: { amount: { increment: amount * 100 } }
            });
            
            await tx.p2pTranfer.create({
                data: {
                    senderId: fromId,
                    receiverId: receiver.id,
                    amount: amount * 100,
                    startTime: new Date()
                }
            });

    })
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}