import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;