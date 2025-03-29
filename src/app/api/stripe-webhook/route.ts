import Stripe from "stripe";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { env } from "@/env";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ No Stripe signature found");
      return new Response("Invalid Signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`Received event: ${event.type}`, event.data.object);

    switch (eventType) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object)
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id)
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`);
    }


    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error: ", error.stack);
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session?.metadata?.userId;

  if (!userId) {
    console.error("Missing userId in session metadata");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.userSubscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  })

}

async function handleSubscriptionCreatedOrUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId; 

  if (!userId) {
    console.error("Subscription metadata is missing userId.");
    return;
  }

  if (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due"
  ) {
    await prisma.userSubscription.upsert({
      where: {
        userId: subscription.metadata.userId,
      },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    });
  } else {
    await prisma.userSubscription.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      }
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("✅ Subscription Deleted:", subscription);

  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    }
  });
}