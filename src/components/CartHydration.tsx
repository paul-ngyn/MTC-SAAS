// src/components/CartHydration.tsx
// Triggers the cart store's deferred localStorage rehydration once the app
// has mounted. Paired with `skipHydration: true` in cart-store.ts — see the
// comment there for why this can't happen at store-creation time. Renders
// nothing; mount once near the root (see layout.tsx).
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
