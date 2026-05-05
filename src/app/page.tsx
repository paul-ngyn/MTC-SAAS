// src/app/page.tsx – Homepage
import Link from "next/link";
import { CategoryIcon, IconPriceTag, IconTruck, IconNetwork } from "@/components/Icons";

const FEATURED_CATEGORIES = [
  { name: "Kitchen Equipment", slug: "kitchen-equipment" },
  { name: "Disposables", slug: "disposables" },
  { name: "Smallwares", slug: "smallwares" },
  { name: "Refrigeration", slug: "refrigeration" },
  { name: "Cleaning Supplies", slug: "cleaning-supplies" },
  { name: "Food Storage", slug: "food-storage" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c51a3] to-[#0f2b58] text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            The Central Hub for Restaurant Supply Distributors
          </h1>
          <p className="text-lg sm:text-xl text-[#d4e2f5] mb-8">
            Wholesale pricing, bulk ordering, and membership discounts — all in
            one place. Serving the foodservice industry nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="px-8 py-3 bg-white text-[#163d7d] font-bold rounded-lg shadow hover:bg-[#e9f0fa] transition-colors"
            >
              Browse Categories
            </Link>
            <Link
              href="/membership"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { Icon: IconPriceTag, title: "Wholesale Pricing", desc: "Member-exclusive bulk rates on thousands of SKUs." },
            { Icon: IconTruck, title: "Fast Fulfillment", desc: "Same-day processing on orders placed before 2 PM EST." },
            { Icon: IconNetwork, title: "Distributor Network", desc: "Vetted suppliers and trusted distributors nationwide." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-center mb-3 text-gray-700">
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#4a7fc4] hover:shadow-md transition-all group"
            >
              <CategoryIcon slug={cat.slug} className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-[#1c51a3] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-block px-6 py-3 bg-[#1c51a3] text-white font-semibold rounded-lg hover:bg-[#163d7d] transition-colors"
          >
            View All Categories &rarr;
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Ready to save more?</h2>
          <p className="text-gray-400 mb-6">
            Upgrade to a membership plan and unlock exclusive wholesale pricing,
            priority support, and early access to new products.
          </p>
          <Link
            href="/membership"
            className="inline-block px-8 py-3 bg-[#1c51a3] font-bold rounded-lg hover:bg-[#163d7d] transition-colors"
          >
            Explore Plans
          </Link>
        </div>
      </section>
    </>
  );
}
