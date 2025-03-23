import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Billing Success",
};

export default function BillingSuccess() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  text-center p-6">
      <div className="bg-background p-8 max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-foreground mb-6">
          Thank you for subscribing to our service. Your payment has been
          processed successfully.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
