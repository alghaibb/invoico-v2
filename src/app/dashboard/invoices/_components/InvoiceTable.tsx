import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { Currency } from "@/types/currency";
import { formatCurrency } from "@/utils/format-currency";
import { getSession } from "@/utils/session";
import { FileText } from "lucide-react";
import ActionsDropdown from "./ActionsDropdown";

async function fetchInvoices(userId: string) {
  const today = new Date();

  await prisma.invoice.updateMany({
    where: {
      userId: userId,
      status: "PENDING",
      OR: [
        {
          dueDate: 0,
        },
        {
          date: {
            lte: new Date(today.setDate(today.getDate() - 1)),
          },
        },
      ],
    },
    data: {
      status: "OVERDUE",
    },
  });
  return prisma.invoice.findMany({
    where: { userId: userId },
    select: {
      id: true,
      clientName: true,
      total: true,
      date: true,
      dueDate: true,
      status: true,
      invoiceNumber: true,
      currency: true,
    },
    orderBy: { date: "desc" },
  });
}

export default async function InvoiceTable() {
  const session = await getSession();
  const userId = session?.user?.id;

  const data = await fetchInvoices(userId as string);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto" />
          <h2 className="text-lg font-semibold mt-4">No invoices found</h2>
          <p className="text-muted-foreground mt-2">
            You haven’t created any invoices yet. Start by adding your first
            invoice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="whitespace-nowrap">Invoice Number</TableHead>
            <TableHead className="whitespace-nowrap">Client</TableHead>
            <TableHead className="whitespace-nowrap">Amount</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Due Date</TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((invoice) => {
            const invoiceDate = new Date(invoice.date);
            const dueDate = new Date(invoiceDate);
            dueDate.setDate(invoiceDate.getDate() + invoice.dueDate);

            const badgeVariant =
              invoice.status === "PAID"
                ? "success"
                : invoice.status === "OVERDUE"
                  ? "destructive"
                  : "secondary";

            return (
              <TableRow key={invoice.id} className="w-max">
                <TableCell className="whitespace-nowrap">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {invoice.clientName}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency({
                    amount: Number(invoice.total.toFixed(2)),
                    currency: invoice.currency as Currency,
                  })}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={badgeVariant}>{invoice.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(dueDate)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <ActionsDropdown
                    invoiceId={invoice.id}
                    initialStatus={invoice.status}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
