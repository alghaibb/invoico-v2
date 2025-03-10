import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { FileText } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import DashboardBlocks from "./_components/DashboardBlocks";
import InvoiceGraph from "./_components/InvoiceGraph";
import RecentInvoices from "./_components/RecentInvoices";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export const dynamic = "force-dynamic";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: { userId: userId },
    select: { id: true },
  });

  return data;
}

export default async function Page() {
  const session = await getSession();
  const user = session?.user.id as string;
  const data = await getData(user);

  if (data.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <FileText className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-lg font-semibold mt-4">No invoices found</h2>
        <p className="text-muted-foreground mt-2">
          You haven&apos;t created any invoices yet. Start by adding your first
          invoice.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/invoices/create">Create Invoice</Link>
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
      <DashboardBlocks />
      <div className="md:grid space-y-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:space-y-0">
        <InvoiceGraph />
        <RecentInvoices />
      </div>
    </Suspense>
  );
}
