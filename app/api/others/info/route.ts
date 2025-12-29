import { NextResponse } from "next/server";
import { infoSchema } from "@/schemas/infoSchema";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";
import { ZodError } from "zod";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();

        // Validate input
        const validatedData = infoSchema.parse(body);

        // Create new Info document
        const newInfo = new Info(validatedData);
        await newInfo.save();

        return NextResponse.json(
            { success: true, message: "Info created successfully", data: newInfo },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid input data", errors: error.issues },
                { status: 400 }
            );
        }

        console.error("Error creating Info:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
