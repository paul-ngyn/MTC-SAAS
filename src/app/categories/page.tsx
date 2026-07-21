// src/app/categories/page.tsx – All Categories listing
import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export const metadata = {
  title: "Catalog — MTC Maple Trade Corporation Hub",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="eyebrow text-navy">Catalog</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-gray-900 leading-tight">
          Shop by category
        </h1>
        <p className="mt-3 text-sm text-gray-600 max-w-xl">
          Browse the full range — refrigeration, cooking equipment, takeout
          containers, packaging, smallwares and janitorial, across six house and
          partner brands.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col justify-between border border-gray-200 p-6 min-h-[120px] hover:border-navy hover:shadow-sm transition-all"
          >
            <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 group-hover:text-navy transition-colors leading-tight">
              {cat.name}
            </h2>
            <div className="mt-4 text-xs text-gray-500">
              {cat.productCount} products →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
