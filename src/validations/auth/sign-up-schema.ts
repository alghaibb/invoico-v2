import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .trim()
    .regex(/^[a-zA-Z]+$/, { message: "First name can only contain letters" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .trim()
    .regex(/^[a-zA-Z]+$/, { message: "Last name can only contain letters" })
    .optional()
    .or(z.literal("")),

  email: z.string().email({ message: "Invalid email address" }).trim(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)" }),

  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type SignUpValues = z.infer<typeof signUpSchema>;
