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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
                : "default";

          return (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>
                {formatCurrency({
                  amount: invoice.total,
                  currency: invoice.currency as "USD" | "EUR" | "AUD" | "GBP",
                })}
              </TableCell>
              <TableCell>
                <Badge variant={badgeVariant}>{invoice.status}</Badge>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(dueDate)}
              </TableCell>
              <TableCell className="text-right">
                <ActionsDropdown />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
