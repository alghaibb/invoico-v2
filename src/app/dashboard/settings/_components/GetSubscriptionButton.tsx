"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";

export default function GetSubscriptionButton() {
  const subscriptionModal = useModal();

  return (
    <Button
      onClick={() => subscriptionModal.openSubscriptionModal()}
      variant="shine"
      className="w-full md:w-auto"
    >
      Get Premium Subscription
    </Button>
  );
}
