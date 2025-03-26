import { env } from "@/env";
import prisma from "@/lib/prisma";
import { cache } from "react";

export type SubscriptionType = "free" | "professional" | "business";

export const getUserSubscription = cache(
  async (userId: string): Promise<SubscriptionType> => {
    console.log("Checking subscription for userId: ", userId); 

    if (!userId) {
      console.error("❌ Error: userId is undefined.");
      throw new Error("UserId is required but was not provided.");
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return "free";
    }

    if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY) {
      return "professional";
    }

    if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY) {
      return "business";
    }

    throw new Error("Invalid subscription type");
  }
)
