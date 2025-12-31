// app/[username]/page.tsx

import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.models";
import { Info } from "@/models/Info.models";
import "@/models/Project.models";

export default async function PublicPortfolioPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    await dbConnect();
    const { username } = await params;

    // Find user by username
    const user = await User.findOne({ username }).select("_id username");

    if (!user) {
        notFound();
    }

    // Find their portfolio with populated projects
    const portfolio = await Info.findOne({ createdBy: (user._id) }).populate("projects");

    if (!portfolio) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
                <div className="text-center px-6">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                        <div className="relative w-24 h-24 bg-linear-to-br from-gray-800 to-gray-900 rounded-full border border-gray-700/50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">No Portfolio Yet</h1>
                    <p className="text-gray-400 text-lg">This user hasn't created a portfolio.</p>
                </div>
            </div>
        );
    }

    // Convert to plain object
    const portfolioData = JSON.parse(JSON.stringify(portfolio));

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative">
                {/* Hero Section */}
                <section className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4 sm:mb-6">
                                {portfolioData.fullname}
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium">
                                {portfolioData.bio}
                            </p>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {portfolioData.description}
                            </p>

                            {/* Social Links */}
                            {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-8">
                                    {portfolioData.socialLinks.map((link: string, index: number) => (
                                        <a
                                            key={index}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group px-5 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            {new URL(link).hostname?.replace("www.", "")}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                {portfolioData.projects && portfolioData.projects.length > 0 && (
                    <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
                        <div className="flex items-center gap-3 mb-10 sm:mb-12">
                            <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-blue-500 rounded-full" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">Projects</h2>
                            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold rounded-full">
                                {portfolioData.projects.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:gap-10">
                            {portfolioData.projects.map((project: any, index: number) => (
                                <div
                                    key={project._id}
                                    className="group bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 hover:border-gray-700/50 p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:scale-[1.01]"
                                >
                                    {/* Project Header */}
                                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                                        {project.projectLogo && (
                                            <div className="relative shrink-0">
                                                <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl" />
                                                <img
                                                    src={project.projectLogo}
                                                    alt={project.projectName}
                                                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-700/50"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                                                    {project.projectName}
                                                </h3>
                                                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-full whitespace-nowrap">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <p className="text-lg text-gray-400">{project.projectTitle}</p>
                                        </div>
                                    </div>

                                    {/* Project Image */}
                                    {project.projectImage && (
                                        <div className="relative mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                                            <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 to-transparent z-10" />
                                            <img
                                                src={project.projectImage}
                                                alt={project.projectName}
                                                className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Project Description */}
                                    <div className="mb-6">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                            {project.projectDescription}
                                        </p>
                                    </div>

                                    {/* Project Features */}
                                    <div className="mb-6 p-5 sm:p-6 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
                                        <h4 className="flex items-center gap-2 font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">
                                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Key Features
                                        </h4>
                                        <p className="text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                                            {project.projectFeatures}
                                        </p>
                                    </div>

                                    {/* Project Links */}
                                    {project.projectLinks && project.projectLinks.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {project.projectLinks.map((link: string, linkIndex: number) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/link inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4 group-hover/link:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <span className="truncate max-w-50 sm:max-w-none">
                                                        {link.length > 40 ? link.substring(0, 40) + '...' : link}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                <section className="border-t border-gray-800/50 backdrop-blur-xl bg-gray-900/30">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-linear-to-b from-emerald-500 to-emerald-600 rounded-full" />
                                <h2 className="text-3xl sm:text-4xl font-bold text-white">Get In Touch</h2>
                            </div>
                            <p className="text-base sm:text-lg text-gray-300 mb-6">
                                Feel free to reach out:{" "}
                                <a
                                    href={portfolioData.contact.includes('@') ? `mailto:${portfolioData.contact}` : `tel:${portfolioData.contact}`}
                                    className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    {portfolioData.contact}
                                </a>
                            </p>
                            {portfolioData.endNote && (
                                <p className="text-gray-400 italic border-l-4 border-gray-700 pl-4 py-2">
                                    {portfolioData.endNote}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                            <p>
                                © {new Date().getFullYear()} {portfolioData.fullname}. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}