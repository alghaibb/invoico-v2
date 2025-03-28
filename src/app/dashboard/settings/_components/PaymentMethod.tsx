"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaymentMethodProps {
  paymentIntentId: string | null;
}

async function fetchPaymentMethod(paymentIntentId: string | null) {
  if (!paymentIntentId) return null;

  const response = await fetch(
    `/api/get-payment-method?paymentIntentId=${paymentIntentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payment details.");
  }

  const data = await response.json();
  return data;
}

export default function PaymentMethod({ paymentIntentId }: PaymentMethodProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["paymentMethod", paymentIntentId],
    queryFn: () => fetchPaymentMethod(paymentIntentId),
    enabled: !!paymentIntentId,
  });

  if (isLoading) {
    const skeletons = Array(4).fill(null);
    return (
      <div className="space-y-2">
        {skeletons.map((_, index) => (
          <Skeleton
            key={index}
            className={`h-${index === 0 ? 6 : 4} w-${
              index === 0 ? "3/4" : "1/2"
            }`}
          />
        ))}
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch payment details.");
    return null;
  }

  if (!data || !data.last4) return null;

  const { brand, last4, billingEmail } = data;

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
        <span className="font-bold">{data.cardholderName || "N/A"}</span>
      </p>

      {billingEmail && (
        <p className="text-sm">
          Email: <span className="font-bold">{billingEmail}</span>
        </p>
      )}
    </div>
  );
}
