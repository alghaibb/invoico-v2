"use client";

import { LoadingButton } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  async function handleManageSubscription() {
    startTransition(async () => {
      try {
        const url = await createCustomerPortalSession();
        if (url) window.location.href = url;
      } catch (error) {
        console.error("Error redirecting to customer portal:", error);
        toast.error("Failed to manage subscription. Please try again.");
      }
    });
  }

  return (
    <LoadingButton
      onClick={handleManageSubscription}
      loading={isPending}
      disabled={isPending}
      className="w-full md:w-auto"
    >
      {isPending ? "Managing Subscription..." : "Manage Subscription"}
    </LoadingButton>
  );
}
