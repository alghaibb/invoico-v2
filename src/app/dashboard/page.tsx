import { Metadata } from "next";
import DashboardBlocks from "./_components/DashboardBlocks";
import InvoiceGraph from "./_components/InvoiceGraph";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <>
      <DashboardBlocks />
      <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
        <InvoiceGraph />
      </div>
    </>
  );
}
