// src/app/checkout/page.tsx – Checkout page (Stripe Checkout redirect)
"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  const handleCheckout = async () => {
    if (items.length === 0) return;
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
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image_url,
          })),
        }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to create checkout session.");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/categories" className="px-6 py-3 bg-[#1c51a3] text-white rounded-lg font-bold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Order Review</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.product.price)} / {item.product.unit} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-[#1c51a3]">{formatPrice(total())}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-800 text-sm">
        <strong>Secure checkout powered by Stripe.</strong> You will be redirected to Stripe&apos;s
        hosted payment page where you can enter your payment details safely.
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-[#1c51a3] text-white font-bold text-lg rounded-xl hover:bg-[#163d7d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Redirecting to Stripe…" : `Pay ${formatPrice(total())}`}
      </button>

      <Link
        href="/cart"
        className="block text-center mt-4 text-sm text-gray-500 hover:text-[#1c51a3] transition-colors"
      >
        ← Back to Cart
      </Link>
    </div>
  );
}
