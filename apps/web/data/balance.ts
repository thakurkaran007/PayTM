import { auth } from "@/auth";
import { getUser } from "@/hooks/getUser";
import { db } from "@repo/db/src";

async function getBalance() {
    const session = await auth();
    const balance = await db.balance.findFirst({ where: { userId: session?.user.id } });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}
export default getBalance;