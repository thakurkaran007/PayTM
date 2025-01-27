import { db } from "@repo/db/dist";

import express from "express";
const app = express();
app.use(express.json());


app.post("/hdfcWebHook", async (req, res) => {
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.userId,
        amount: Number(req.body.amount),
    }
    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: paymentInfo.userId
                },
                data: {
                    amount: {
                        increment: paymentInfo.amount*100
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
        console.log("captured");
        res.status(200).json({ message: "captured" });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: error });
    }
})

app.listen(8989, () => {
    console.log("listening on port 8989");
})