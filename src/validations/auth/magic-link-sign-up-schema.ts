import { z } from "zod";

export const magicLinkSignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim()
    .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .trim()
    .regex(/^[a-zA-Z]+$/, "Last name can only contain letters")
    .optional()
    .or(z.literal("")),
  email: z.string().email({ message: "Invalid email address" }).trim(),
});

export type MagicLinkSignUpValues = z.infer<typeof magicLinkSignUpSchema>;