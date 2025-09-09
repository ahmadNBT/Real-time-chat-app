import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../models/User.js";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null; // You can replace 'any' with your user type
}


export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHaeder = req.headers.authorization;

        if (!authHaeder || !authHaeder.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please Login, No token provided" });
            return
        }

        const token = authHaeder.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Please Login, No token provided" });
            return
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decodedValue){
            res.status(401).json({ message: "Please Login, Invalid token" });
            return
        }

        req.user = decodedValue.user

        next();

    } catch (error) {
        res.status(401).json({ message: "Please Login, JWT Error" });
    }

}