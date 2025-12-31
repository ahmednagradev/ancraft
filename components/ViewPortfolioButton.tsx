// components/ViewPortfolioButton.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ViewPortfolioButton() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { user } = useAppContext();
    const username = user?.username;

    const portfolioUrl = username ? `${window.location.origin}/${username}` : "";

    const handleCopyLink = async () => {
        if (portfolioUrl) {
            try {
                await navigator.clipboard.writeText(portfolioUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    const handleViewPortfolio = () => {
        if (username) {
            router.push(`/${username}`);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
                onClick={handleViewPortfolio}
                disabled={!username}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
            >
                <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                <span className="text-sm sm:text-base">View Live Portfolio</span>
            </button>

            <button
                onClick={handleCopyLink}
                disabled={!username}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50 text-gray-300 font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
                {copied ? (
                    <>
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-emerald-400 text-sm sm:text-base">Copied!</span>
                    </>
                ) : (
                    <>
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                        </svg>
                        <span className="text-sm sm:text-base">Copy Link</span>
                    </>
                )}
            </button>
        </div>
    );
}