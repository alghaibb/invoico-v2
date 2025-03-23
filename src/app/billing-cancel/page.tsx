import { Metadata } from "next";
import BillingCancelClient from "./BillingCancel";

export const metadata: Metadata = {
  title: "Subscription Canceled",
};

export default function BillingCancelPage() {
  return <BillingCancelClient />;
}
