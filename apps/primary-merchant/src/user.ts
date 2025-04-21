import { db } from "@repo/db/dist";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { authMiddleware } from "./auth";

const router = Router();

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
        where: {
            email,
            password
        }
    });
    if (!user || !user?.password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const check = bcrypt.compareSync(password, user.password);

    if (!check) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret");

    res.setHeader("Set-Cookie", serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    }))

    res.status(200).json({ message: "Login successful", user });
})

router.post("/transfer", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const { amount, merchantId } = req.body;

    const merchant = await db.merchant.findFirst({
        where: {
            id: merchantId
        }
    })

    if (!merchant) {
        res.status(401).json({ message: "Merchant not found" });
        return;
    }

    db.$transaction(async (tx) => {
        const user = await tx.userAccount.findUnique({
            where: {
                id
            }
        })
        if (!user || !user.amount) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        if (user.amount * 100 < amount) {
            res.status(401).json({ message: "Insufficient balance" });
            return;
        }

        await tx.$executeRaw`SET * FROM users WHERE id = ${id} FOR UPDATE`; //Lock the row

        await tx.userAccount.update({
            where: {
                id
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })

        await tx.merchantAccount.update({
            where: {
                id: merchantId
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        })
    })
})