// Redirection logic need some changes...

import { NextResponse } from "next/server";
import { loginUserSchema } from "@/schemas/loginUserSchema";
import { User } from "@/models/User.models";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const validatedData = loginUserSchema.parse(body);

        console.log("Validated login data =", validatedData);

        const { email, password } = validatedData;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )
        }
        
        if (!user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Please verify you account before logging in" },
                { status: 403 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Logged in successfully" },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid login data" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}