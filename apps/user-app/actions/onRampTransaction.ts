"use server";

import { auth } from "@/auth";
import { db } from "@repo/db/src";

export const createOnRampTransaction = async (amount: number, provider: string) => {
    const session = await auth();
    const token = Math.random().toString();
    const userId = session?.user.id;
    if (!userId) return { error: "User did not sign in" };

    const scaledAmount = Math.round((Math.floor(amount * 100) / 100) * 100);

    await db.onRampTransaction.create({
        data: {
            userId,
            amount: scaledAmount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token
        }
    });
    await db.balance.update({
        where: {
            userId
        },
        data: {
            locked: {
                increment: scaledAmount
            }
        }
    });
    return { success: "On Ramp Transaction Added" };
};
