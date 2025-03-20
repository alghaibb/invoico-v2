import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),

  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)" }),

  confirmNewPassword: z.string(),
})
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
