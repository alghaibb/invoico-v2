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

  const latestInvoice = subscription
    ? await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 1,
      })
    : null;

  const paymentMethod = latestInvoice?.data[0]?.payment_intent
    ? await stripe.paymentIntents.retrieve(
        latestInvoice.data[0].payment_intent as string,
        {
          expand: ["payment_method"],
        }
      )
    : null;
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
        {/* Header Section */}
        <div className="space-y-2 text-center md:text-start">
          <h1 className="text-3xl font-bold text-primary">
            Billing & Subscription
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscription and view plan details below.
          </p>
        </div>

        <Separator />

        {/* Subscription Info Section */}
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

        <Separator />

        {/* Features Section */}
        {features.length > 0 && (
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
        )}

        {/* Payment Method Section */}
        <Separator />

        {paymentMethod &&
          typeof paymentMethod.payment_method !== "string" &&
          paymentMethod.payment_method !== null && (
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-lg font-bold text-primary">
                Payment Information
              </h2>

              {/* Payment Method Type */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Payment Method:
                </h3>
                <p className="font-bold capitalize text-foreground">
                  {(paymentMethod.payment_method.type as string).replace(
                    "_",
                    " "
                  )}
                </p>
              </div>

              {/* Card Details */}
              {"card" in paymentMethod.payment_method &&
                paymentMethod.payment_method.card && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Card Details:
                    </h3>
                    <p className="text-foreground">
                      •••• •••• •••• {paymentMethod.payment_method.card.last4}
                    </p>
                  </div>
                )}

              {/* Billing Email */}
              {paymentMethod.payment_method.billing_details?.email && (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Billing Email:
                  </h3>
                  <p className="text-foreground">
                    {paymentMethod.payment_method.billing_details.email}
                  </p>
                </div>
              )}
            </div>
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
