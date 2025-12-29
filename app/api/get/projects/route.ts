import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Project } from "@/models/Project.models";

export async function GET() {
    await dbConnect();

    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching Projects:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
