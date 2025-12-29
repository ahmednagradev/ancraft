import { z } from "zod";

export const verifyUserSchema = z.object({
  verificationCode: z.string().length(6, "Verify code must contain 6 characters"),
});

export type VerifyUserInput = z.infer<typeof verifyUserSchema>;
