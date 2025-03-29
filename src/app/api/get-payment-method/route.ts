import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("paymentIntentId");

  if (!paymentIntentId) {
    console.error("PaymentIntent ID is missing.");
    return NextResponse.json({ error: "PaymentIntent ID is required" }, { status: 400 });
  }

  try {
    console.log(`Fetching PaymentIntent: ${paymentIntentId}`);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method"],
    });

    if (!paymentIntent || typeof paymentIntent.payment_method === "string") {
      console.error("No payment method found or PaymentIntent invalid.");
      return NextResponse.json({ error: "No payment method found" }, { status: 404 });
    }

    const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;

    if (paymentMethod.type !== "card") {
      console.error(`Unsupported payment method type: ${paymentMethod.type}`);
      return NextResponse.json({ error: "Only card payments are supported" }, { status: 400 });
    }

    const cardDetails = paymentMethod.card as Stripe.PaymentMethod.Card;
    const billingDetails = paymentMethod.billing_details;

    const response = {
      last4: cardDetails?.last4 || null,
      brand: cardDetails?.brand || null,
      cardholderName: billingDetails?.name || null,
      billingEmail: billingDetails?.email || null,
    };

    console.log("Successfully retrieved payment method details:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving payment method:", error);
    return NextResponse.json({ error: "Failed to retrieve payment details" }, { status: 500 });
  }
}
