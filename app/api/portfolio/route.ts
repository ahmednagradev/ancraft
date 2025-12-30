// app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import dbConnect from "@/lib/dbConnect";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { Info } from "@/models/Info.models";
import { infoSchema } from "@/schemas/infoSchema";

// GET: Fetch user's portfolio
export async function GET() {
    await dbConnect();

    try {
        // Get authenticated user from JWT
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find portfolio for this user
        const portfolio = await Info.findOne({ createdBy: user._id }).populate("projects");

        return NextResponse.json(
            { success: true, data: portfolio },
            { status: 200 }
        );
    } catch (error) {
        console.error("Portfolio fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch portfolio" },
            { status: 500 }
        );
    }
}

// POST: Create new portfolio (one per user)
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

        // Check if user already has a portfolio
        const existingPortfolio = await Info.findOne({ createdBy: user._id });
        if (existingPortfolio) {
            return NextResponse.json(
                { success: false, message: "Portfolio already exists. Use PUT to update." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = infoSchema.parse(body);

        // Create portfolio with authenticated user's ID
        const portfolio = await Info.create({
            ...validatedData,
            createdBy: user._id,
        });

        return NextResponse.json(
            { success: true, message: "Portfolio created", data: portfolio },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid data", errors: error.issues },
                { status: 400 }
            );
        }
        console.error("Portfolio creation error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create portfolio" },
            { status: 500 }
        );
    }
}

// PUT: Update existing portfolio
export async function PUT(req: Request) {
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
        const validatedData = infoSchema.parse(body);

        // Update only the portfolio belonging to this user
        const portfolio = await Info.findOneAndUpdate(
            { createdBy: user._id },
            validatedData,
            { new: true, runValidators: true }
        );

        if (!portfolio) {
            return NextResponse.json(
                { success: false, message: "Portfolio not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Portfolio updated", data: portfolio },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid data", errors: error.issues },
                { status: 400 }
            );
        }
        console.error("Portfolio update error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update portfolio" },
            { status: 500 }
        );
    }
}