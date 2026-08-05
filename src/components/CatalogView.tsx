// src/components/CatalogView.tsx
// Shared "All Products" catalog shell: category list + brand checkboxes +
// MTC+ promo in the sidebar, filtered product grid in the main column. Used
// by both /categories (unfiltered) and /categories/[slug] (pre-filtered) so
// every catalog view shares one structure — only the product set changes.
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ALL_PRODUCTS, BRANDS, CATEGORIES } from "@/lib/catalog";
import CatalogProductCard from "@/components/CatalogProductCard";

export default function CatalogView({
  initialCategorySlug,
}: {
  initialCategorySlug?: string;
}) {
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug ?? "all");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(
    () => new Set(BRANDS.map((b) => b.code))
  );

  // Deep-link support: /categories?brand=TD pre-selects just that brand
  // (used by the "Shop TD →" links on the Brands directory page). Read via
  // plain window.location rather than next/navigation's useSearchParams,
  // which never resolves when wrapped in Suspense on this Next.js build.
  useEffect(() => {
    const brand = new URLSearchParams(window.location.search).get("brand");
    if (brand) setSelectedBrands(new Set([brand]));
  }, []);

  const toggleBrand = (code: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const activeCategory = CATEGORIES.find((c) => c.slug === categorySlug);

  const filtered = useMemo(
    () =>
      ALL_PRODUCTS.filter(
        (p) =>
          (categorySlug === "all" || p.category_id === categorySlug) &&
          (!p.brand_code || selectedBrands.has(p.brand_code))
      ),
    [categorySlug, selectedBrands]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="eyebrow text-navy mb-3">Category</h2>
            <div className="border-t border-gray-200">
              <button
                onClick={() => setCategorySlug("all")}
                className={`w-full flex items-center justify-between text-left px-2 py-2 text-sm transition-colors ${
                  categorySlug === "all"
                    ? "bg-tint font-bold text-navy"
                    : "font-semibold text-gray-900 hover:text-navy"
                }`}
              >
                <span>All products</span>
                <span className="text-gray-400 tabular-nums">
                  {ALL_PRODUCTS.length}
                </span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategorySlug(cat.slug)}
                  className={`w-full flex items-center justify-between text-left px-2 py-2 text-sm transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-tint font-bold text-navy"
                      : "text-gray-700 hover:text-navy"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-gray-400 tabular-nums">
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="eyebrow text-navy mb-3">Brand</h2>
            <div className="border-t border-gray-200 pt-3 space-y-2.5">
              {BRANDS.map((brand) => (
                <label
                  key={brand.code}
                  className="flex items-center gap-2.5 text-sm text-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(brand.code)}
                    onChange={() => toggleBrand(brand.code)}
                    className="w-4 h-4 accent-navy border-gray-300"
                  />
                  {brand.code}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-tint border border-tint-border p-4">
            <h3 className="text-sm font-bold text-gray-900">
              MTC+ Tier Pricing
            </h3>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
              Members unlock one extra bulk tier on every SKU.
            </p>
            <Link
              href="/membership"
              className="mt-2 inline-block text-xs font-bold text-navy hover:text-navy-dark"
            >
              See plans →
            </Link>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-gray-200">
            <h1 className="font-display text-3xl uppercase text-gray-900">
              {activeCategory ? activeCategory.name : "All Products"}
            </h1>
            <span className="text-sm text-gray-500">
              {filtered.length} results
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-24">
              No products match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
