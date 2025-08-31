import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL environment variable is not defined");
}
export const redisClient = createClient({
    url: process.env.REDIS_URL
});


redisClient.connect().then(() => {
    console.log("Connected to Redis");
}).catch((err) => {
    console.error("Could not connect to Redis", err);
});





app.use("/api/v1", userRoutes);




connectDB(process.env.MONGO_URI as string).then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
});
