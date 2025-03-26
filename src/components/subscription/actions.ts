"use server"

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { getSession } from "@/utils/session";

export async function createCheckoutSession(priceId: string) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing-success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing-cancel`,
    customer_email: user.email,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id } 
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `By clicking "Subscribe", you agree to our [terms of service](${env.NEXT_PUBLIC_BASE_URL}/terms-of-service)`,
      }
    },
    consent_collection: {
      terms_of_service: "required",
    }
  });

  if (!stripeSession.url) {
    throw new Error("Failed to create checkout session");
  }

  return stripeSession.url;
}