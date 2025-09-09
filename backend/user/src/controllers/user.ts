import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../models/User.js";

export const loginUser = TryCatch(async (req, res) => {

    const {email} = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const rateLimitKey = `otp:ratelimit:${email}`;
    const currentLimit = await redisClient.get(rateLimitKey);
    if (currentLimit && parseInt(currentLimit) >= 5) {
        return res.status(429).json({ message: "Too many login attempts. Please try again later." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });


    const message = {        
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
    };

    await publishToQueue("send_otp", JSON.stringify(message));

    // Your login logic here
    res.status(200).json({ message: "Otp sent to your mail" });
});


export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    if (storedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    await redisClient.del(otpKey);

    let user = await User.findOne({ email });

    if(!user){
        const name = email.slice(0, 8);
        user = await User.create({ name, email });
    }

    const token = generateToken(user);
    

    // Your user verification logic here
    res.status(200).json({ message: "User verified successfully", user, token });
});



export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    // Your user profile logic here
    res.status(200).json({ user: req.user });
});


export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    user.name = name;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({ message: "Name updated successfully", user, token });
});


export const getAllUsers = TryCatch(async (req:AuthenticatedRequest, res) => {
    const users = await User.find()
    res.status(200).json({ users });
});


export const getAUser = TryCatch(async (req:AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
});