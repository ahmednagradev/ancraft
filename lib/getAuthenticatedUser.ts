import { NextRequest } from "next/server";
import dbConnect from "./dbConnect"
import { verifyJwt } from "./verifyJwt";
import { User } from "@/models/User.models";

export const getAuthenticatedUser = async (req: NextRequest) => {
    await dbConnect();

    const token = req.cookies.get("token")?.value
    if (!token) {
        throw new Error("Unauthorized: No token found");
    }

    const { valid, payload } = verifyJwt(token);
    if (!valid) {
        throw new Error("Unauthorized: Invalid or expired token")
    }

    const userId = (payload as any).id;

    const user = await User.findById(userId).select("-password -verificationCode -verificationCodeExpiry")
    if (!user) {
        throw new Error("Unauthorized: User not found");
    }

    return user;
}