import { auth } from "@/auth";
import { db } from "@repo/db/src";

// async function getBalance() {
//     const session = await auth();
//     const balance = await db.balance.findFirst({ where: { userId: session?.user.id } });
//     return {
//         amount: balance?.amount || 0,
//         locked: balance?.locked || 0
//     }
// }

const getBalance = async () => {
    const session = await auth();
  
    const balance = await db.$queryRawUnsafe<{ amount: number; locked: number }[]>(
      `SELECT amount, locked FROM "Balance" WHERE "userId" = $1 LIMIT 1`,
      session?.user.id
    );
  
    const result = balance[0];
  
    return {
      amount: result?.amount || 0,
      locked: result?.locked || 0,
    };
  };
  
  export default getBalance;
  