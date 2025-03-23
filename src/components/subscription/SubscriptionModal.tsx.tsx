"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useModal } from "@/hooks/useModal";
import { businessFeatures, professionalFeatures } from "@/lib/constants";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "../ui/responsive-modal";
import { Separator } from "../ui/separator";
import { createCheckoutSession } from "./actions";

export default function SubscriptionModal() {
  const { subscriptionModal, closeSubscriptionModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error during subscription:", error);
      toast.error("An error occurred during subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveModal
      open={subscriptionModal}
      onOpenChange={() => {
        if (!loading) {
          closeSubscriptionModal();
        }
      }}
    >
      <ResponsiveModalContent className="lg:max-w-4xl w-full lg:w-[90vw]">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="text-2xl font-bold">
            Choose Your Plan for <span className="text-primary">Invoico</span>
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Unlock premium features and take your invoicing experience to the
            next level.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-stretch sm:space-x-6 sm:space-y-0">
          <div className="flex w-full flex-col space-y-5 px-4 sm:w-1/2">
            <div className="flex-grow">
              <h3 className="text-center text-lg font-bold sm:text-left text-orange-600">
                Professional
              </h3>
              <p className="text-start text-sm text-muted-foreground mt-2">
                Unlock the following features:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mt-4">
                {professionalFeatures.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="outlineSecondary"
              className="w-full sm:w-auto"
              onClick={() =>
                handleSubscribe(
                  env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY
                )
              }
              disabled={loading}
            >
              Get Professional
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-full sm:block"
          />

          <div className="flex w-full flex-col space-y-5 px-4 sm:w-1/2">
            <div className="flex-grow">
              <div className="flex items-center justify-center space-x-2 md:justify-start">
                <h3 className="bg-gradient-to-r from-orange-600 to-amber-400 bg-clip-text text-lg font-bold text-transparent">
                  Business
                </h3>
              </div>
              <p className="text-start text-sm text-muted-foreground mt-2">
                Get everything in Professional, plus:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mt-4">
                {businessFeatures.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="shine"
              className="w-full sm:w-auto"
              onClick={() =>
                handleSubscribe(
                  env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY
                )
              }
              disabled={loading}
            >
              Get Business
            </Button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <ResponsiveModalClose asChild>
            <Button
              variant="outlineSecondary"
              className="border-orange-500 text-orange-500"
            >
              Close
            </Button>
          </ResponsiveModalClose>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
