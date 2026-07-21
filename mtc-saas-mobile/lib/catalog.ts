// lib/catalog.ts – demo catalog scaffolding for the mobile app.
//
// Mirrors the web app's src/lib/catalog.ts. Used as a fallback so the Browse
// and Product screens render real-looking data in Expo Go until the Supabase
// catalog is wired back up. Categories/products match the approved mockups.

import type { Category, Product } from '@/lib/types';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'refrigeration', name: 'Refrigeration', slug: 'refrigeration', description: 'Reach-ins, walk-ins, and cold storage.', image_url: null },
  { id: 'cooking-equipment', name: 'Cooking Equipment', slug: 'cooking-equipment', description: 'Ranges, ovens, griddles, and fryers.', image_url: null },
  { id: 'takeout-containers', name: 'Takeout Containers', slug: 'takeout-containers', description: 'Clamshells, deli cups, and lids.', image_url: null },
  { id: 'packaging-wrap', name: 'Packaging & Wrap', slug: 'packaging-wrap', description: 'Films, bags, and disposables.', image_url: null },
  { id: 'smallwares', name: 'Smallwares', slug: 'smallwares', description: 'Pans, utensils, and prep tools.', image_url: null },
  { id: 'janitorial', name: 'Janitorial', slug: 'janitorial', description: 'Cleaning chemicals and sanitation.', image_url: null },
];

export const DEMO_PRODUCTS: Product[] = [
  // Takeout Containers
  { id: 'td-c32-150', name: '32 oz Round Container with Lid, Case of 150', slug: 'td-c32-150', description: 'Clear PET deli container with tamper-evident lid.', price: 4299, image_url: null, category_id: 'takeout-containers', stock: 500, unit: 'case', sku: 'TD-C32-150', brand_code: 'TD' },
  { id: 'td-k9-200', name: '9" Kraft Clamshell, 3-Compartment, Case of 200', slug: 'td-k9-200', description: 'Compostable bagasse clamshell, 3-compartment.', price: 5499, image_url: null, category_id: 'takeout-containers', stock: 320, unit: 'case', sku: 'TD-K9-200', brand_code: 'TD' },
  { id: 'mtc-b500', name: 'Kraft Paper Bags, 1/6 BBL, Bundle of 500', slug: 'mtc-b500', description: 'Heavy-duty kraft grocery bags, 1/6 barrel.', price: 6499, image_url: null, category_id: 'takeout-containers', stock: 210, unit: 'bundle', sku: 'MTC-B500', brand_code: 'MTC' },

  // Refrigeration
  { id: 'mb-r49-2d', name: 'Reach-In Refrigerator, 49 cu ft, 2-Door', slug: 'mb-r49-2d', description: 'Stainless reach-in, self-closing doors, NSF certified.', price: 284900, image_url: null, category_id: 'refrigeration', stock: 18, unit: 'each', sku: 'MB-R49-2D', brand_code: 'MB' },
  { id: 'mb-uc27', name: 'Undercounter Freezer, 27", Single Door', slug: 'mb-uc27', description: 'Compact undercounter freezer for tight lines.', price: 189900, image_url: null, category_id: 'refrigeration', stock: 24, unit: 'each', sku: 'MB-UC27', brand_code: 'MB' },

  // Cooking Equipment
  { id: 'tkn-g36', name: '36" Countertop Gas Griddle, Manual Control', slug: 'tkn-g36', description: 'Three-burner, 3/4" steel plate, manual controls.', price: 118900, image_url: null, category_id: 'cooking-equipment', stock: 32, unit: 'each', sku: 'TKN-G36', brand_code: 'TKN' },
  { id: 'im-r6', name: '6-Burner Range with Oven, Natural Gas', slug: 'im-r6', description: 'Heavy-duty restaurant range, standard oven base.', price: 214900, image_url: null, category_id: 'cooking-equipment', stock: 12, unit: 'each', sku: 'IM-R6', brand_code: 'IMPERIAL' },

  // Packaging & Wrap
  { id: 'mtc-f18-2k', name: '18" Food Film Wrap, 2000 ft Roll', slug: 'mtc-f18-2k', description: 'Cling film with cutter box, foodservice grade.', price: 1799, image_url: null, category_id: 'packaging-wrap', stock: 140, unit: 'roll', sku: 'MTC-F18-2K', brand_code: 'MTC' },
  { id: 'mtc-foil18', name: 'Aluminum Foil, 18" x 500 ft', slug: 'mtc-foil18', description: 'Standard-gauge foodservice foil roll.', price: 2299, image_url: null, category_id: 'packaging-wrap', stock: 96, unit: 'roll', sku: 'MTC-FOIL18', brand_code: 'MTC' },

  // Smallwares
  { id: 'hd-p12-al', name: '12" Aluminum Fry Pan, NSF', slug: 'hd-p12-al', description: 'Heavy-gauge aluminum with reinforced rim.', price: 2199, image_url: null, category_id: 'smallwares', stock: 240, unit: 'each', sku: 'HD-P12-AL', brand_code: 'HD' },
  { id: 'hd-tong9', name: '9" Stainless Utility Tongs, Case of 12', slug: 'hd-tong9', description: 'Spring-loaded stainless tongs, scalloped edge.', price: 3499, image_url: null, category_id: 'smallwares', stock: 180, unit: 'case', sku: 'HD-TONG9', brand_code: 'HD' },

  // Janitorial
  { id: 'mtc-deg1', name: 'Heavy-Duty Degreaser, 1 gal, Case of 4', slug: 'mtc-deg1', description: 'Concentrated kitchen degreaser, 4x1 gallon.', price: 3899, image_url: null, category_id: 'janitorial', stock: 160, unit: 'case', sku: 'MTC-DEG1', brand_code: 'MTC' },
];

/** Products for a category slug (demo fallback). */
export function getDemoProductsForCategory(slug: string): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.category_id === slug);
}

/** Single product by slug, synthesizing a generic one if unknown. */
export function getDemoProduct(slug: string): Product {
  const match = DEMO_PRODUCTS.find((p) => p.slug === slug);
  if (match) return match;
  return {
    id: slug,
    name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    description: 'Wholesale foodservice product. Catalog details coming soon.',
    price: 4299,
    image_url: null,
    category_id: 'takeout-containers',
    stock: 240,
    unit: 'case',
    sku: slug.toUpperCase(),
    brand_code: 'MTC',
  };
}
