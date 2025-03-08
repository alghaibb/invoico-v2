import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { IconFileInvoice } from "@tabler/icons-react";
import { Activity, CreditCard, DollarSign } from "lucide-react";

async function getData(userId: string) {
  const [invoiceData, pendingInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);
  return {
    invoiceData,
    pendingInvoices,
    paidInvoices,
  };
}

export default async function DashboardBlocks() {
  const session = await getSession();
  const user = session?.user.id as string;

  const { invoiceData, pendingInvoices, paidInvoices } = await getData(user);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-extrabold">
            $
            {new Intl.NumberFormat("en-US", {
              notation: "standard",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
              .format(
                invoiceData.reduce(
                  (acc, invoice) => acc + Number(invoice.total),
                  0
                )
              )
              .replace(/^(\d{2})(\d{3})$/, "$1,$2")}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Based on the last 30 days
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <IconFileInvoice className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-extrabold">+{invoiceData.length}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Total invoices issued
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-extrabold">+{paidInvoices.length}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Total invoices that have been paid
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
          <CardTitle className="text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-extrabold">+{pendingInvoices.length}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Total invoices that are pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
