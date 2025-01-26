import { auth } from "@/auth"
import { getUserByEmail } from "@/data/user";
import { db } from "@repo/db/src";

export const p2pTransaction = async (amount: number, email: string) => {
    try {
        const session = await auth();
        const userId = session?.user.id;
        if (!userId) return { error: "User not Found" };
        const reciever = await getUserByEmail(email);
        if (!reciever) return { error: "Reciever not found" };
    
        await db.$transaction([
            db.balance.update({
                where: { userId: userId },
                data: { amount: { decrement: amount } }
            }),
            db.balance.update({
                where: { userId:  reciever?.id},
                data: { amount: { increment: amount } }
            })
        ])
    
        return { success: "Money Sent Successfully" };
    } catch (error) {
        return { error: error };
    }
}