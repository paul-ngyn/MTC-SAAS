// src/app/page.tsx – Storefront homepage (Maple Trade Corporation Hub)
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, BRANDS, TOP_MOVERS, HERO_STATS } from "@/lib/catalog";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] uppercase">
              <span className="text-gray-900">The Distribution Hub</span>{" "}
              <span className="text-navy">for Foodservice Supply.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-gray-600">
              Restaurant equipment, takeout containers, packaging and
              refrigeration — six house and partner brands, tiered wholesale
              pricing, shipped from one hub.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="px-7 py-3 bg-navy text-white text-sm font-bold hover:bg-navy-dark transition-colors"
              >
                Shop the catalog
              </Link>
              <Link
                href="/membership"
                className="px-7 py-3 border border-gray-300 text-gray-900 text-sm font-bold hover:border-navy hover:text-navy transition-colors"
              >
                Explore MTC+
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 border-t border-gray-200 pt-6 flex gap-12">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl text-navy">
                    {s.value}
                  </div>
                  <div className="mt-1 eyebrow text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo dropzone */}
          <div className="aspect-[4/5] lg:aspect-auto lg:h-[440px] border border-dashed border-tint-border bg-tint/60 flex flex-col items-center justify-center gap-2 text-navy">
            <PhotoIcon className="w-10 h-10 text-navy/50" />
            <span className="text-sm font-bold">Drop a warehouse / kitchen photo</span>
            <span className="text-xs text-navy/70">
              or <span className="underline">browse files</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 01 · Shop by category ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="eyebrow text-navy">01 · Shop by category</h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-navy hover:text-navy-dark"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="border border-gray-200 p-4 hover:border-navy hover:shadow-sm transition-all group"
            >
              <div className="text-sm font-bold uppercase tracking-wide text-gray-900 group-hover:text-navy leading-tight">
                {cat.name}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {cat.productCount} products
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 02 · Our brands ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-navy-dark text-white p-8 lg:p-10 grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
          <div>
            <div className="eyebrow text-white/50">02 · Our brands</div>
            <h2 className="mt-2 font-display text-3xl uppercase leading-tight">
              Six lines,<br />one hub
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANDS.map((b) => (
              <div
                key={b.code}
                className="border border-white/20 p-3 min-h-[128px] flex flex-col"
              >
                <div className="brand-code text-xl">{b.code}</div>
                <div className="mt-auto pt-3 text-[11px] leading-snug text-white/60 uppercase tracking-wide">
                  {b.blurb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Top movers this week ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="eyebrow text-navy">03 · Top movers this week</h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-navy hover:text-navy-dark"
          >
            Full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_MOVERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 04 · MTC+ Membership ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-tint border border-tint-border p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="eyebrow text-navy">04 · MTC+ Membership</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl uppercase text-gray-900 leading-tight">
              Free freight. Deeper tiers. Auto-reorder.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 leading-relaxed">
              Members ship free over $500, unlock an extra pricing tier on every
              SKU, and can put consumables on a recurring delivery schedule.
            </p>
          </div>
          <Link
            href="/membership"
            className="flex-shrink-0 px-8 py-3.5 bg-navy text-white text-sm font-bold hover:bg-navy-dark transition-colors"
          >
            See plans →
          </Link>
        </div>
      </section>
    </div>
  );
}
