"use server";

import { auth } from "@/auth"
import getBalance from "@/data/balance";
import { getUserByEmail } from "@/data/user";
import { db } from "@repo/db/src";
import { v4 as uuidv4 } from "uuid";

export const p2pTransaction = async (amount: number, email: string) => {
    try {
        console.log("P2P Transaction", amount, email);
        const session = await auth();
        const from = session?.user;
        const fromId = from?.id;
        if (!fromId) return { error: "User not Found" };
        
        const receiver = await getUserByEmail(email);
        if (!receiver) return { error: "Email not found" };
        
        await db.$transaction(async (tx) => {
            tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromId} FOR UPDATE`;
            tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${receiver.id} FOR UPDATE`;

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
            await tx.$executeRaw`
                INSERT INTO "p2pTranfer" (id, "senderId", "receiverId", amount, "startTime")
                VALUES (${uuidv4()}, ${fromId}, ${receiver?.id}, ${amount * 100}, ${new Date()})
            `
    })
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}