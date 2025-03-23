import { z } from "zod";

export const sendInvoiceSchema = z.object({
  clientEmail: z.string().email({ message: "Invalid email address" }).trim(),
});

export type SendInvoiceValues = z.infer<typeof sendInvoiceSchema>;