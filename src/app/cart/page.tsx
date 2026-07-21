// src/app/cart/page.tsx – Shopping cart (tiered pricing + MTC+ freight)
"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/catalog";
import {
  getEffectiveUnitPrice,
  getLineTotal,
  getLineSavings,
  getTierForQty,
} from "@/lib/pricing";

// MTC+ members ship free over this threshold (see design).
const FREE_FREIGHT_THRESHOLD = 50000; // $500 in cents
const FLAT_FREIGHT = 3500; // $35 estimate under threshold

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
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
    (sum, i) => sum + getLineSavings(i.product.price, i.product.unit, i.quantity),
    0
  );
  const subtotal = listSubtotal - bulkSavings;
  const freeFreight = subtotal >= FREE_FREIGHT_THRESHOLD;
  const freight = freeFreight ? 0 : FLAT_FREIGHT;
  const total = subtotal + freight;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline gap-3 mb-8">
        <h1 className="font-display text-3xl uppercase text-gray-900">Cart</h1>
        <span className="text-sm text-gray-500">{itemCount} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line items */}
        <div className="lg:col-span-2 border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => {
            const { product, quantity } = item;
            const unitPrice = getEffectiveUnitPrice(
              product.price,
              product.unit,
              quantity
            );
            const lineTotal = getLineTotal(product.price, product.unit, quantity);
            const tier = getTierForQty(product.price, product.unit, quantity);
            const discounted = unitPrice < product.price;
            const perUnitOff = product.price - unitPrice;

            return (
              <div key={product.id} className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {product.brand_code && (
                      <span className="text-[10px] font-bold tracking-wide uppercase text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
                        {product.brand_code}
                      </span>
                    )}
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-gray-900 hover:text-navy line-clamp-1"
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Qty stepper */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        aria-label="Decrease"
                        className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold text-gray-900 border-x border-gray-300 text-sm tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        aria-label="Increase"
                        className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    {discounted && (
                      <span className="text-xs text-navy font-medium">
                        Bulk tier — {formatPrice(perUnitOff)} off / {product.unit}
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="ml-auto p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {tier.label} · {formatPrice(unitPrice)} / {product.unit}
                  </p>
                </div>

                <div className="text-right font-bold text-gray-900 whitespace-nowrap tabular-nums">
                  {formatPrice(lineTotal)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            {bulkSavings > 0 && (
              <div className="flex justify-between text-navy">
                <span>Bulk-tier savings</span>
                <span className="tabular-nums">
                  −{formatPrice(bulkSavings)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Freight (MTC+)</span>
              <span className="tabular-nums">
                {freeFreight ? "Free" : formatPrice(freight)}
              </span>
            </div>
            {!freeFreight && (
              <p className="text-[11px] text-gray-400">
                Free freight over {formatPrice(FREE_FREIGHT_THRESHOLD)} with MTC+.
              </p>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full mt-6 py-3 bg-navy text-white font-bold text-center hover:bg-navy-dark transition-colors"
          >
            Checkout
          </Link>
          <div className="mt-3 flex items-center justify-between text-xs">
            <Link
              href="/categories"
              className="text-gray-500 hover:text-navy transition-colors"
            >
              ← Continue shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
