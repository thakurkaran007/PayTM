import { db } from "@repo/db/src";
import { VerificationToken } from "@prisma/client";

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const result = await db.$queryRaw<VerificationToken[]>`
            SELECT * FROM "VerificationToken" WHERE token = ${token} LIMIT 1
        `;
        return result[0] ?? null;
    } catch (error) {
        return null;
    }
};

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const result = await db.$queryRaw<VerificationToken[]>`
            SELECT * FROM "VerificationToken" WHERE email = ${email} LIMIT 1
        `;
        return result[0] ?? null;
    } catch (error) {
        return null;
    }
};