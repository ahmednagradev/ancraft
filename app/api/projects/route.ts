// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import dbConnect from "@/lib/dbConnect";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { Project } from "@/models/Project.models";
import { Info } from "@/models/Info.models";
import { projectSchema } from "@/schemas/projectSchema";

// POST: Create new project
export async function POST(req: Request) {
    await dbConnect();

    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = projectSchema.parse(body);

        // Create the project
        const project = await Project.create(validatedData);

        // Add project to user's portfolio
        await Info.findOneAndUpdate({ createdBy: user._id }, { $push: { projects: project._id } });

        return NextResponse.json(
            { success: true, message: "Project created", data: project },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid data", errors: error.issues },
                { status: 400 }
            );
        }
        console.error("Project creation error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create project" },
            { status: 500 }
        );
    }
}