"use server"

import { env } from "@/env"
import prisma from "@/lib/prisma"
import { Currency } from "@/types/currency"
import { formatCurrency } from "@/utils/format-currency"
import { sendInvoiceEmail } from "@/utils/send-emails"
import { getSession } from "@/utils/session"
import { invoiceSchema, InvoiceValues } from "@/validations/invoice/create-invoice-schema"
import { sendInvoiceSchema, SendInvoiceValues } from "@/validations/invoice/send-invoice-schema"
import { InvoiceStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export async function sendInvoice(values: SendInvoiceValues, invoiceId: string) {
  try {
    const validatedValues = sendInvoiceSchema.parse(values)

    const session = await getSession()
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized: No user session found.");
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        fromName: true,
        invoiceNumber: true,
        date: true,
        dueDate: true,
        total: true,
        currency: true,
        lastSent: true,
      }
    });

    if (!invoice) {
      throw new Error("Invoice not found.")
    }

    if (invoice.lastSent && new Date(invoice.lastSent).getTime() > Date.now() - 60000) {
      throw new Error("Please wait 60 seconds before sending another email.");
    }

    const invoiceDate = new Date(invoice.date);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + invoice.dueDate);

    const formattedDueDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(dueDate);

    const formattedTotal = formatCurrency({
      amount: Number(invoice.total.toFixed(2)),
      currency: invoice.currency as Currency,
    });

    const downloadLink = `${env.NEXT_PUBLIC_BASE_URL}/api/invoice/${invoiceId}`;

    // Send the email
    await sendInvoiceEmail(
      validatedValues.clientEmail,
      invoice.clientName,
      invoice.invoiceNumber,
      formattedDueDate,
      formattedTotal,
      downloadLink,
      invoice.fromName
    );

    return { success: "Invoice successfully sent" }
  } catch (error) {
    console.error("Error sending invoice:", error)
    return { error: "An error occurred. Please try again." }
  }
}

export async function editInvoice(values: InvoiceValues, invoiceId: string) {
  try {
    const validatedValues = invoiceSchema.parse(values);

    const session = await getSession();
    const userId = session?.user.id;

    if (!userId) {
      throw new Error("Unauthorized: No user session found.");
    }

    await prisma.invoice.update({
      where: {
        id: invoiceId,
        userId: userId
      },
      data: {
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
          deleteMany: { invoiceId },
          createMany: {
            data: validatedValues.invoiceItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
    });

    return { success: "Invoice successfully edited." }

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error editing invoice:", error)
    return { error: "An error occurred. Please try again." }
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const session = await getSession();
    const user = session?.user.id;

    if (!user) {
      throw new Error("Unauthorized: No user session found.");
    }

    await prisma.invoice.delete({
      where: { id: invoiceId, userId: user },
    });

    revalidatePath("/dashboard/invoices");

    return { success: "Invoice successfully deleted." }
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return { error: "Failed to delete invoice. Please try again." };
  }
}

export async function markInvoiceAsPaid(invoiceId: string, status: InvoiceStatus) {
  try {
    const session = await getSession();
    const user = session?.user.id;

    if (!user) {
      throw new Error("Unauthorized: No user session found.");
    }

    await prisma.invoice.update({
      where: { id: invoiceId, userId: user },
      data: {
        status: status,
      }
    });

    revalidatePath("/dashboard/invoices");

    return { success: "Invoice status updated." }
  } catch (error) {
    console.error("Error marking invoice status:", error)
    return { error: "Failed to update invoice status" };
  }
} 