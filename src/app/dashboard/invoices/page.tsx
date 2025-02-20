import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import InvoiceTable from "./_components/InvoiceTable";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Invoices page",
};

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices</CardDescription>
          </div>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/invoices/new">
              <PlusIcon className="size-5" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceTable />
      </CardContent>
    </Card>
  );
}
