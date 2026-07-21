// src/components/Footer.tsx
import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string; muted?: boolean }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Catalog", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "MTC+ Membership", href: "/membership" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Orders", href: "/orders" },
      { label: "Cart", href: "/cart" },
      { label: "Tax-exempt program", href: "/tax-exempt" },
    ],
  },
  {
    title: "App",
    links: [
      { label: "MTC mobile app", href: "/app" },
      { label: "iOS & Android", href: "/app", muted: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand blurb */}
        <div className="col-span-2 lg:col-span-1">
          <span className="font-display text-2xl text-navy">MTC</span>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
            Maple Trade Corporation Hub — wholesale foodservice distribution for
            businesses and home buyers.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="eyebrow text-gray-400 mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={
                      link.muted
                        ? "text-gray-400"
                        : "text-gray-700 hover:text-navy transition-colors"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Maple Trade Corporation
        </div>
      </div>
    </footer>
  );
}
