// src/lib/lists.ts – "My Lists": named saved product lists for one-click
// reordering (e.g. a standing weekly prep order). Display/demo data for now —
// no backend wiring yet, same as the rest of the account-adjacent data.
import { ALL_PRODUCTS } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export type SavedList = {
  id: string;
  name: string;
  items: { productId: string; quantity: number }[];
};

export const DEMO_LISTS: SavedList[] = [
  {
    id: "weekly-prep-order",
    name: "Weekly Prep Order",
    items: [
      { productId: "td-c32-150", quantity: 20 },
      { productId: "mtc-w18", quantity: 5 },
      { productId: "mtc-b500", quantity: 3 },
    ],
  },
  {
    id: "catering-kit",
    name: "Catering Kit",
    items: [
      { productId: "hd-p12-al", quantity: 10 },
      { productId: "tkn-g36", quantity: 1 },
      { productId: "mtc-k9-200", quantity: 15 },
    ],
  },
  {
    id: "front-of-house-restock",
    name: "Front-of-House Restock",
    items: [
      { productId: "mtc-deg5", quantity: 2 },
      { productId: "hd-tong9", quantity: 4 },
      { productId: "mtc-w18", quantity: 2 },
    ],
  },
];

export function getList(id: string): SavedList | undefined {
  return DEMO_LISTS.find((l) => l.id === id);
}

/** Resolve a list's items to full Product records (skipping any unknown ids). */
export function resolveListItems(
  list: SavedList
): { product: Product; quantity: number }[] {
  return list.items
    .map((item) => {
      const product = ALL_PRODUCTS.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null);
}
