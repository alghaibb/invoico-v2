import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().optional().refine(
    (val) => !val || val.trim().length > 0,
    {
      message: "First name cannot be empty",
    }
  ),
  lastName: z.string().optional().refine(
    (val) => !val || val.trim().length > 0,
    {
      message: "Last name cannot be empty",
    }
  ),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
