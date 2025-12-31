// components/LoadingSkeleton.tsx
"use client";

export function PageLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Header Skeleton */}
                <div className="mb-8 sm:mb-12 animate-pulse">
                    <div className="h-10 sm:h-12 bg-gray-800/50 rounded-xl w-2/3 mb-3" />
                    <div className="h-5 bg-gray-800/30 rounded-lg w-1/3" />
                </div>

                {/* Card Skeleton */}
                <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 lg:p-10 animate-pulse">
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-800/50 rounded-lg w-1/4" />
                        <div className="h-20 bg-gray-800/30 rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 bg-gray-800/30 rounded-xl" />
                            <div className="h-24 bg-gray-800/30 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800/50 p-5 sm:p-6 animate-pulse"
                        >
                            <div className="h-4 bg-gray-800/50 rounded w-1/2 mb-3" />
                            <div className="h-8 bg-gray-800/30 rounded-lg w-1/3" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function FormLoadingSkeleton() {
    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 shadow-2xl animate-pulse">
                <div className="space-y-5 sm:space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i}>
                            <div className="h-4 bg-gray-800/50 rounded w-1/4 mb-2" />
                            <div className="h-12 bg-gray-800/30 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ProjectLoadingSkeleton() {
    return (
        <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 shadow-2xl">
            <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gray-800/50 rounded-full" />
                    <div className="h-6 bg-gray-800/50 rounded-lg w-1/4" />
                </div>

                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6"
                        >
                            <div className="flex gap-4 mb-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800/50 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-800/50 rounded w-2/3" />
                                    <div className="h-4 bg-gray-800/30 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-800/30 rounded w-full" />
                                <div className="h-4 bg-gray-800/30 rounded w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PortfolioLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
            <div className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30 animate-pulse">
                <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
                    <div className="h-14 bg-gray-800/50 rounded-xl w-2/3 mb-6" />
                    <div className="h-8 bg-gray-800/30 rounded-lg w-1/2 mb-4" />
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-800/20 rounded w-full" />
                        <div className="h-6 bg-gray-800/20 rounded w-5/6" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
                <div className="space-y-8">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 lg:p-10 animate-pulse"
                        >
                            <div className="flex gap-6 mb-6">
                                <div className="w-20 h-20 bg-gray-800/50 rounded-2xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-8 bg-gray-800/50 rounded-lg w-1/3" />
                                    <div className="h-6 bg-gray-800/30 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-72 bg-gray-800/30 rounded-2xl mb-6" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-800/20 rounded w-full" />
                                <div className="h-4 bg-gray-800/20 rounded w-5/6" />
                                <div className="h-4 bg-gray-800/20 rounded w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}