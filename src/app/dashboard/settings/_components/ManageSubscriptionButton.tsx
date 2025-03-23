"use client";

import { LoadingButton } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleManageSubscription() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      onClick={handleManageSubscription}
      loading={loading}
      disabled={loading}
      className="w-full md:w-auto"
    >
      {loading ? "Managing Subscription..." : "Manage Subscription"}
    </LoadingButton>
  );
}
