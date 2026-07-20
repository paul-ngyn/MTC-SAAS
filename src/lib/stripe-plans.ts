// src/lib/stripe-plans.ts
// Single source of truth mapping Stripe price IDs to membership tiers,
// so /api/subscribe and the webhook can never disagree on the mapping.
export type MembershipTierId = "basic" | "pro" | "enterprise";

const TIER_PRICE_IDS: Record<MembershipTierId, Array<string | undefined>> = {
  basic: [
    process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY,
    process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY,
  ],
  pro: [
    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
  ],
  enterprise: [
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
  ],
};

const PRICE_TO_TIER: Record<string, MembershipTierId> = Object.entries(TIER_PRICE_IDS).reduce(
  (acc, [tier, priceIds]) => {
    for (const priceId of priceIds) {
      if (priceId) acc[priceId] = tier as MembershipTierId;
    }
    return acc;
  },
  {} as Record<string, MembershipTierId>
);

export function tierForPriceId(priceId: string): MembershipTierId | null {
  return PRICE_TO_TIER[priceId] ?? null;
}
