import { db } from "@repo/db/dist/index.js";
import express from "express";
const app = express();

app.post("/hdfcWebHook", (req, res) => {
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount,
    }
})