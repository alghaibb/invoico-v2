import { z } from "zod";

export const resendOTPSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
});

export type ResendOTPValues = z.infer<typeof resendOTPSchema>;