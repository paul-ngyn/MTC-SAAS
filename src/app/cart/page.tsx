// src/app/cart/page.tsx – Cart & Checkout (tiered pricing + MTC+ freight)
//
// Card capture is intentionally NOT collected on this page — "Place order"
// redirects to Stripe's hosted checkout (via /api/checkout), same as before.
// The Business/name, Email, and Shipping address fields are real inputs
// passed along as checkout metadata; Card number/Exp/CVC are shown only to
// match the approved design and are disabled so no PAN data is ever
// captured client-side.
"use client";

import { useState } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, FREE_FREIGHT_THRESHOLD, FLAT_FREIGHT } from "@/lib/catalog";
import {
  getEffectiveUnitPrice,
  getLineTotal,
  getLineSavings,
  getNextTier,
} from "@/lib/pricing";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  // The cart persists to localStorage, which the server can't see — it
  // always renders the empty state. Keep showing that same empty state on
  // the client's first render too, until hasHydrated confirms we've read
  // the real (possibly nonempty) persisted cart; otherwise the server- and
  // client-rendered trees can disagree (empty state vs. a populated table)
  // and React throws a hydration error.
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasHydrated || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase text-gray-900 mb-3">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link
          href="/categories"
          className="inline-block px-8 py-3 bg-navy text-white font-bold hover:bg-navy-dark transition-colors"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  const listSubtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const bulkSavings = items.reduce(
    (sum, i) =>
      sum + getLineSavings(i.product.price, i.product.unit, i.quantity, i.product.tierBreaks),
    0
  );
  const subtotal = listSubtotal - bulkSavings;
  const freeFreight = subtotal >= FREE_FREIGHT_THRESHOLD;
  const freight = freeFreight ? 0 : FLAT_FREIGHT;
  const total = subtotal + freight;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const amountToFreeFreight = FREE_FREIGHT_THRESHOLD - subtotal;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: getEffectiveUnitPrice(i.product.price, i.product.unit, i.quantity, i.product.tierBreaks),
            quantity: i.quantity,
            image: i.product.image_url,
          })),
          business,
          email,
          address,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to start checkout.");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline gap-3 mb-8">
        <h1 className="font-display text-3xl uppercase text-gray-900">
          Cart &amp; Checkout
        </h1>
        <span className="text-sm text-gray-500">{itemCount} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line items table */}
        <div className="lg:col-span-2 border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-4 py-3">
                  Item
                </th>
                <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-4 py-3">
                  Qty
                </th>
                <th className="text-right font-bold text-gray-500 text-xs uppercase tracking-wide px-4 py-3">
                  Unit (tiered)
                </th>
                <th className="text-right font-bold text-gray-500 text-xs uppercase tracking-wide px-4 py-3">
                  Line total
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const { product, quantity } = item;
                const unitPrice = getEffectiveUnitPrice(
                  product.price,
                  product.unit,
                  quantity,
                  product.tierBreaks
                );
                const lineTotal = getLineTotal(
                  product.price,
                  product.unit,
                  quantity,
                  product.tierBreaks
                );
                const nextTier = getNextTier(
                  product.price,
                  product.unit,
                  quantity,
                  product.tierBreaks
                );

                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 last:border-b-0 align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {product.brand_code && (
                          <span className="text-[10px] font-bold tracking-wide uppercase text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
                            {product.brand_code}
                          </span>
                        )}
                        {product.sku && (
                          <span className="text-[11px] text-gray-400 tabular-nums">
                            {product.sku}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="mt-1 block font-bold text-gray-900 hover:text-navy"
                      >
                        {product.name}
                      </Link>
                      {nextTier ? (
                        <p className="mt-1 text-xs text-gray-400">
                          Add {nextTier.minQty - quantity} more to unlock{" "}
                          {formatPrice(nextTier.unitPrice)} / {product.unit}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-navy font-medium">
                          Deepest tier unlocked
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center border border-gray-300 w-fit">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease"
                          className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-semibold text-gray-900 border-x border-gray-300 text-sm tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase"
                          className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-700 tabular-nums whitespace-nowrap">
                      {formatPrice(unitPrice)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-navy tabular-nums whitespace-nowrap">
                      {formatPrice(lineTotal)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Order summary + checkout form */}
        <div className="space-y-6">
          <div className="border border-gray-200 p-6">
            <h2 className="eyebrow text-navy mb-4">Order summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="tabular-nums">{formatPrice(listSubtotal)}</span>
              </div>
              {bulkSavings > 0 && (
                <div className="flex justify-between text-navy font-medium">
                  <span>Bulk-tier savings</span>
                  <span className="tabular-nums">−{formatPrice(bulkSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Freight</span>
                <span className="tabular-nums">
                  {freeFreight ? "Free" : formatPrice(freight)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
            {!freeFreight && (
              <p className="mt-3 text-xs text-gray-500">
                Add {formatPrice(amountToFreeFreight)} more — or{" "}
                <Link href="/membership" className="text-navy font-bold underline">
                  join MTC+
                </Link>{" "}
                — for free freight.
              </p>
            )}
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="eyebrow text-navy mb-4">Checkout</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs font-semibold text-gray-500 mb-1">
                  Business / name
                </span>
                <input
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Maple Bistro Inc."
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-gray-500 mb-1">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orders@maplebistro.com"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-gray-500 mb-1">
                  Shipping address
                </span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, province/state"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-500 mb-1">
                    Card number
                  </span>
                  <input
                    disabled
                    placeholder="•••• •••• •••• ••••"
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-500 mb-1">
                    Exp / CVC
                  </span>
                  <input
                    disabled
                    placeholder="MM/YY · CVC"
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                  />
                </label>
              </div>
              <p className="text-[11px] text-gray-400">
                Payment details are collected securely on Stripe&apos;s hosted
                checkout — never on this page.
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-5 py-3 bg-navy text-white font-bold hover:bg-navy-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Redirecting…" : `Place order · ${formatPrice(total)}`}
            </button>
            <Link
              href="/categories"
              className="block text-center mt-3 text-xs text-gray-500 hover:text-navy transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
