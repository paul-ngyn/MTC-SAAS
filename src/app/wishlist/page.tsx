// src/app/wishlist/page.tsx – Wishlist: favorited products, add individually
"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";
import { ALL_PRODUCTS } from "@/lib/catalog";
import { DEMO_WISHLIST_PRODUCT_IDS } from "@/lib/wishlist";
import CatalogProductCard from "@/components/CatalogProductCard";

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>(DEMO_WISHLIST_PRODUCT_IDS);
  const products = ids
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl uppercase text-gray-900 mb-2">
        Wishlist
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Products you've favorited to buy later.
      </p>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <HeartIcon className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link
            href="/categories"
            className="mt-4 inline-block text-sm font-bold text-navy hover:text-navy-dark"
          >
            Browse the catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <button
                onClick={() =>
                  setIds((prev) => prev.filter((id) => id !== product.id))
                }
                aria-label="Remove from wishlist"
                className="absolute top-5 right-5 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <HeartIcon className="w-4 h-4 text-navy" />
              </button>
              <CatalogProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
