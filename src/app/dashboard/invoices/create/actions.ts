"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { invoiceSchema, InvoiceValues } from "@/validations/invoice/create-invoice-schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function createInvoice(values: InvoiceValues) {
  console.log("🚀 Received values:", values);
  try {
    const validatedValues = invoiceSchema.parse(values);

    const session = await getSession();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized: No user session found.");
    }
    const user = session.user.id;

    await prisma.invoice.create({
      data: {
        userId: user,
        invoiceNumber: validatedValues.invoiceNumber,
        invoiceName: validatedValues.invoiceName,
        total: validatedValues.total,
        tax: validatedValues.tax,
        status: validatedValues.status,
        date: validatedValues.date,
        dueDate: validatedValues.dueDate,
        fromName: validatedValues.fromName,
        fromEmail: validatedValues.fromEmail || undefined,
        fromAddress: validatedValues.fromAddress || undefined,
        clientName: validatedValues.clientName,
        clientEmail: validatedValues.clientEmail || undefined,
        clientAddress: validatedValues.clientAddress || undefined,
        currency: validatedValues.currency,
        notes: validatedValues.notes || undefined,
        invoiceItems: {
          create: validatedValues.invoiceItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return redirect("/dashboard/invoices");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error creating invoice:", error);
    return { error: "An error occurred. Please try again." };
  }
}
