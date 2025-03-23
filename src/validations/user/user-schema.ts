import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty").trim(),
  lastName: z.string().trim().optional().or(z.literal("")),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
