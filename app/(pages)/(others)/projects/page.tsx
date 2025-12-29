"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectInput } from "@/schemas/projectSchema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ProjectForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, formState } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { projectLinks: [] },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "projectLinks",
  });

  const { errors } = formState;

  const onSubmit = async (data: ProjectInput) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/others/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      toast.success("Project created successfully");
      router.push("/dashboard"); // redirect after creation
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Project Name */}
      <div>
        <input placeholder="Project Name" {...register("projectName")} />
        {errors.projectName && <p>{errors.projectName.message}</p>}
      </div>

      {/* Project Title */}
      <div>
        <input placeholder="Project Title" {...register("projectTitle")} />
        {errors.projectTitle && <p>{errors.projectTitle.message}</p>}
      </div>

      {/* Project Logo */}
      <div>
        <input placeholder="Project Logo URL (optional)" {...register("projectLogo")} />
      </div>

      {/* Project Image */}
      <div>
        <input placeholder="Project Image URL (optional)" {...register("projectImage")} />
      </div>

      {/* Project Links (dynamic) */}
      <div className="flex flex-col gap-2">
        <label>Project Links</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              placeholder={`Link ${index + 1}`}
              {...register(`projectLinks.${index}` as const)}
              className="flex-1"
            />
            <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 rounded">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append("")} className="bg-blue-500 text-white px-3 py-1 rounded">
          + Add Link
        </button>
      </div>

      {/* Project Description */}
      <div>
        <textarea placeholder="Project Description" {...register("projectDescription")} />
        {errors.projectDescription && <p>{errors.projectDescription.message}</p>}
      </div>

      {/* Project Features */}
      <div>
        <textarea placeholder="Project Features" {...register("projectFeatures")} />
        {errors.projectFeatures && <p>{errors.projectFeatures.message}</p>}
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

export default ProjectForm;
