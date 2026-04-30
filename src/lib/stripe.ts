// src/lib/stripe.ts
// Server-side Stripe instance – never import this in Client Components
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});
