"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { infoSchema, InfoInput } from "@/schemas/infoSchema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const InfoForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Using resolver without generic avoids TS errors
    const { register, handleSubmit, setValue, formState } = useForm({
        resolver: zodResolver(infoSchema),
        defaultValues: { socialLinks: [], projects: [] }, // projects kept internally
    });
    const { errors } = formState;

    const onSubmit = async (data: InfoInput) => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            // Parse JSON safely
            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Something went wrong");

            toast.success("Info created successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
                <input placeholder="Full Name" {...register("fullname")} />
                {errors.fullname && <p>{errors.fullname.message}</p>}
            </div>

            {/* Bio */}
            <div>
                <textarea placeholder="Bio" {...register("bio")} />
                {errors.bio && <p>{errors.bio.message}</p>}
            </div>

            {/* Description */}
            <div>
                <textarea placeholder="Description" {...register("description")} />
                {errors.description && <p>{errors.description.message}</p>}
            </div>

            {/* Social Links */}
            <div>
                <input
                    placeholder="Social links (comma separated)"
                    onChange={(e) =>
                        setValue(
                            "socialLinks",
                            e.target.value
                                .split(",")
                                .map((link) => link.trim())
                                .filter(Boolean)
                        )
                    }
                />
            </div>

            {/* Contact */}
            <div>
                <input placeholder="Contact" {...register("contact")} />
                {errors.contact && <p>{errors.contact.message}</p>}
            </div>

            {/* End Note */}
            <div>
                <textarea placeholder="End note (optional)" {...register("endNote")} />
            </div>

            {/* Add Project Button */}
            <div>
                <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    + Add New Project
                </button>
            </div>

            {/* Submit */}
            <div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Submit"}
                </button>
            </div>
        </form>
    );
};

export default InfoForm;
