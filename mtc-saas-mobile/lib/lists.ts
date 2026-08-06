// lib/lists.ts – Saved product lists (demo data). Mirrors web src/lib/lists.ts.

import { DEMO_PRODUCTS } from '@/lib/catalog';
import type { Product } from '@/lib/types';

export type SavedListItem = { productId: string; quantity: number };
export type SavedList = { id: string; name: string; items: SavedListItem[] };

export const DEMO_LISTS: SavedList[] = [
  {
    id: 'weekend-catering',
    name: 'Weekend Catering Order',
    items: [
      { productId: 'td-c32-150', quantity: 4 },
      { productId: 'mtc-w18', quantity: 2 },
      { productId: 'mtc-b500', quantity: 1 },
    ],
  },
  {
    id: 'monthly-janitorial',
    name: 'Monthly Janitorial Restock',
    items: [{ productId: 'mtc-deg5', quantity: 3 }],
  },
];

export function getList(id: string): SavedList | undefined {
  return DEMO_LISTS.find((l) => l.id === id);
}

export function resolveListItems(list: SavedList): { product: Product; quantity: number }[] {
  return list.items
    .map((i) => {
      const product = DEMO_PRODUCTS.find((p) => p.id === i.productId);
      return product ? { product, quantity: i.quantity } : null;
    })
    .filter((i): i is { product: Product; quantity: number } => !!i);
}
