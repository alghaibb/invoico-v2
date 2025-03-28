"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaymentMethodProps {
  paymentIntentId: string | null;
}

async function fetchPaymentMethod(paymentIntentId: string | null) {
  if (!paymentIntentId) return null;

  try {
    const response = await fetch(
      `/api/get-payment-method?paymentIntentId=${paymentIntentId}`
    );

    if (!response.ok) {
      console.error(`Error fetching payment details: ${response.status} - ${response.statusText}`);
      throw new Error("Failed to fetch payment details.");
    }

    const data = await response.json();
    console.log("Payment Method Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
}

export default function PaymentMethod({ paymentIntentId }: PaymentMethodProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["paymentMethod", paymentIntentId],
    queryFn: () => fetchPaymentMethod(paymentIntentId),
    enabled: !!paymentIntentId,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch payment details.");
    return <p className="text-sm text-destructive">Failed to load payment information.</p>;
  }

  if (!data || !data.last4) return null;

  const { brand, last4, billingEmail, cardholderName } = data;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-primary">Payment Information</h2>
      {brand && (
        <p className="text-sm">
          Card Type: <span className="font-bold capitalize">{brand}</span>
        </p>
      )}

      <p className="text-sm font-bold">Card Details: •••• •••• •••• {last4}</p>

      <p className="text-sm">
        Cardholder Name:{" "}
        <span className="font-bold">{cardholderName || "N/A"}</span>
      </p>

      {billingEmail && (
        <p className="text-sm">
          Email: <span className="font-bold">{billingEmail}</span>
        </p>
      )}
    </div>
  );
}
