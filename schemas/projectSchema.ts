import { z } from "zod";

export const projectSchema = z.object({
  projectLogo: z.string().optional(),
  projectName: z.string().min(1, "Project name is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  projectImage: z.string().optional(),
  projectLinks: z.array(z.string()),
  projectDescription: z.string().min(1, "Project description is required"),
  projectFeatures: z.string().min(1, "Project features are required"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
