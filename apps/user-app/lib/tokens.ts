import { v4 as uuidv4 } from 'uuid'; // use this if Prisma uses uuid()
import { db } from '@repo/db/src';
import { VerificationToken } from '@prisma/client';

export const generateVerificationToken = async (email: string): Promise<VerificationToken | null> => {
    const id = uuidv4(); // generate it yourself
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    const existingToken = await db.$queryRaw<VerificationToken[]>`
        SELECT * FROM "VerificationToken" WHERE email = ${email} LIMIT 1
    `;

    if (existingToken[0]) {
        await db.$executeRaw`
            DELETE FROM "VerificationToken" WHERE id = ${existingToken[0].id}
        `;
    }

    const result = await db.$queryRaw<VerificationToken[]>`
        INSERT INTO "VerificationToken" (id, token, expires, email)
        VALUES (${id}, ${token}, ${expires}, ${email})
        RETURNING *
    `;

    return result[0] ?? null;
};