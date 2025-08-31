import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;


connectDB(process.env.MONGO_URI as string).then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
});
