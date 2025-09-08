import express from 'express';
import dotenv from 'dotenv';
import { startSendOtpComsumer } from './consumer.js';

dotenv.config();

startSendOtpComsumer();

const app = express();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Mail service is listening on port ${PORT}`);
});