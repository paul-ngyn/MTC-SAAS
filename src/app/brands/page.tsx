// src/app/brands/page.tsx – Brands directory
import Link from "next/link";
import { BRANDS } from "@/lib/catalog";

export const metadata = {
  title: "Brands — MTC Maple Trade Corporation Hub",
};

export default function BrandsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl uppercase text-gray-900">
        Brands Directory
      </h1>
      <p className="mt-3 text-sm text-gray-600 max-w-2xl">
        Six lines under one roof — two house brands and four manufacturing
        partners, all stocked in the hub and priced on the same tier
        structure.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BRANDS.map((brand) => (
          <div
            key={brand.code}
            className="flex gap-6 border border-gray-200 p-6"
          >
            <div className="w-20 flex-shrink-0 font-display text-2xl text-gray-900 leading-tight">
              {brand.name}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={
                    brand.isHouse
                      ? "text-[11px] font-bold tracking-wide uppercase text-navy bg-tint border border-tint-border px-2 py-0.5"
                      : "text-[11px] font-bold tracking-wide uppercase text-gray-600 border border-gray-300 px-2 py-0.5"
                  }
                >
                  {brand.isHouse ? "House brand" : "Partner"}
                </span>
                <span className="text-xs text-gray-400">
                  {brand.skuCount} SKUs stocked
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900">
                {brand.blurb}
              </h2>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                {brand.description}
              </p>
              <Link
                href={`/categories?brand=${brand.code}`}
                className="mt-2 inline-block text-sm font-bold text-navy hover:text-navy-dark"
              >
                Shop {brand.code} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
