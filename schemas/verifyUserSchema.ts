import { z } from "zod";

export const verifyUserSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().length(6),
});

export type VerifyUserInput = z.infer<typeof verifyUserSchema>;
