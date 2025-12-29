import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";

export async function GET() {
    await dbConnect();

    try {
        const infos = await Info.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: infos });
    } catch (error) {
        console.error("Error fetching Infos:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
