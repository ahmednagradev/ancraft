// components/PortfolioForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoInput, infoSchema } from "@/schemas/infoSchema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectList from "./ProjectList";

interface PortfolioFormProps {
    initialData: any | null;
    mode: string;
}

export default function PortfolioForm({ initialData, mode }: PortfolioFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]); // start empty, populate later

    // Setup form with validation
    const { register, handleSubmit, formState, control, reset } = useForm<InfoInput>({
        resolver: zodResolver(infoSchema),
        defaultValues: {
            fullname: "",
            bio: "",
            description: "",
            socialLinks: [],
            contact: "",
            endNote: "",
            projects: [],
        },
    });

    // Populate form and projects when editing
    useEffect(() => {
        if (initialData) {
            reset({
                fullname: initialData.fullname || "",
                bio: initialData.bio || "",
                description: initialData.description || "",
                socialLinks: initialData.socialLinks || [],
                contact: initialData.contact || "",
                endNote: initialData.endNote || "",
                projects: initialData.projects || [],
            });
            setProjects(initialData.projects || []);
        }
    }, [initialData, reset]);


    const { errors } = formState;

    // Handle form submission
    const onSubmit = async (data: InfoInput) => {
        try {
            setIsLoading(true);

            // Add project IDs to form data
            const portfolioData = {
                ...data,
                projects: projects.map((p: any) => p._id),
            };

            // Choose endpoint based on mode (create or edit)
            const url = "/api/portfolio";
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
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

    // Handler when new project is added
    const handleProjectAdded = (newProject: any) => {
        setProjects([...projects, newProject]);
    };

    // Handler when project is updated
    const handleProjectUpdated = (updatedProject: any) => {
        setProjects(
            projects.map((p: any) =>
                p._id === updatedProject._id ? updatedProject : p
            )
        );
    };

    // Handler when project is deleted
    const handleProjectDeleted = (projectId: string) => {
        setProjects(projects.filter((p: any) => p._id !== projectId));
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Section */}
                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            {...register("fullname")}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="John Doe"
                        />
                        {errors.fullname && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <input
                            type="text"
                            {...register("bio")}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Full-stack developer passionate about web technologies"
                        />
                        {errors.bio && (
                            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={4}
                            placeholder="Tell us about yourself..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Contact</label>
                        <input
                            type="text"
                            {...register("contact")}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="email@example.com or phone number"
                        />
                        {errors.contact && (
                            <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Social Links (comma-separated)
                        </label>

                        <Controller
                            name="socialLinks"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://github.com/username, https://linkedin.com/in/username"
                                    value={field.value.join(", ")} // display array as comma-separated string
                                    onChange={(e) => {
                                        const links = e.target.value
                                            .split(",")
                                            .map((link) => link.trim())
                                            .filter(Boolean);
                                        field.onChange(links); // update RHF value as array
                                    }}
                                />
                            )}
                        />

                        {errors.socialLinks && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.socialLinks.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            End Note (Optional)
                        </label>
                        <textarea
                            {...register("endNote")}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={2}
                            placeholder="A closing message for your portfolio..."
                        />
                    </div>
                </div>

                {/* Projects Section */}
                <ProjectList
                    projects={projects}
                    onProjectAdded={handleProjectAdded}
                    onProjectUpdated={handleProjectUpdated}
                    onProjectDeleted={handleProjectDeleted}
                />

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading
                            ? "Saving..."
                            : mode === "edit"
                                ? "Update Portfolio"
                                : "Create Portfolio"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/home")}
                        className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}