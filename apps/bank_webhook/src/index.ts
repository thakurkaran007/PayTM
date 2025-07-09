import { db } from "@repo/db/dist";
import express from "express";

const app = express();
app.use(express.json());

app.post("/hdfc-web-hook", async (req, res) => {
  const paymentInfo = {
    token: req.body.token,
    tId: req.body.id,
    userId: req.body.userId,
    amount: Number(req.body.amount),
  };

  try {
    await db.$transaction(async (tx) => {
      // Lock the balance row for update (via raw SQL)
      await tx.$queryRawUnsafe(
        `SELECT * FROM "Balance" WHERE "userId" = $1 FOR UPDATE`,
        paymentInfo.userId
      );

      // Update amount
      await tx.balance.update({
        where: { userId: paymentInfo.userId },
        data: {
          amount: {
            increment: paymentInfo.amount * 100,
          },
        },
      });

      // Update transaction status
      await tx.onRampTransaction.update({
        where: {
          id: paymentInfo.tId,
          token: paymentInfo.token,
        },
        data: {
          status: "Success",
        },
      });

      // Decrease locked amount
      await tx.balance.update({
        where: { userId: paymentInfo.userId },
        data: {
          locked: {
            decrement: paymentInfo.amount * 100,
          },
        },
      });
    });

    console.log("captured");
    res.status(200).json({ message: "captured" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

app.listen(8989, () => {
  console.log("listening on port 8989");
});