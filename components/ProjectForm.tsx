// components/ProjectForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

const projectFormSchema = z.object({
    projectLogo: z.string().optional(),
    projectName: z.string().min(1, "Project name is required"),
    projectTitle: z.string().min(1, "Project title is required"),
    projectImage: z.string().optional(),
    projectLinks: z.string(),
    projectDescription: z.string().min(1, "Project description is required"),
    projectFeatures: z.string().min(1, "Project features are required"),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
    mode: "create" | "edit";
    initialData?: any;
    onSuccess: (project: any) => void;
    onCancel: () => void;
}

export default function ProjectForm({
    mode,
    initialData,
    onSuccess,
    onCancel,
}: ProjectFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState } = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            projectLogo: initialData?.projectLogo || "",
            projectName: initialData?.projectName || "",
            projectTitle: initialData?.projectTitle || "",
            projectImage: initialData?.projectImage || "",
            projectLinks: initialData?.projectLinks?.join(", ") || "",
            projectDescription: initialData?.projectDescription || "",
            projectFeatures: initialData?.projectFeatures || "",
        },
    });

    const { errors } = formState;

    const onSubmit = async (data: ProjectFormData) => {
        try {
            setIsLoading(true);

            const projectLinksArray = data.projectLinks
                .split(",")
                .map((link) => link.trim())
                .filter((link) => link.length > 0);

            const projectData = {
                projectLogo: data.projectLogo || undefined,
                projectName: data.projectName,
                projectTitle: data.projectTitle,
                projectImage: data.projectImage || undefined,
                projectLinks: projectLinksArray,
                projectDescription: data.projectDescription,
                projectFeatures: data.projectFeatures,
            };

            const url =
                mode === "edit" ? `/api/projects/${initialData._id}` : "/api/projects";
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            toast.success(result.message);
            onSuccess(result.data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unexpected error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-linear-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    {mode === "edit" ? "Edit Project" : "New Project"}
                </h3>
            </div>

            <div className="space-y-5">
                {/* Project Name & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("projectName")}
                            className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm"
                            placeholder="My Awesome App"
                        />
                        {errors.projectName && (
                            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.projectName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("projectTitle")}
                            className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm"
                            placeholder="A web app for task management"
                        />
                        {errors.projectTitle && (
                            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.projectTitle.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        {...register("projectDescription")}
                        className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none text-sm"
                        rows={3}
                        placeholder="Describe your project in detail..."
                    />
                    {errors.projectDescription && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.projectDescription.message}
                        </p>
                    )}
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Features <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        {...register("projectFeatures")}
                        className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none text-sm"
                        rows={2}
                        placeholder="List the key features of your project..."
                    />
                    {errors.projectFeatures && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.projectFeatures.message}
                        </p>
                    )}
                </div>

                {/* Logo & Image URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Logo URL
                        </label>
                        <input
                            type="text"
                            {...register("projectLogo")}
                            className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Image URL
                        </label>
                        <input
                            type="text"
                            {...register("projectImage")}
                            className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm"
                            placeholder="https://example.com/screenshot.png"
                        />
                    </div>
                </div>

                {/* Project Links */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Links
                    </label>
                    <input
                        type="text"
                        {...register("projectLinks")}
                        className="w-full px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm"
                        placeholder="https://github.com/username/repo, https://demo.com"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                        Separate multiple links with commas
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-700/50">
                <button
                    onClick={handleSubmit(onSubmit)}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-5 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        mode === "edit" ? "Update Project" : "Add Project"
                    )}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 px-5 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 font-medium rounded-lg hover:bg-gray-700/50 hover:border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}