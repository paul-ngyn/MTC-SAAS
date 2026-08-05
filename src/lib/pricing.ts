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

export type TierBreak = { minQty: number; maxQty: number | null; discount: number };

// Default schedule for case-quantity consumables: 1-9 at list, 10-49 at 10%
// off, 50+ at 20% off. High-ticket equipment instead carries its own
// `tierBreaks` on the product record (see src/lib/catalog.ts) since "50+
// reach-in refrigerators" isn't a realistic bulk tier — those use smaller
// unit-quantity breaks like 1+/3+/5+.
const DEFAULT_TIER_BREAKS: TierBreak[] = [
  { minQty: 1, maxQty: 9, discount: 0 },
  { minQty: 10, maxQty: 49, discount: 0.1 },
  { minQty: 50, maxQty: null, discount: 0.2 },
];

export function getTiers(
  unitPrice: number,
  unit: string,
  customBreaks?: TierBreak[]
): PriceTier[] {
  const plural = unit === "each" || unit.endsWith("s") ? unit : `${unit}s`;
  const breaks = customBreaks ?? DEFAULT_TIER_BREAKS;
  return breaks.map(({ minQty, maxQty, discount }) => ({
    minQty,
    maxQty,
    unitPrice: Math.round(unitPrice * (1 - discount)),
    label: maxQty ? `${minQty}-${maxQty} ${plural}` : `${minQty}+ ${plural}`,
  }));
}

export function getTierForQty(
  unitPrice: number,
  unit: string,
  qty: number,
  customBreaks?: TierBreak[]
): PriceTier {
  const tiers = getTiers(unitPrice, unit, customBreaks);
  return [...tiers].reverse().find((t) => qty >= t.minQty) ?? tiers[0];
}

export function getEffectiveUnitPrice(
  unitPrice: number,
  unit: string,
  qty: number,
  customBreaks?: TierBreak[]
): number {
  return getTierForQty(unitPrice, unit, qty, customBreaks).unitPrice;
}

export function getLineTotal(
  unitPrice: number,
  unit: string,
  qty: number,
  customBreaks?: TierBreak[]
): number {
  return getEffectiveUnitPrice(unitPrice, unit, qty, customBreaks) * qty;
}

export function getLineSavings(
  unitPrice: number,
  unit: string,
  qty: number,
  customBreaks?: TierBreak[]
): number {
  return unitPrice * qty - getLineTotal(unitPrice, unit, qty, customBreaks);
}

// Next tier up, if any — used for "Add N more for $X/unit" upsell hints.
export function getNextTier(
  unitPrice: number,
  unit: string,
  qty: number,
  customBreaks?: TierBreak[]
): PriceTier | null {
  const tiers = getTiers(unitPrice, unit, customBreaks);
  return tiers.find((t) => t.minQty > qty) ?? null;
}

// MTC+ members unlock one extra tier below the deepest public break — used
// as the highlighted "MTC+ member tier" row on the product page.
export function getMemberPrice(unitPrice: number, customBreaks?: TierBreak[]): number {
  const breaks = customBreaks ?? DEFAULT_TIER_BREAKS;
  const deepest = breaks[breaks.length - 1];
  const memberDiscount = Math.min(0.95, deepest.discount + 0.05);
  return Math.round(unitPrice * (1 - memberDiscount));
}
