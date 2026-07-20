// src/app/api/checkout/route.ts
// Creates a Stripe Checkout Session for a cart of products
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body as {
      items: Array<{ id: string; quantity: number }>;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const supabase = await createClient();
    const productIds = [...new Set(items.map((item) => item.id))];

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .in("id", productIds);

    if (error) {
      console.error("[/api/checkout] failed to load products", error);
      return NextResponse.json({ error: "Failed to load product prices." }, { status: 500 });
    }

    const productById = new Map((products ?? []).map((p) => [p.id, p]));

    const lineItems = items.map((item) => {
      const product = productById.get(item.id);
      if (!product) {
        throw new Error(`Product ${item.id} not found.`);
      }
      const quantity = Math.max(1, Math.floor(item.quantity));

      return {
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: {
            name: product.name,
            ...(product.image_url ? { images: [product.image_url] } : {}),
          },
        },
        quantity,
      };
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[/api/checkout]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
