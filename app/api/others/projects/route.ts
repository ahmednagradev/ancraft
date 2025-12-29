import { NextResponse } from "next/server";
import { projectSchema } from "@/schemas/projectSchema";
import dbConnect from "@/lib/dbConnect";
import { Project } from "@/models/Project.models";
import { ZodError } from "zod";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();

        const validatedData = projectSchema.parse(body);

        const newProject = new Project(validatedData);
        await newProject.save();

        return NextResponse.json(
            { success: true, message: "Project created successfully", data: newProject },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid input data", errors: error.issues },
                { status: 400 }
            );
        }

        console.error("Error creating project:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
