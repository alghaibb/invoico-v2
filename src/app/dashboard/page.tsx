import { Metadata } from "next";
import DashboardBlocks from "./_components/DashboardBlocks";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <>
      <DashboardBlocks />
    </>
  );
}
