import { z } from "zod";

export const magicLinkSignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type MagicLinkSignInValues = z.infer<typeof magicLinkSignInSchema>;