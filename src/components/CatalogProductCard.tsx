// src/components/CatalogProductCard.tsx
// Compact catalog-grid card: dashed photo placeholder, brand + SKU, name,
// short tier-price rows (deepest tier marked "bulk"), ship time, Add button.
"use client";

import Link from "next/link";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, formatShipsIn } from "@/lib/catalog";
import { getTiers } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export default function CatalogProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const tiers = getTiers(product.price, product.unit, product.tierBreaks);
  const soldOut = product.stock === 0;

  return (
    <div className="flex flex-col bg-white border border-gray-200 hover:border-navy/40 hover:shadow-sm transition-all">
      <Link href={`/products/${product.slug}`} className="block m-3 mb-0">
        <div className="relative aspect-[4/3] border border-dashed border-tint-border bg-tint/60 flex flex-col items-center justify-center gap-1 text-navy overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <>
              <PhotoIcon className="w-7 h-7 text-navy/50" />
              <span className="text-xs font-semibold">Product photo</span>
              <span className="text-[11px] text-navy/70 underline">
                or browse files
              </span>
            </>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <div className="flex items-center justify-between">
          {product.brand_code ? (
            <span className="text-[10px] font-bold tracking-wide uppercase text-gray-600 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
              {product.brand_code}
            </span>
          ) : (
            <span />
          )}
          {product.sku && (
            <span className="text-[11px] font-medium text-gray-400 tabular-nums">
              {product.sku}
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-navy transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Compact tier-price rows */}
        <div className="border-t border-gray-100 pt-2 space-y-1">
          {tiers.map((tier, i) => {
            const isBulk = i === tiers.length - 1;
            return (
              <div
                key={tier.minQty}
                className="flex items-center justify-between text-xs"
              >
                <span
                  className={
                    isBulk
                      ? "font-bold text-navy"
                      : "text-gray-500"
                  }
                >
                  {tier.minQty}+{isBulk ? " bulk" : ""}
                </span>
                <span
                  className={
                    isBulk
                      ? "font-bold text-navy tabular-nums"
                      : "text-gray-700 tabular-nums"
                  }
                >
                  {formatPrice(tier.unitPrice)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-[11px] text-gray-400 whitespace-nowrap">
            {soldOut ? "Out of stock" : formatShipsIn(product.shipsInDays)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={soldOut}
            className="px-4 py-1.5 bg-navy text-white text-xs font-bold hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
