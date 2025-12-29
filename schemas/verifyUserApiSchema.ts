import { z } from "zod";

export const verifyUserApiSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().length(6, "Verify code must contain 6 characters"),
});

export type VerifyUserApiInput = z.infer<typeof verifyUserApiSchema>;
