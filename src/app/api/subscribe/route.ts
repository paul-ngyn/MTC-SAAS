// src/app/api/subscribe/route.ts
// Creates a Stripe Checkout Session for a recurring subscription (membership)
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json() as { priceId: string };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Optionally attach customer to authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/membership`,
      allow_promotion_codes: true,
    };

    if (user?.email) {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[/api/subscribe]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
