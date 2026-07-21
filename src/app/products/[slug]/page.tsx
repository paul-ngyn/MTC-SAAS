// src/app/products/[slug]/page.tsx – Product detail page (tiered pricing)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getDemoProduct } from "@/lib/catalog";
import {
  getTiers,
  getTierForQty,
  getLineTotal,
  getLineSavings,
} from "@/lib/pricing";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let active = true;
    (async () => {
      let data: Product | null = null;
      try {
        const supabase = createClient();
        const res = await supabase
          .from("products")
          .select("*")
          .eq("slug", params.slug)
          .single();
        data = res.data;
      } catch {
        data = null;
      }
      if (!active) return;
      // Fall back to demo data until the Supabase catalog is wired up.
      setProduct(data ?? getDemoProduct(params.slug));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
      </div>
    );
  }

  if (!product) return null;

  const tiers = getTiers(product.price, product.unit);
  const activeTier = getTierForQty(product.price, product.unit, quantity);
  const lineTotal = getLineTotal(product.price, product.unit, quantity);
  const savings = getLineSavings(product.price, product.unit, quantity);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb + SKU */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-navy">
            Catalog
          </Link>
        </nav>
        {product.sku && (
          <span className="text-xs font-medium text-gray-400 tabular-nums">
            {product.sku}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Photo */}
        <div>
          <div className="relative aspect-square border border-dashed border-tint-border bg-tint/60 flex flex-col items-center justify-center gap-2 text-navy overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <>
                <PhotoIcon className="w-12 h-12 text-navy/40" />
                <span className="text-sm font-semibold">Product photo</span>
              </>
            )}
          </div>
          {/* Brand + stock chips */}
          <div className="flex items-center gap-2 mt-4">
            {product.brand_code && (
              <span className="text-[11px] font-bold tracking-wide uppercase text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1">
                {product.brand_code}
              </span>
            )}
            <span
              className={`text-[11px] font-bold tracking-wide uppercase px-2 py-1 border ${
                inStock
                  ? "text-navy border-tint-border bg-tint"
                  : "text-red-600 border-red-200 bg-red-50"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl uppercase text-gray-900 leading-tight">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tiered pricing table */}
          <div className="mt-6 border border-gray-200">
            <div className="eyebrow text-gray-500 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              Tiered pricing
            </div>
            {tiers.map((tier) => {
              const active = tier.minQty === activeTier.minQty;
              return (
                <div
                  key={tier.minQty}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                    active ? "bg-tint" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${
                      active
                        ? "font-bold text-navy"
                        : "font-medium text-gray-700"
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span
                    className={`text-sm tabular-nums ${
                      active ? "font-bold text-navy" : "text-gray-700"
                    }`}
                  >
                    {formatPrice(tier.unitPrice)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Savings note */}
          <p className="mt-3 text-sm text-gray-600">
            At {quantity} {quantity === 1 ? product.unit : `${product.unit}s`}:{" "}
            <span className="font-bold text-navy">{formatPrice(lineTotal)}</span>
            {savings > 0 && (
              <span className="text-gray-500">
                {" "}
                — saving {formatPrice(savings)} vs. single-unit
              </span>
            )}
          </p>

          {/* Quantity + Add */}
          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-4 text-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="px-5 py-3 font-bold text-gray-900 tabular-nums border-x border-gray-300 min-w-[64px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="px-4 text-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 bg-navy text-white font-bold hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {added
                ? "✓ Added"
                : `Add ${quantity} · ${formatPrice(lineTotal)}`}
            </button>
          </div>

          <Link
            href="/cart"
            className="mt-3 block text-center py-3 border border-gray-300 text-gray-700 font-semibold hover:border-navy hover:text-navy transition-colors"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
