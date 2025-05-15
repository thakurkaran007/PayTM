"use server";

import { auth } from "@/auth";
import { db } from "@repo/db/src";
import { v4 as uuidv4 } from "uuid";

export const createOnRampTransaction = async (amount: number, provider: string) => {
    const session = await auth();
    const token = Math.random().toString();
    const userId = session?.user.id;
    if (!userId) return { error: "User did not sign in" };

    const scaledAmount = Math.round((Math.floor(amount * 100) / 100) * 100);
    const id = uuidv4();

    await db.$executeRaw`
        INSERT INTO "OnRampTransaction" (id, "userId", amount, status, "startTime", provider, token)
        VALUES (${id}, ${userId}, ${scaledAmount}, 'Processing', ${new Date()}, ${provider}, ${token})
    `;

    await db.$executeRaw`
        UPDATE "Balance"
        SET locked = locked + ${scaledAmount}
        WHERE "userId" = ${userId}
    `;

    return { success: "On Ramp Transaction Added" };
};
