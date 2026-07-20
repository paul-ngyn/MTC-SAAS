// src/app/api/webhooks/stripe/route.ts
// Receives and verifies Stripe webhook events
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // Stripe's signature check above is the auth boundary for this route —
  // there is no browser session, so we need the service-role client to
  // write past RLS instead of the cookie-based anon client.
  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription") {
        const userId = session.metadata?.user_id ?? session.client_reference_id;
        const tier = session.metadata?.tier;
        const customerId = session.customer as string;

        if (!userId || !tier) {
          console.error(
            "[stripe webhook] subscription session missing user_id/tier metadata",
            session.id
          );
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ membership_tier: tier, stripe_customer_id: customerId })
          .eq("id", userId);

        if (error) {
          console.error("[stripe webhook] failed to update profile tier", error);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await supabase
        .from("profiles")
        .update({ membership_tier: null })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error("[stripe webhook] failed to clear profile tier", error);
      }
      break;
    }

    default:
      // Unhandled event type — acknowledge to prevent retries
      break;
  }

  return NextResponse.json({ received: true });
}
