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
export const getP2pTransactions = async () => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) return [];

    const txns = await db.p2pTranfer.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        orderBy: { startTime: "asc" },
        select: {
            startTime: true,
            sender: true,
            receiver: true,
            amount: true
        }
    });

    return txns.map((t) => ({
        time: t.startTime,
        amount: t.amount,
        sender: t.sender,
        receiver: t.receiver
    }));
};
