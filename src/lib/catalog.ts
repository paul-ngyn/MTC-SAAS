// src/lib/catalog.ts
// Single source of truth for the storefront's static catalog scaffolding
// (categories, house/partner brands, featured products). Shared by the
// Navbar, homepage, and Footer so copy stays consistent in one place.
//
// Product/category records here are demo data used until the Supabase catalog
// is wired back up; they mirror the shape of the real domain types.

import type { Product } from "@/lib/types";

export type Category = {
  name: string;
  slug: string;
  productCount: number;
};

export type Brand = {
  code: string;
  name: string;
  blurb: string;
};

/** Top announcement-bar messages (rotate / separate with a dot in the UI). */
export const ANNOUNCEMENTS = [
  "Free freight on orders over $500 with MTC+",
  "Same-day shipping before 2 PM ET",
];

/** 01 · Shop by category */
export const CATEGORIES: Category[] = [
  { name: "Refrigeration", slug: "refrigeration", productCount: 214 },
  { name: "Cooking Equipment", slug: "cooking-equipment", productCount: 386 },
  { name: "Takeout Containers", slug: "takeout-containers", productCount: 152 },
  { name: "Packaging & Wrap", slug: "packaging-wrap", productCount: 298 },
  { name: "Smallwares", slug: "smallwares", productCount: 441 },
  { name: "Janitorial", slug: "janitorial", productCount: 167 },
];

/** 02 · Our brands — "Six lines, one hub" */
export const BRANDS: Brand[] = [
  { code: "TKN", name: "TKN", blurb: "Commercial cooking equipment" },
  { code: "MTC", name: "MTC", blurb: "House line — packaging & disposables" },
  { code: "IMPERIAL", name: "Imperial", blurb: "Ranges, ovens & broilers" },
  { code: "MB", name: "MB", blurb: "Refrigeration & cold storage" },
  { code: "HD", name: "HD", blurb: "Heavy-duty smallwares" },
  { code: "TD", name: "TD", blurb: "Takeout & delivery containers" },
];

/** Hero stat strip. */
export const HERO_STATS = [
  { value: "1,658", label: "SKUs in stock" },
  { value: "6", label: "Brands carried" },
  { value: "2-day", label: "Avg. delivery" },
];

/** 03 · Top movers this week */
export const TOP_MOVERS: Product[] = [
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
  },
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
  },
  {
    id: "tkn-g36",
    name: "36\" Countertop Gas Griddle, Manual Control",
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
  },
];

/** Currency helper shared across storefront components. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Demo-product lookup used as a fallback until the Supabase catalog is wired
 * back up, so product pages render for design review. Matches a Top Mover by
 * slug, otherwise synthesizes a generic case-priced product from the slug.
 */
export function getDemoProduct(slug: string): Product {
  const match = TOP_MOVERS.find((p) => p.slug === slug);
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
  };
}
