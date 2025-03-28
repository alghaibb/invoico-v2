"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PaymentMethodData } from "@/types/payment-method";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentMethodProps {
  paymentIntentId: string | null;
}

export default function PaymentMethod({ paymentIntentId }: PaymentMethodProps) {
  const [data, setData] = useState<PaymentMethodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) return;

    const fetchPaymentMethod = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-payment-method?paymentIntentId=${paymentIntentId}`
        );

        if (!response.ok) {
          console.error(
            `Error fetching payment details: ${response.status} - ${response.statusText}`
          );
          throw new Error("Failed to fetch payment details.");
        }

        const result: PaymentMethodData = await response.json();
        console.log("Payment Method Data:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to fetch payment details.");
        toast.error("Failed to fetch payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethod();
  }, [paymentIntentId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
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
