import { z } from "zod";

export const infoSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  bio: z.string().min(1, "Bio is required"),
  description: z.string().min(1, "Description is required"),
  socialLinks: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]), // ObjectId as string
  contact: z.string().min(1, "Contact is required"),
  endNote: z.string().optional(),
  createdBy: z.string().optional(), // ObjectId as string
});

export type InfoInput = z.infer<typeof infoSchema>;
