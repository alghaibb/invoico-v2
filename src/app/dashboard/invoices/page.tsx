import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import CreateInvoiceButton from "./_components/CreateInvoiceButton";
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
          <CreateInvoiceButton />
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
