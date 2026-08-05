// src/app/products/[slug]/page.tsx – Product detail page (tiered pricing)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, formatShipsIn, getDemoProduct } from "@/lib/catalog";
import {
  getTiers,
  getTierForQty,
  getLineTotal,
  getLineSavings,
  getMemberPrice,
} from "@/lib/pricing";
import type { Product } from "@/lib/types";

const THUMBNAIL_LABELS = ["Angle", "Detail", "In use", "Case"];

function soldByLabel(unit: string) {
  if (unit === "case") return "sold by the case";
  if (unit === "each") return "sold individually";
  return `sold by the ${unit}`;
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
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

  const tiers = getTiers(product.price, product.unit, product.tierBreaks);
  const activeTier = getTierForQty(product.price, product.unit, quantity, product.tierBreaks);
  const lineTotal = getLineTotal(product.price, product.unit, quantity, product.tierBreaks);
  const unitPrice = lineTotal / quantity;
  const savings = getLineSavings(product.price, product.unit, quantity, product.tierBreaks);
  const memberPrice = getMemberPrice(product.price, product.tierBreaks);
  const inStock = product.stock > 0;
  const unitLabel = quantity === 1 || product.unit === "each" ? product.unit : `${product.unit}s`;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-navy">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-navy">
          Catalog
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Photo + thumbnails */}
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
                <span className="text-sm font-semibold">
                  Drop the main product photo
                </span>
                <span className="text-xs text-navy/70 underline">
                  or browse files
                </span>
              </>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {THUMBNAIL_LABELS.map((label) => (
              <div
                key={label}
                className="aspect-square border border-dashed border-tint-border bg-tint/40 flex flex-col items-center justify-center gap-1 text-navy"
              >
                <PhotoIcon className="w-4 h-4 text-navy/40" />
                <span className="text-[10px] font-semibold text-center leading-none">
                  {label}
                </span>
                <span className="text-[9px] text-navy/60 underline leading-none">
                  browse files
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Chips */}
          <div className="flex items-center gap-2 mb-3">
            {product.brand_code && (
              <span className="text-[11px] font-bold tracking-wide uppercase text-navy border border-tint-border bg-tint px-2 py-1">
                {product.brand_code}
              </span>
            )}
            <span
              className={`text-[11px] font-bold tracking-wide uppercase px-2 py-1 border ${
                inStock
                  ? "text-navy border-tint-border bg-white"
                  : "text-red-600 border-red-200 bg-red-50"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl uppercase text-gray-900 leading-tight">
            {product.name}
          </h1>
          <p className="mt-1.5 text-xs text-gray-500">
            {product.sku && <>SKU {product.sku} · </>}
            {soldByLabel(product.unit)} ·{" "}
            {formatShipsIn(product.shipsInDays)}
          </p>
          {product.description && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tiered pricing table */}
          <div className="mt-6 border border-gray-200">
            <div className="eyebrow text-gray-500 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              Tiered pricing — price drops with quantity
            </div>
            {tiers.map((tier) => {
              const active = tier.minQty === activeTier.minQty;
              return (
                <div
                  key={tier.minQty}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 ${
                    active ? "bg-tint" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${
                      active ? "font-bold text-navy" : "font-medium text-gray-700"
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span className="text-right">
                    <span
                      className={`block text-sm tabular-nums ${
                        active ? "font-bold text-navy" : "text-gray-700"
                      }`}
                    >
                      {formatPrice(tier.unitPrice)}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      / {product.unit}
                    </span>
                  </span>
                </div>
              );
            })}
            {/* MTC+ member tier */}
            <div className="flex items-center justify-between px-4 py-3 bg-tint/60">
              <span className="text-sm font-bold text-navy">
                MTC+ member tier{" "}
                <Link href="/membership" className="underline font-medium">
                  (join)
                </Link>
              </span>
              <span className="text-sm font-bold text-navy tabular-nums">
                {formatPrice(memberPrice)}
              </span>
            </div>
          </div>

          {/* Qty + Add */}
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
              {added ? "✓ Added" : `Add ${quantity} to cart`}
            </button>
          </div>

          {/* Savings note */}
          <p className="mt-3 text-sm text-gray-600">
            At {quantity} {unitLabel}: {" "}
            <span className="font-bold text-navy">{formatPrice(lineTotal)}</span>
            {" "}
            ({formatPrice(unitPrice)} each)
            {savings > 0 && (
              <span className="text-gray-500">
                {" "}
                — saving {formatPrice(savings)} vs. single-unit
              </span>
            )}
          </p>

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="eyebrow text-navy mb-3">Specifications</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
