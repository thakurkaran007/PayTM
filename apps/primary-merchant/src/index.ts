import express from 'express';
import { merchantRouter } from './merchant';

const app = express();  
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use("/api/v1/merchant", merchantRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});