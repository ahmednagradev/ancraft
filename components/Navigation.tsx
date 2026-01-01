// components/Navigation.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navigation() {

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        href="/home"
                        className="flex items-center gap-2 sm:gap-3 group"
                    >
                        <motion.div
                            className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            ancraft
                        </motion.div>
                    </Link>

                    {/* Navigation Links Here */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}