import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user: string) => {
    return jwt.sign({ id: user }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
}