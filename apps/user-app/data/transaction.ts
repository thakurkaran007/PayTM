import { auth } from "@/auth";
import { db } from "@repo/db/src";

export const getOnRampTransactions = async() => {
    const session = await auth();
    const txns = await db.onRampTransaction.findMany({ where: { userId: session?.user.id }, orderBy: { startTime: "asc" } });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}