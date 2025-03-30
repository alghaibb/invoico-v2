import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { businessFeatures, professionalFeatures } from "@/lib/constants";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { formatDate } from "@/utils/format-date";
import { getSession } from "@/utils/session";
import Stripe from "stripe";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import PaymentMethod from "./PaymentMethod";

export default async function BillingSection() {
  const session = await getSession();
  const userId = session?.user.id;

  if (!userId) return null;

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  const latestInvoice = subscription
    ? await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 1,
      })
    : null;

  const paymentIntentId = latestInvoice?.data[0]?.payment_intent as string;

  const planName = priceInfo
    ? (priceInfo.product as Stripe.Product).name
    : "Free";

  const features =
    planName === "Professional"
      ? professionalFeatures
      : planName === "Business"
      ? businessFeatures
      : [];

  return (
    <Card className="w-full mx-auto max-w-2xl">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2 text-center md:text-start">
          <h1 className="text-3xl font-bold text-primary">
            Billing & Subscription
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscription and view plan details below.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-lg text-foreground">
              Your current plan:{" "}
              <span className="font-bold text-primary">{planName}</span>
            </p>

            {subscription?.stripeCancelAtPeriodEnd &&
              subscription.stripeCurrentPeriodEnd && (
                <p className="text-destructive text-sm">
                  Your subscription will be canceled on{" "}
                  <span className="font-bold">
                    {formatDate(subscription.stripeCurrentPeriodEnd)}
                  </span>
                </p>
              )}

            <div className="text-sm">
              <p>
                Status:{" "}
                <span className="font-bold">
                  {subscription ? "Active" : "Inactive"}
                </span>
              </p>
              {subscription?.stripeCurrentPeriodEnd &&
                !subscription.stripeCancelAtPeriodEnd && (
                  <p>
                    Next Billing Date:{" "}
                    <span className="font-bold">
                      {formatDate(subscription.stripeCurrentPeriodEnd)}
                    </span>
                  </p>
                )}
            </div>
          </div>
        </div>

        {features.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-lg font-bold text-primary">
                Features Included:
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {paymentIntentId && (
          <>
            <Separator />
            <PaymentMethod paymentIntentId={paymentIntentId} />
          </>
        )}

        <div className="flex">
          {subscription ? (
            <ManageSubscriptionButton />
          ) : (
            <GetSubscriptionButton />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
