import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user: any) => {
    return jwt.sign({ user: user }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
}