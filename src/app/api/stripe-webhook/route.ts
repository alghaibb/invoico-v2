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
      return new Response("Invalid Signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`Received event: ${event.type}`, event.data.object);

    switch (event.type) {
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
        console.log(`Unhandled event type: ${event.type}`);
    }


    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack)
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session?.metadata?.userId;

  if (!userId) {
    throw new Error("Missing userId in session metadata");
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
  );

  await prisma.userSubscription.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  })

}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

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
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    }
  });
}