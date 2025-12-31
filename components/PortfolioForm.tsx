// components/PortfolioForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectList from "./ProjectList";

// Simple form schema without array complications
const portfolioFormSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  bio: z.string().min(1, "Bio is required"),
  description: z.string().min(1, "Description is required"),
  socialLinks: z.string(), // We'll handle as string and convert to array
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

      // Convert socialLinks string to array
      const socialLinksArray = data.socialLinks
        .split(",")
        .map((link) => link.trim())
        .filter((link) => link.length > 0);

      // Prepare data for API
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <input
              type="text"
              {...register("socialLinks")}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://github.com/username, https://linkedin.com/in/username"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple links with commas
            </p>
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

        <ProjectList
          projects={projects}
          onProjectAdded={handleProjectAdded}
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleProjectDeleted}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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