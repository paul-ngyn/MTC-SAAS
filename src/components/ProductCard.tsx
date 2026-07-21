// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const soldOut = product.stock === 0;

  return (
    <div className="flex flex-col bg-white border border-gray-200 hover:border-navy/40 hover:shadow-sm transition-all">
      {/* Photo placeholder */}
      <Link
        href={`/products/${product.slug}`}
        className="block m-3 mb-0"
      >
        <div className="relative aspect-[4/3] border border-dashed border-tint-border bg-tint/60 flex flex-col items-center justify-center gap-1 text-navy overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <>
              <PhotoIcon className="w-7 h-7 text-navy/50" />
              <span className="text-xs font-semibold">Product photo</span>
            </>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Brand tag + SKU */}
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

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-navy transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1">
          <span className="text-lg font-extrabold text-navy">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-400">
            {" "}/ {product.unit}
            {product.bulk_price != null && (
              <> · bulk from {formatPrice(product.bulk_price)}</>
            )}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          disabled={soldOut}
          className="w-full mt-2 py-2.5 bg-navy text-white text-sm font-bold hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {soldOut ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
