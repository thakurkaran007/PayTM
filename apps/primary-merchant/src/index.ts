import express from 'express';
import cors from 'cors';
import { merchantRouter } from './merchant.js';
;

const app = express();  
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))

app.use("/api/v1/merchant", merchantRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});