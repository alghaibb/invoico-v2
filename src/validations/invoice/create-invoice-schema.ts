import { z } from "zod";

export const invoiceSchema = z.object({
  invoiceName: z.string().min(1, "Invoice name is required").trim(),
  invoiceNumber: z.string().min(1, "Invoice number is required").trim(),
  total: z.number().min(0),
  tax: z.number().min(0).max(100),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
  date: z.preprocess((val) => new Date(val as string), z.date()),
  dueDate: z.number().int().min(0),
  fromName: z.string().min(1, "From name is required").trim(),
  fromEmail: z.string().email("Invalid email address").trim().optional().or(z.literal("")),
  fromAddress: z.string().trim().optional().nullable().or(z.literal("")),
  clientName: z.string().min(1, "Client name is required").trim(),
  clientEmail: z.string().email("Invalid email address").trim().optional().nullable().or(z.literal("")),
  clientAddress: z.string().optional().nullable().or(z.literal("")),
  currency: z.string(),
  notes: z.string().optional().nullable(),
  invoiceItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1), 
      price: z.number().int().min(0), 
    })
  ).min(1, "At least one item is required"),
});

export type InvoiceValues = z.infer<typeof invoiceSchema>;