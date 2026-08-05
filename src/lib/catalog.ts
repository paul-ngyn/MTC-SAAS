// src/lib/catalog.ts
// Single source of truth for the storefront's static catalog scaffolding
// (categories, house/partner brands, products, demo account data). Shared by
// the Navbar, homepage, catalog, brands, account, cart, and product pages so
// copy and numbers stay consistent in one place.
//
// Records here are demo data used until the Supabase catalog is wired back
// up; they mirror the shape of the real domain types.

import type { Product } from "@/lib/types";
import type { TierBreak } from "@/lib/pricing";

export type Category = {
  name: string;
  slug: string;
  productCount: number;
};

export type Brand = {
  code: string;
  name: string;
  blurb: string;
  description: string;
  skuCount: number;
  isHouse: boolean;
};

/** Top announcement-bar messages (rotate / separate with a dot in the UI). */
export const ANNOUNCEMENTS = [
  "Free freight on orders over $500 with MTC+",
  "Same-day shipping before 2 PM ET",
];

export const FREE_FREIGHT_THRESHOLD = 50000; // $500, in cents
export const FLAT_FREIGHT = 2499; // $24.99, in cents

/** 01 · Shop by category */
export const CATEGORIES: Category[] = [
  { name: "Refrigeration", slug: "refrigeration", productCount: 214 },
  { name: "Cooking Equipment", slug: "cooking-equipment", productCount: 386 },
  { name: "Takeout Containers", slug: "takeout-containers", productCount: 152 },
  { name: "Packaging & Wrap", slug: "packaging-wrap", productCount: 298 },
  { name: "Smallwares", slug: "smallwares", productCount: 441 },
  { name: "Janitorial", slug: "janitorial", productCount: 167 },
];

/** Brands directory — two house lines, four manufacturing partners. */
export const BRANDS: Brand[] = [
  {
    code: "MTC",
    name: "MTC",
    blurb: "Packaging & disposables",
    description:
      "The house line — film wrap, kraft bags, janitorial chemicals and everyday consumables at the sharpest tier pricing in the catalog.",
    skuCount: 412,
    isHouse: true,
  },
  {
    code: "TD",
    name: "TD",
    blurb: "Takeout & delivery containers",
    description:
      "Clamshells, round containers and delivery-ready packaging engineered for leak resistance and stacking.",
    skuCount: 152,
    isHouse: true,
  },
  {
    code: "TKN",
    name: "TKN",
    blurb: "Commercial cooking equipment",
    description:
      "Griddles, fryers and countertop cooking built for high-volume lines, all NSF-listed.",
    skuCount: 238,
    isHouse: false,
  },
  {
    code: "IMPERIAL",
    name: "IMPERIAL",
    blurb: "Ranges, ovens & broilers",
    description:
      "Heavy-duty gas ranges and ovens — the backbone of the hot line, with parts stocked in the hub.",
    skuCount: 148,
    isHouse: false,
  },
  {
    code: "MB",
    name: "MB",
    blurb: "Refrigeration & cold storage",
    description:
      "Reach-ins, undercounters and prep tables with NSF-certified cold-chain performance.",
    skuCount: 214,
    isHouse: false,
  },
  {
    code: "HD",
    name: "HD",
    blurb: "Heavy-duty smallwares",
    description:
      "Pans, steam table inserts and back-of-house tools built to survive a busy line.",
    skuCount: 494,
    isHouse: false,
  },
];

/** Hero stat strip. */
export const HERO_STATS = [
  { value: "1,658", label: "SKUs in stock" },
  { value: "6", label: "Brands carried" },
  { value: "2-day", label: "Avg. delivery" },
];

// Equipment items use small unit-quantity tiers (1+/N+/N+ bulk) instead of
// the default case-quantity schedule — see src/lib/pricing.ts.
const EQUIPMENT_TIERS = (secondQty: number, bulkQty: number, secondDiscount: number, bulkDiscount: number): TierBreak[] => [
  { minQty: 1, maxQty: secondQty - 1, discount: 0 },
  { minQty: secondQty, maxQty: bulkQty - 1, discount: secondDiscount },
  { minQty: bulkQty, maxQty: null, discount: bulkDiscount },
];

/** All Products catalog (12 SKUs across all six categories). */
export const ALL_PRODUCTS: Product[] = [
  {
    id: "mb-r49-2d",
    name: "Reach-In Refrigerator, 49 cu ft, 2-Door",
    slug: "mb-r49-2d",
    description: "Stainless reach-in, self-closing doors, NSF certified.",
    price: 284900,
    bulk_price: 254900,
    image_url: null,
    category_id: "refrigeration",
    stock: 18,
    unit: "each",
    sku: "MB-R49-2D",
    brand_code: "MB",
    tierBreaks: EQUIPMENT_TIERS(3, 5, 0.0526, 0.1053),
    shipsInDays: 2,
    specs: {
      Capacity: "49 cu ft",
      Doors: "2, self-closing",
      Temperature: "33–38°F",
      Certification: "NSF, ETL",
      Voltage: "115V / 60Hz",
      Casters: "Included",
    },
  },
  {
    id: "imp-ir-6",
    name: "6-Burner Gas Range with Standard Oven",
    slug: "imp-ir-6",
    description: "Heavy-duty restaurant range, standard oven base.",
    price: 319500,
    bulk_price: 289500,
    image_url: null,
    category_id: "cooking-equipment",
    stock: 12,
    unit: "each",
    sku: "IMP-IR-6",
    brand_code: "IMPERIAL",
    tierBreaks: EQUIPMENT_TIERS(2, 4, 0.0454, 0.0940),
    shipsInDays: 3,
    specs: {
      Burners: "6, 30,000 BTU each",
      Oven: "26.5\" standard base",
      Fuel: "Natural gas (LP convertible)",
      Certification: "NSF, ANSI",
      Width: "72\"",
    },
  },
  {
    id: "td-c32-150",
    name: "32 oz Round Container with Lid, Case of 150",
    slug: "td-c32-150",
    description: "Clear PET deli container with tamper-evident lid.",
    price: 4299,
    bulk_price: 3399,
    image_url: null,
    category_id: "takeout-containers",
    stock: 500,
    unit: "case",
    sku: "TD-C32-150",
    brand_code: "TD",
    shipsInDays: 0,
    specs: {
      Capacity: "32 oz",
      "Case pack": "150 sets",
      Material: "PP, microwave-safe",
      Lid: "Included, leak-resistant",
      Certification: "NSF",
      "Freezer-safe": "Yes",
    },
  },
  {
    id: "mtc-w18",
    name: '18" Food Film Wrap, 2000 ft Roll',
    slug: "mtc-w18",
    description: "Cling film with cutter box, foodservice grade.",
    price: 1649,
    bulk_price: 1319,
    image_url: null,
    category_id: "packaging-wrap",
    stock: 140,
    unit: "roll",
    sku: "MTC-W18",
    brand_code: "MTC",
    shipsInDays: 0,
    specs: {
      Width: "18\"",
      Length: "2,000 ft",
      Material: "PVC film",
      Dispenser: "Cutter box included",
    },
  },
  {
    id: "hd-p12-al",
    name: '12" Aluminum Fry Pan, NSF',
    slug: "hd-p12-al",
    description: "Heavy-gauge aluminum with reinforced rim.",
    price: 2199,
    bulk_price: 1699,
    image_url: null,
    category_id: "smallwares",
    stock: 240,
    unit: "each",
    sku: "HD-P12-AL",
    brand_code: "HD",
    shipsInDays: 1,
    specs: {
      Diameter: "12\"",
      Material: "Heavy-gauge aluminum",
      Handle: "Reinforced, riveted",
      Certification: "NSF",
    },
  },
  {
    id: "tkn-g36",
    name: '36" Countertop Gas Griddle, Manual Control',
    slug: "tkn-g36",
    description: "Three-burner, 3/4\" steel plate, manual controls.",
    price: 118900,
    bulk_price: 105900,
    image_url: null,
    category_id: "cooking-equipment",
    stock: 32,
    unit: "each",
    sku: "TKN-G36",
    brand_code: "TKN",
    tierBreaks: EQUIPMENT_TIERS(2, 3, 0.05, 0.1),
    shipsInDays: 2,
    specs: {
      Width: "36\"",
      "Plate thickness": "3/4\" steel",
      Burners: "3, manual control",
      Certification: "NSF",
    },
  },
  {
    id: "mtc-k9-200",
    name: '9" Kraft Clamshell, 3-Compartment, Case of 200',
    slug: "mtc-k9-200",
    description: "Compostable bagasse clamshell, 3-compartment.",
    price: 5499,
    bulk_price: 4399,
    image_url: null,
    category_id: "takeout-containers",
    stock: 320,
    unit: "case",
    sku: "TD-K9-200",
    brand_code: "TD",
    shipsInDays: 1,
    specs: {
      Compartments: "3",
      Material: "Compostable bagasse",
      "Case pack": "200",
      "Microwave-safe": "Yes",
    },
  },
  {
    id: "mb-uc27",
    name: 'Undercounter Freezer, 27", Single Door',
    slug: "mb-uc27",
    description: "Compact undercounter freezer for tight lines.",
    price: 189900,
    bulk_price: 169900,
    image_url: null,
    category_id: "refrigeration",
    stock: 24,
    unit: "each",
    sku: "MB-UC27",
    brand_code: "MB",
    tierBreaks: EQUIPMENT_TIERS(2, 4, 0.05, 0.1053),
    shipsInDays: 3,
    specs: {
      Width: "27\"",
      Temperature: "−10 to 0°F",
      Certification: "NSF, ETL",
      Casters: "Included",
    },
  },
  {
    id: "hd-tong9",
    name: '9" Stainless Utility Tongs, Case of 12',
    slug: "hd-tong9",
    description: "Spring-loaded stainless tongs, scalloped edge.",
    price: 3499,
    bulk_price: 2799,
    image_url: null,
    category_id: "smallwares",
    stock: 180,
    unit: "case",
    sku: "HD-TONG9",
    brand_code: "HD",
    shipsInDays: 1,
    specs: {
      Length: "9\"",
      Material: "Stainless steel",
      "Case pack": "12",
      Edge: "Scalloped",
    },
  },
  {
    id: "mtc-b500",
    name: "Kraft Paper Bags, 1/6 BBL, Bundle of 500",
    slug: "mtc-b500",
    description: "Heavy-duty kraft grocery bags, 1/6 barrel.",
    price: 6499,
    bulk_price: 5199,
    image_url: null,
    category_id: "packaging-wrap",
    stock: 210,
    unit: "bundle",
    sku: "MTC-B500",
    brand_code: "MTC",
    shipsInDays: 1,
    specs: {
      Size: "1/6 BBL",
      Material: "Kraft paper",
      "Bundle size": "500",
    },
  },
  {
    id: "mtc-deg5",
    name: "Degreaser Concentrate, 5 gal Pail",
    slug: "mtc-deg5",
    description: "Concentrated kitchen degreaser, food-safe surfaces.",
    price: 8999,
    bulk_price: 7199,
    image_url: null,
    category_id: "janitorial",
    stock: 96,
    unit: "pail",
    sku: "MTC-DEG5",
    brand_code: "MTC",
    shipsInDays: 1,
    specs: {
      Volume: "5 gal",
      Dilution: "1:64",
      Scent: "Citrus",
      "Food-safe surfaces": "Yes",
    },
  },
  {
    id: "imp-ov4",
    name: "Full-Size Convection Oven, Gas, Standard Depth",
    slug: "imp-ov4",
    description: "Even-heat convection oven for high-volume baking.",
    price: 429900,
    bulk_price: 389900,
    image_url: null,
    category_id: "cooking-equipment",
    stock: 8,
    unit: "each",
    sku: "IMP-OV4",
    brand_code: "IMPERIAL",
    tierBreaks: EQUIPMENT_TIERS(2, 3, 0.0465, 0.0930),
    shipsInDays: 4,
    specs: {
      Type: "Full-size convection",
      Fuel: "Natural gas",
      Racks: "5, included",
      Certification: "NSF",
    },
  },
];

/** 03 · Top movers this week — a curated slice of ALL_PRODUCTS. */
export const TOP_MOVERS: Product[] = [
  ALL_PRODUCTS.find((p) => p.slug === "td-c32-150")!,
  ALL_PRODUCTS.find((p) => p.slug === "mb-r49-2d")!,
  ALL_PRODUCTS.find((p) => p.slug === "hd-p12-al")!,
  ALL_PRODUCTS.find((p) => p.slug === "tkn-g36")!,
];

// Demo order/schedule/account data used to live here but has moved to
// src/app/account/data.ts, since it's only consumed by the /account/* pages.

/** Currency helper shared across storefront components. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatShipsIn(days?: number): string {
  if (days == null) return "Ships in 1 day";
  if (days === 0) return "Ships today";
  return `Ships in ${days} day${days === 1 ? "" : "s"}`;
}

/**
 * Demo-product lookup used as a fallback until the Supabase catalog is wired
 * back up, so product pages render for design review. Matches an ALL_PRODUCTS
 * entry by slug, otherwise synthesizes a generic case-priced product.
 */
export function getDemoProduct(slug: string): Product {
  const match = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (match) return match;
  return {
    id: slug,
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug,
    description: "Wholesale foodservice product. Catalog details coming soon.",
    price: 4299,
    bulk_price: 3399,
    image_url: null,
    category_id: "takeout-containers",
    stock: 240,
    unit: "case",
    sku: slug.toUpperCase(),
    brand_code: "MTC",
    shipsInDays: 1,
  };
}
