import {
  getTiers,
  getTierForQty,
  getEffectiveUnitPrice,
  getLineTotal,
  getLineSavings,
  getNextTier,
  getMemberPrice,
  type TierBreak,
} from "@/lib/pricing";

describe("getTiers", () => {
  it("returns the default 1-9 / 10-49 / 50+ schedule with correct discounts", () => {
    const tiers = getTiers(10000, "case");
    expect(tiers).toEqual([
      { minQty: 1, maxQty: 9, unitPrice: 10000, label: "1-9 cases" },
      { minQty: 10, maxQty: 49, unitPrice: 9000, label: "10-49 cases" },
      { minQty: 50, maxQty: null, unitPrice: 8000, label: "50+ cases" },
    ]);
  });

  it("does not pluralize a unit that already ends in s or is 'each'", () => {
    expect(getTiers(1000, "each")[0].label).toBe("1-9 each");
    expect(getTiers(1000, "pails")[0].label).toBe("1-9 pails");
  });

  it("pluralizes a singular unit", () => {
    expect(getTiers(1000, "roll")[0].label).toBe("1-9 rolls");
  });

  it("uses custom tier breaks when provided (e.g. equipment 1+/3+/5+)", () => {
    const equipmentTiers: TierBreak[] = [
      { minQty: 1, maxQty: 2, discount: 0 },
      { minQty: 3, maxQty: 4, discount: 0.1 },
      { minQty: 5, maxQty: null, discount: 0.2 },
    ];
    const tiers = getTiers(100000, "each", equipmentTiers);
    expect(tiers.map((t) => t.label)).toEqual(["1-2 each", "3-4 each", "5+ each"]);
    expect(tiers.map((t) => t.unitPrice)).toEqual([100000, 90000, 80000]);
  });
});

describe("getTierForQty", () => {
  it("picks the deepest tier the quantity qualifies for", () => {
    expect(getTierForQty(10000, "case", 1).minQty).toBe(1);
    expect(getTierForQty(10000, "case", 9).minQty).toBe(1);
    expect(getTierForQty(10000, "case", 10).minQty).toBe(10);
    expect(getTierForQty(10000, "case", 49).minQty).toBe(10);
    expect(getTierForQty(10000, "case", 50).minQty).toBe(50);
    expect(getTierForQty(10000, "case", 1000).minQty).toBe(50);
  });
});

describe("getEffectiveUnitPrice / getLineTotal / getLineSavings", () => {
  it("charges list price with no savings below the first bulk break", () => {
    expect(getEffectiveUnitPrice(10000, "case", 1)).toBe(10000);
    expect(getLineTotal(10000, "case", 1)).toBe(10000);
    expect(getLineSavings(10000, "case", 1)).toBe(0);
  });

  it("applies the 10-49 discount and computes savings correctly", () => {
    expect(getEffectiveUnitPrice(10000, "case", 10)).toBe(9000);
    expect(getLineTotal(10000, "case", 10)).toBe(90000);
    // list price would have been 10 * 10000 = 100000; saved 10000
    expect(getLineSavings(10000, "case", 10)).toBe(10000);
  });

  it("applies the 50+ discount and computes savings correctly", () => {
    expect(getEffectiveUnitPrice(10000, "case", 50)).toBe(8000);
    expect(getLineTotal(10000, "case", 50)).toBe(400000);
    expect(getLineSavings(10000, "case", 50)).toBe(100000);
  });
});

describe("getNextTier", () => {
  it("returns the next tier up when one exists", () => {
    expect(getNextTier(10000, "case", 1)?.minQty).toBe(10);
    expect(getNextTier(10000, "case", 10)?.minQty).toBe(50);
  });

  it("returns null once the deepest tier is reached", () => {
    expect(getNextTier(10000, "case", 50)).toBeNull();
    expect(getNextTier(10000, "case", 1000)).toBeNull();
  });
});

describe("getMemberPrice", () => {
  it("gives members 5% more off than the deepest public tier", () => {
    // default deepest discount is 20%, so members get 25% off list
    expect(getMemberPrice(10000)).toBe(7500);
  });

  it("uses the deepest custom tier's discount as the baseline", () => {
    const equipmentTiers: TierBreak[] = [
      { minQty: 1, maxQty: 4, discount: 0 },
      { minQty: 5, maxQty: null, discount: 0.1 },
    ];
    expect(getMemberPrice(100000, equipmentTiers)).toBe(85000);
  });

  it("never discounts more than 95%", () => {
    const extreme: TierBreak[] = [{ minQty: 1, maxQty: null, discount: 0.93 }];
    expect(getMemberPrice(10000, extreme)).toBe(500); // 5% of 10000, not negative
  });
});
