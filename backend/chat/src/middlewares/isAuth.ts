import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}
export interface AuthenticatedRequest extends Request {
    user?: IUser | null; // Add the user property to the request object
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


export default isAuth;