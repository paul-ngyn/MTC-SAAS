// src/app/api/subscribe/route.ts
// Creates a Stripe Checkout Session for a recurring subscription (membership)
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { tierForPriceId } from "@/lib/stripe-plans";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json() as { priceId: string };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required." }, { status: 400 });
    }

    const tier = tierForPriceId(priceId);
    if (!tier) {
      return NextResponse.json({ error: "Unknown priceId." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to subscribe." },
        { status: 401 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/membership`,
      allow_promotion_codes: true,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { tier, user_id: user.id },
      subscription_data: { metadata: { tier, user_id: user.id } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[/api/subscribe]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
