// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import dbConnect from "@/lib/dbConnect";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { Project } from "@/models/Project.models";
import { Info } from "@/models/Info.models";
import { projectSchema } from "@/schemas/projectSchema";

// PUT: Update project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    // Verify project belongs to user's portfolio
    const portfolio = await Info.findOne({
      createdBy: user._id,
      projects: id
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the project
    const project = await Project.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: "Project updated", data: project },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Project update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE: Remove project
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify project belongs to user's portfolio
    const portfolio = await Info.findOne({
      createdBy: user._id,
      projects: id
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    // Remove from portfolio
    await Info.findOneAndUpdate(
      { createdBy: user._id },
      { $pull: { projects: id } }
    );

    // Delete the project
    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Project deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}