import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { getSession } from "@/utils/session";
import { formatDate } from "@/utils/format-date";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import GetSubscriptionButton from "./GetSubscriptionButton";
import Stripe from "stripe";

export default async function BillingSection() {
  const session = await getSession();
  const userId = session?.user.id;

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <Card className="w-full mx-auto max-w-2xl">
      <CardContent className="p-6 space-y-6">
        <main className="space-y-6">
          <h1 className="text-3xl font-bold md:text-start text-center">Billing</h1>
          <p className="md:text-start text-center">
            Your current plan: <span className="font-bold">
              {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
            </span>
          </p>
          {subscription ? (
            <>
              {subscription.stripeCancelAtPeriodEnd && (
  <p className="text-destructive">
    Your subscription will be canceled on {formatDate(subscription.stripeCurrentPeriodEnd)}
  </p>
)}
              <ManageSubscriptionButton />
            </>
          ) : (
            <GetSubscriptionButton />
          )}
        </main>
      </CardContent>
    </Card>
  );
}
