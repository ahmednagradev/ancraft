// components/PortfolioForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectList from "./ProjectList";

const portfolioFormSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    bio: z.string().min(1, "Bio is required"),
    description: z.string().min(1, "Description is required"),
    socialLinks: z.string(),
    contact: z.string().min(1, "Contact is required"),
    endNote: z.string().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

interface PortfolioFormProps {
    initialData: any | null;
    mode: string;
}

export default function PortfolioForm({ initialData, mode }: PortfolioFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState(initialData?.projects || []);

    const { register, handleSubmit, formState } = useForm<PortfolioFormData>({
        resolver: zodResolver(portfolioFormSchema),
        defaultValues: {
            fullname: initialData?.fullname || "",
            bio: initialData?.bio || "",
            description: initialData?.description || "",
            socialLinks: initialData?.socialLinks?.join(", ") || "",
            contact: initialData?.contact || "",
            endNote: initialData?.endNote || "",
        },
    });

    const { errors } = formState;

    const onSubmit = async (data: PortfolioFormData) => {
        try {
            setIsLoading(true);

            const socialLinksArray = data.socialLinks
                .split(",")
                .map((link) => link.trim())
                .filter((link) => link.length > 0);

            const portfolioData = {
                fullname: data.fullname,
                bio: data.bio,
                description: data.description,
                socialLinks: socialLinksArray,
                contact: data.contact,
                endNote: data.endNote || "",
                projects: projects.map((p: any) => p._id),
            };

            const url = "/api/portfolio";
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(portfolioData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            toast.success(result.message);
            router.push("/home");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unexpected error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectAdded = (newProject: any) => {
        setProjects([...projects, newProject]);
    };

    const handleProjectUpdated = (updatedProject: any) => {
        setProjects(
            projects.map((p: any) =>
                p._id === updatedProject._id ? updatedProject : p
            )
        );
    };

    const handleProjectDeleted = (projectId: string) => {
        setProjects(projects.filter((p: any) => p._id !== projectId));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black py-8 sm:py-12">
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
                        {mode === "edit" ? "Edit Portfolio" : "Create Portfolio"}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        {mode === "edit"
                            ? "Update your portfolio information and projects"
                            : "Fill in your details to create your professional portfolio"
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Personal Information Section */}
                    <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8">
                            <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-full" />
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            {/* Full Name */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("fullname")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="John Doe"
                                />
                                {errors.fullname && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.fullname.message}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bio <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("bio")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="Full-stack developer passionate about web technologies"
                                />
                                {errors.bio && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.bio.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                                    rows={4}
                                    placeholder="Tell us about yourself, your experience, and what drives you..."
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("contact")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="email@example.com or +1234567890"
                                />
                                {errors.contact && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.contact.message}
                                    </p>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Social Links
                                </label>
                                <input
                                    type="text"
                                    {...register("socialLinks")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="https://github.com/username, https://linkedin.com/in/username"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Separate multiple links with commas
                                </p>
                            </div>

                            {/* End Note */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Note
                                </label>
                                <textarea
                                    {...register("endNote")}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                                    rows={3}
                                    placeholder="A closing message for your portfolio visitors..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <ProjectList
                        projects={projects}
                        onProjectAdded={handleProjectAdded}
                        onProjectUpdated={handleProjectUpdated}
                        onProjectDeleted={handleProjectDeleted}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {mode === "edit" ? "Update Portfolio" : "Create Portfolio"}
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/home")}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-gray-800/50 border border-gray-700/50 text-gray-300 font-medium rounded-xl sm:rounded-2xl hover:bg-gray-700/50 hover:border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}