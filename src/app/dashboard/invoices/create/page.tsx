import { Metadata } from "next";
import CreateInvoice from "../_components/CreateInvoice";

export const metadata: Metadata = {
  title: "Create Invoice",
  description: "Create Invoice page",
};

export default function Page() {
  return <CreateInvoice />;
}
