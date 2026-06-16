// src/app/products/[slug]/page.tsx – Product detail page
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.slug]);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c51a3]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">
          This product does not exist or has been removed.
        </p>
        <Link href="/categories" className="px-6 py-3 bg-[#1c51a3] text-white rounded-lg font-semibold">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#1c51a3]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-[#1c51a3]">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-bold text-[#1c51a3]">{formatPrice(product.price)}</span>
              <span className="text-gray-400">/ {product.unit}</span>
            </div>
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-700" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} units in stock` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold text-gray-900 border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3 px-6 rounded-lg bg-[#1c51a3] text-white font-bold text-lg hover:bg-[#163d7d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>

          <Link
            href="/cart"
            className="text-center py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-[#4a7fc4] hover:text-[#1c51a3] transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
