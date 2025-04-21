import { db } from "@repo/db/src";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.$queryRawUnsafe<any[]>(
      `SELECT * FROM "User" WHERE email = $1 LIMIT 1`,
      email
    );
    return user[0] || null;
  } catch (error) {
    return null;
  }
};

export const getUserByID = async (id: string) => {
  try {
    const user = await db.$queryRawUnsafe<any[]>(
      `SELECT * FROM "User" WHERE id = $1 LIMIT 1`,
      id
    );
    return user[0] || null;
  } catch (error) {
    return null;
  }
};


// export const getUserByEmail = async (email: string) => {
//     try {
//         const user = await db.user.findUnique({ where: { email } });
//         return user;
//     } catch (error) {
//         return null;
//     }
// }
// export const getUserByID = async (id: string) => {
//     try {
//         const user = await db.user.findUnique({ where: { id } });
//         return user;
//     } catch (error) {
//         return null;
//     }
// }