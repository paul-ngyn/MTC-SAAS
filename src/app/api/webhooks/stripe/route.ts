// src/app/api/webhooks/stripe/route.ts
// Receives and verifies Stripe webhook events
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// Disable body parsing so we can verify the raw Stripe signature
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription") {
        // Update user membership tier in Supabase
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        // Map priceId → tier name
        const tierMap: Record<string, string> = {
          [process.env.STRIPE_PRICE_BASIC ?? ""]: "basic",
          [process.env.STRIPE_PRICE_PRO ?? ""]: "pro",
          [process.env.STRIPE_PRICE_ENTERPRISE ?? ""]: "enterprise",
        };
        const tier = tierMap[priceId] ?? "basic";

        if (session.customer_email) {
          await supabase
            .from("profiles")
            .update({ membership_tier: tier, stripe_customer_id: customerId })
            .eq("email", session.customer_email);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("profiles")
        .update({ membership_tier: null })
        .eq("stripe_customer_id", customerId);
      break;
    }

    default:
      // Unhandled event type — acknowledge to prevent retries
      break;
  }

  return NextResponse.json({ received: true });
}
