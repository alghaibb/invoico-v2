"use client";

import { createCheckoutSession } from "@/components/subscription/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/env";
import { businessFeatures, professionalFeatures } from "@/lib/constants";
import { CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      toast.error("You need to be logged in to subscribe.");
      router.push("/sign-in?redirectTo=/dashboard/profile");
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error during subscription:", error);
      toast.error("An error occurred during subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-background text-center" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-primary">
          Pricing Plans
        </h2>
        <p className="text-muted-foreground mb-12 text-base sm:text-lg">
          Simple pricing for everyone. Choose the plan that fits your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card className="transition-all duration-300 hover:shadow-xl border border-orange-500">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600 font-semibold">
                Professional
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Everything you need to get started.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6 text-muted-foreground text-left">
                {professionalFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handleSubscribe(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY
                  )
                }
                disabled={loading}
                className="w-full"
                variant="outlineSecondary"
              >
                Get Professional
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl border border-yellow-500">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-amber-400 bg-clip-text text-transparent font-semibold">
                Business
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Advanced tools for growing teams.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6 text-muted-foreground text-left">
                {businessFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handleSubscribe(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY
                  )
                }
                disabled={loading}
                className="w-full"
                variant="shine"
              >
                Get Business
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
