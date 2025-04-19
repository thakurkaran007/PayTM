import { db } from "@repo/db/dist";
import { serialize } from "cookie";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup", async (req, res) => {
    const { email, name } = req.body;
    const existingUser = await db.user.findFirst({
        where: {
            email
        }
    });
    if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
    }
    
    await db.$transaction(async (tx) => {
        const merchant = await tx.merchant.create({
            data: {
                email,
                name
            }
        });
        await tx.merchantAccount.create({
            data: {
                merchantId: merchant.id
            }  
        })
    })
    res.status(201).json({ message: "Merchant created successfully" });
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
        where: {
            email,
            password
        }
    });
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret")

    res.setHeader("Set-Cookie", serialize("token", token, {
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24
    }));

    res.status(200).json({ message: "Login successful", user });
})

export const merchantRouter = router;