"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PaymentMethodData } from "@/types/payment-method";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaymentMethodProps {
  paymentIntentId: string | null;
}

export default function PaymentMethod({ paymentIntentId }: PaymentMethodProps) {
  const fetchPaymentMethod = async (
    paymentIntentId: string
  ): Promise<PaymentMethodData> => {
    const response = await fetch(
      `/api/get-payment-method?paymentIntentId=${paymentIntentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payment details.");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["payment-method", paymentIntentId],
    queryFn: () => fetchPaymentMethod(paymentIntentId as string),
    enabled: !!paymentIntentId,
  });

  if (isLoading) {
    const fields: (keyof PaymentMethodData)[] = [
      "brand",
      "last4",
      "cardholderName",
      "billingEmail",
    ];

    const fieldStyles: Record<keyof PaymentMethodData, string> = {
      brand: "h-6 w-3/4",
      last4: "h-4 w-1/2",
      cardholderName: "h-4 w-2/3",
      billingEmail: "h-4 w-3/5",
    };

    return (
      <div className="space-y-2">
        {fields.map((field) => (
          <Skeleton key={field} className={fieldStyles[field]} />
        ))}
      </div>
    );
  }

  if (error) {
    return toast.error("Failed to fetch payment details.");
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
