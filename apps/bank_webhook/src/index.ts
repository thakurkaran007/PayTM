import { db } from "@repo/db/dist/index.js";

import express from "express";
const app = express();

app.post("/hdfcWebHook", async (req, res) => {
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount,
    }
    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: paymentInfo.userId
                },
                data: {
                    amount: {
                        increment: paymentInfo.amount
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInfo.token
                },
                data: {
                    status: "Success"
                }
            })
        ])
        res.status(200).json({ message: "captured" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})