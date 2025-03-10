import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import InvoiceTable from "./_components/InvoiceTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Invoices page",
};

export default async function Page() {
  return (
    <Card className="max-w-7xl mx-auto w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices</CardDescription>
          </div>
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
            aria-label="Create Invoice"
          >
            <Link href="/dashboard/invoices/create">
              <PlusIcon className="size-5" />
              <span className="hidden md:inline">Create Invoice</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
          <InvoiceTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
