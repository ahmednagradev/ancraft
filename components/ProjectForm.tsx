// components/ProjectForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectInput, projectSchema } from "@/schemas/projectSchema";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectFormProps {
    mode: "create" | "edit";
    initialData?: any;
    onSuccess: (project: any) => void;
    onCancel: () => void;
}

export default function ProjectForm({ mode, initialData, onSuccess, onCancel }: ProjectFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Setup form with validation
    const { register, handleSubmit, formState, setValue } = useForm<ProjectInput>({
        resolver: zodResolver(projectSchema),
        defaultValues: initialData || { projectLinks: [] },
    });

    const { errors } = formState;

    // Handle form submission
    const onSubmit = async (data: ProjectInput) => {
        try {
            setIsLoading(true);

            // Choose endpoint and method based on mode
            const url =
                mode === "edit" ? `/api/projects/${initialData._id}` : "/api/projects";
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            toast.success(result.message);
            onSuccess(result.data); // Pass new/updated project back to parent
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unexpected error");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle project deletion (only in edit mode)
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            setIsLoading(true);

            const res = await fetch(`/api/projects/${initialData._id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to delete");
            }

            toast.success(result.message);
            onSuccess(null); // Signal deletion to parent
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
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
                    onChange={(e) => {
                        // Convert comma-separated string to array
                        const links = e.target.value
                            .split(",")
                            .map((link) => link.trim())
                            .filter((link) => link.length > 0);
                        setValue("projectLinks", links);
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : mode === "edit" ? "Update" : "Add Project"}
                </button>

                <button type="button" className="px-5 py-2.5 border rounded-lg hover:bg-gray-50" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}