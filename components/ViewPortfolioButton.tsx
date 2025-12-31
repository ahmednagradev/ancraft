// components/ViewPortfolioButton.tsx
"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function ViewPortfolioButton() {

    const { user } = useAppContext();

    if (!user) {
        return <span>Loading...</span>;
    }

    return (
        <Link
            href={`/${user.username}`}
            target="_blank"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
            View My Portfolio →
        </Link>
    );
}