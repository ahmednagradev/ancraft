// components/ViewPortfolioButton.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ViewPortfolioButton() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Get token from cookies
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            try {
                // Decode JWT (just the payload, no verification needed client-side)
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUsername(payload.username);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    if (!username) {
        setUsername("ahmed")
    }

    return (
        <Link
            href={`/${username}`}
            target="_blank"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
            View My Portfolio →
        </Link>
    );
}