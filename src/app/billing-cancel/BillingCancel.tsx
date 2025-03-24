"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

export default function BillingCancelClient() {
  const { openSubscriptionModal } = useModal();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6 max-w-2xl p-8">
        <h1 className="md:text-4xl font-bold text-destructive text-3xl">
          Subscription Canceled
        </h1>
        <p className="text-muted-foreground">
          It looks like your subscription process was canceled. No worries! You
          can always subscribe whenever you&apos;re ready.
        </p>
        <div className="flex mt-4 items-center justify-center md:flex-row flex-col gap-4">
          <Button
            asChild
            variant="outlineSecondary"
            className="w-full md:w-auto"
          >
            <Link href="/dashboard/settings">Go to Settings</Link>
          </Button>
          <Button className="w-full md:w-auto" onClick={openSubscriptionModal}>
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );
}
