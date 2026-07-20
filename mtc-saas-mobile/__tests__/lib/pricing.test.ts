// __tests__/lib/pricing.test.ts

import {
  getTiers,
  getTierForQty,
  getEffectiveUnitPrice,
  getLineTotal,
  getLineSavings,
  getNextTier,
} from '../../lib/pricing';

const PRICE = 4299; // $42.99 per case

describe('getTiers', () => {
  it('returns three tiers with the standard 10%/20% discount schedule', () => {
    const tiers = getTiers(PRICE, 'case');
    expect(tiers).toHaveLength(3);
    expect(tiers[0]).toMatchObject({ minQty: 1, maxQty: 9, unitPrice: 4299 });
    expect(tiers[1]).toMatchObject({ minQty: 10, maxQty: 49, unitPrice: 3869 }); // 10% off, rounded
    expect(tiers[2]).toMatchObject({ minQty: 50, maxQty: null, unitPrice: 3439 }); // 20% off, rounded
  });

  it('pluralizes the unit in tier labels', () => {
    const tiers = getTiers(PRICE, 'case');
    expect(tiers[0].label).toBe('1-9 cases');
    expect(tiers[1].label).toBe('10-49 cases');
    expect(tiers[2].label).toBe('50+ cases');
  });

  it('does not double-pluralize a unit that already ends in s', () => {
    const tiers = getTiers(PRICE, 'lbs');
    expect(tiers[0].label).toBe('1-9 lbs');
  });
});

describe('getTierForQty', () => {
  it.each([
    [1, 1],
    [9, 1],
    [10, 10],
    [49, 10],
    [50, 50],
    [500, 50],
  ])('qty %i resolves to the tier starting at %i', (qty, expectedMinQty) => {
    expect(getTierForQty(PRICE, 'case', qty).minQty).toBe(expectedMinQty);
  });
});

describe('getEffectiveUnitPrice / getLineTotal / getLineSavings', () => {
  it('charges list price and has no savings below the first discount tier', () => {
    expect(getEffectiveUnitPrice(PRICE, 'case', 5)).toBe(4299);
    expect(getLineTotal(PRICE, 'case', 5)).toBe(4299 * 5);
    expect(getLineSavings(PRICE, 'case', 5)).toBe(0);
  });

  it('applies the 10-49 tier discount and reports savings', () => {
    expect(getEffectiveUnitPrice(PRICE, 'case', 10)).toBe(3869);
    expect(getLineTotal(PRICE, 'case', 10)).toBe(3869 * 10);
    expect(getLineSavings(PRICE, 'case', 10)).toBe((4299 - 3869) * 10);
  });

  it('applies the 50+ tier discount and reports savings', () => {
    expect(getEffectiveUnitPrice(PRICE, 'case', 60)).toBe(3439);
    expect(getLineTotal(PRICE, 'case', 60)).toBe(3439 * 60);
    expect(getLineSavings(PRICE, 'case', 60)).toBe((4299 - 3439) * 60);
  });
});

describe('getNextTier', () => {
  it('returns the 10-49 tier when below it', () => {
    expect(getNextTier(PRICE, 'case', 1)?.minQty).toBe(10);
  });

  it('returns the 50+ tier when in the middle tier', () => {
    expect(getNextTier(PRICE, 'case', 10)?.minQty).toBe(50);
  });

  it('returns null once at the top tier', () => {
    expect(getNextTier(PRICE, 'case', 50)).toBeNull();
  });
});
