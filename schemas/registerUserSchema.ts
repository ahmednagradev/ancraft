import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must contain least 3 characters").max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters and numbers"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
