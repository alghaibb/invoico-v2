import { z } from "zod";

export const sendInvoiceSchema = z.object({
  clientEmail: z.string().email({ message: "Invalid email address" }),
});

export type SendInvoiceValues = z.infer<typeof sendInvoiceSchema>;