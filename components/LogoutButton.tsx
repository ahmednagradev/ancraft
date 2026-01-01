"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";

export default function LogoutButton() {
    const router = useRouter();
    const { user, setUser, isLoading } = useAppContext(); // include isLoading

    const handleLogout = async () => {
        const confirmed = confirm("Are you sure you want to log out?");
        if (!confirmed) return;

        try {
            const res = await fetch("/api/auth/signout", { method: "POST" });

            if (!res.ok) {
                throw new Error("Failed to logout");
            }

            setUser(null); // clear client-side user state
            toast.success("Logged out successfully");
            router.push("/signin");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading || !user} // disabled while loading or no user
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${isLoading || !user
                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                    : "bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer"
                }`}
        >
            {isLoading ? "Loading..." : "Logout"}
        </button>
    );
}
