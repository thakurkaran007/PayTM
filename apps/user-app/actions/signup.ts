"use server";

import { v4 as uuidv4 } from 'uuid'; // at the top
import { db } from "@repo/db/src/index";
import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schema";
import * as z from "zod";
import { User } from "@prisma/client";

const signup = async (values: z.infer<typeof SignUpSchema>) => {
    const validation = SignUpSchema.safeParse(values);
    if (!validation.success) {
        return { error: "Invalid input" };
    }

    const { email, password1, password2, name } = validation.data;

    if (password1 !== password2) {
        return { error: "Passwords do not match" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password1, 10);

        const id = uuidv4(); // generate ID manually

        await db.$transaction(async (tx) => {
            const users = await tx.$queryRaw<User[]>`
                INSERT INTO "User" (id, name, email, password)
                VALUES (${id}, ${name}, ${email}, ${hashedPassword})
                RETURNING *;
            `;
            const user = users[0];
            if (!user) throw new Error("User insert failed");

            await tx.$executeRaw`
                INSERT INTO "Balance" (id, amount, locked, "userId")
                VALUES (${id}, 10000000, 0, ${user.id});
            `;
        });

        return { success: "Account Created Successfully!" };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while creating the user" };
    }
};

export default signup;