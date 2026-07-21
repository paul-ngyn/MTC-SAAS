// src/lib/pricing.ts – Tiered wholesale pricing (case-quantity discounts)
//
// Mirrors mtc-saas-mobile/lib/pricing.ts so web and mobile compute identical
// tiers. Every product gets the same three-tier schedule off its list price:
// 1-9 units at list, 10-49 at 10% off, 50+ at 20% off. Deterministic function
// of price rather than stored per-product data.

export type PriceTier = {
  minQty: number;
  maxQty: number | null; // null = no upper bound
  unitPrice: number; // in cents
  label: string; // e.g. "10-49 cases"
};

const TIER_BREAKS = [
  { minQty: 1, maxQty: 9, discount: 0 },
  { minQty: 10, maxQty: 49, discount: 0.1 },
  { minQty: 50, maxQty: null as number | null, discount: 0.2 },
];

export function getTiers(unitPrice: number, unit: string): PriceTier[] {
  const plural =
    unit === "each" || unit.endsWith("s") ? unit : `${unit}s`;
  return TIER_BREAKS.map(({ minQty, maxQty, discount }) => ({
    minQty,
    maxQty,
    unitPrice: Math.round(unitPrice * (1 - discount)),
    label: maxQty ? `${minQty}-${maxQty} ${plural}` : `${minQty}+ ${plural}`,
  }));
}

export function getTierForQty(
  unitPrice: number,
  unit: string,
  qty: number
): PriceTier {
  const tiers = getTiers(unitPrice, unit);
  return [...tiers].reverse().find((t) => qty >= t.minQty) ?? tiers[0];
}

export function getEffectiveUnitPrice(
  unitPrice: number,
  unit: string,
  qty: number
): number {
  return getTierForQty(unitPrice, unit, qty).unitPrice;
}

export function getLineTotal(
  unitPrice: number,
  unit: string,
  qty: number
): number {
  return getEffectiveUnitPrice(unitPrice, unit, qty) * qty;
}

export function getLineSavings(
  unitPrice: number,
  unit: string,
  qty: number
): number {
  return unitPrice * qty - getLineTotal(unitPrice, unit, qty);
}

// Next tier up, if any — used for "Add N more for $X/unit" upsell hints.
export function getNextTier(
  unitPrice: number,
  unit: string,
  qty: number
): PriceTier | null {
  const tiers = getTiers(unitPrice, unit);
  return tiers.find((t) => t.minQty > qty) ?? null;
}
