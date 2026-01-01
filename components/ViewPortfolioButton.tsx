"use client";

import { useAppContext } from "@/context/AppContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewPortfolioButton() {
    const { user, isLoading } = useAppContext();
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [actionLoading, setActionLoading] = useState(false); // track button click

    const router = useRouter();
    const username = user?.username;

    // Update portfolio URL once user is loaded
    useEffect(() => {
        if (username) {
            setPortfolioUrl(`${window.location.origin}/${username}`);
        }
    }, [username]);

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
        if (!username) return;
        setActionLoading(true); // disable button and show loader
        router.push(`/${username}`);
    };

    const isDisabled = !username || isLoading || actionLoading; // disable while loading

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
                onClick={handleViewPortfolio}
                disabled={isDisabled}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
            >
                View Live Portfolio {actionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            </button>

            <button
                onClick={handleCopyLink}
                disabled={isDisabled}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50 text-gray-300 font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
                {copied ? "Copied!" : "Copy Link"}
            </button>
        </div>
    );
}
