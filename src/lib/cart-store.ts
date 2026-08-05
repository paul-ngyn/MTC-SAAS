// src/lib/cart-store.ts – Zustand cart with localStorage persistence
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

type CartStore = {
  items: CartItem[];
  // localStorage doesn't exist during SSR, so the store always starts as
  // `items: []` there. This flips to true once the client has finished
  // reading persisted state — components that render different DOM based on
  // cart contents (e.g. empty-cart vs. cart-with-items) should treat the
  // store as empty until this is true, or the server- and client-rendered
  // HTML can disagree and React throws a hydration error.
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "mtc-cart",
      // With a synchronous storage like localStorage, persist's default
      // behavior is to rehydrate at store-creation time — synchronously,
      // before any component has rendered. That means `hasHydrated` would
      // already be true on the very first client render, defeating its
      // purpose. skipHydration defers that to an explicit call (see
      // CartHydration.tsx), which runs from a useEffect — guaranteed to fire
      // after the client's first render has already committed and matched
      // the server's HTML.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useCartStore.setState({ hasHydrated: true });
      },
    }
  )
);
