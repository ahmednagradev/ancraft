// components/ProjectForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

// Simple form schema
const projectFormSchema = z.object({
    projectLogo: z.string().optional(),
    projectName: z.string().min(1, "Project name is required"),
    projectTitle: z.string().min(1, "Project title is required"),
    projectImage: z.string().optional(),
    projectLinks: z.string(), // Handle as string
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

            // Convert projectLinks string to array
            const projectLinksArray = data.projectLinks
                .split(",")
                .map((link) => link.trim())
                .filter((link) => link.length > 0);

            // Prepare data for API
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
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">
                {mode === "edit" ? "Edit Project" : "New Project"}
            </h3>

            <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                    type="text"
                    {...register("projectName")}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="My Awesome App"
                />
                {errors.projectName && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                    type="text"
                    {...register("projectTitle")}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="A web app for task management"
                />
                {errors.projectTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    {...register("projectDescription")}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Describe your project..."
                />
                {errors.projectDescription && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.projectDescription.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                <textarea
                    {...register("projectFeatures")}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Key features of your project..."
                />
                {errors.projectFeatures && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.projectFeatures.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Project Logo URL (Optional)</label>
                <input
                    type="text"
                    {...register("projectLogo")}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://example.com/logo.png"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Project Image URL (Optional)</label>
                <input
                    type="text"
                    {...register("projectImage")}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://example.com/screenshot.png"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Project Links (comma-separated)
                </label>
                <input
                    type="text"
                    {...register("projectLinks")}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://github.com/username/repo, https://demo.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Separate multiple links with commas
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : mode === "edit" ? "Update" : "Add Project"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}