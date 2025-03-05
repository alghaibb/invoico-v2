import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { notFound } from "next/navigation";
import EditInvoiceForm from "../_components/forms/EditInvoiceForm";

export const dynamic = "force-dynamic";

async function getInvoiceData(invoiceId: string, userId: string) {
  const invoiceData = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { invoiceItems: true },
  });

  if (!invoiceData || invoiceData.userId !== userId) {
    notFound();
  }

  return {
    ...invoiceData,
    total: Number(invoiceData.total),
    tax: Number(invoiceData.tax),
    fromAddress: invoiceData.fromAddress ?? "",
    fromEmail: invoiceData.fromEmail ?? "",
    clientEmail: invoiceData.clientEmail ?? "",
    notes: invoiceData.notes ?? "",
    clientAddress: invoiceData.clientAddress ?? "",
    invoiceItems: invoiceData.invoiceItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
  };
}

type Params = Promise<{ invoiceId: string }>;

export default async function Page({ params }: { params: Params }) {
  const session = await getSession();
  const userId = session?.user.id;

  const { invoiceId } = await params;

  const invoiceData = await getInvoiceData(invoiceId, userId as string);

  return <EditInvoiceForm data={invoiceData} />;
}
