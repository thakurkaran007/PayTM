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
            
            await tx.$queryRaw`
                UPDATE "Balance" 
                SET "amount" = "amount" - ${amount * 100} 
                WHERE "userId" = ${fromId}
            `;
            await tx.$queryRaw`
                UPDATE "Balance" 
                SET "amount" = "amount" + ${amount * 100} 
                WHERE "userId" = ${receiver?.id}
            `;
            await tx.p2pTranfer.create({
                data: {
                    senderId: fromId,
                    receiverId: receiver.id,
                    amount: amount * 100,
                    startTime: new Date(),
                }
            });
    })
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}