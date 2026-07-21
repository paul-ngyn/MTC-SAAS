// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ANNOUNCEMENTS, CATEGORIES } from "@/lib/catalog";

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* ── Announcement bar ── */}
      <div className="bg-navy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 h-9 text-[11px] tracking-[0.14em] uppercase font-semibold text-center">
            {ANNOUNCEMENTS.map((msg, i) => (
              <span key={msg} className="flex items-center gap-4">
                {i > 0 && <span className="text-white/40">·</span>}
                <span className="text-white/85">{msg}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-[72px]">
            {/* Logo + tagline */}
            <Link href="/" className="flex items-baseline gap-3 flex-shrink-0">
              <span className="font-display text-3xl leading-none text-navy">
                MTC
              </span>
              <span className="hidden lg:inline text-[11px] tracking-[0.18em] uppercase font-semibold text-gray-400">
                Maple Trade Corporation Hub
              </span>
            </Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl hidden md:block"
            >
              <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/30">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 1,600+ products, SKUs…"
                  className="flex-1 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 bg-navy hover:bg-navy-dark transition-colors text-white text-sm font-semibold"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Account + Cart */}
            <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-navy transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Account</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-navy transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded bg-navy text-white text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category nav row ── */}
      <nav className="border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-7 h-12 text-[13px] font-semibold tracking-wide uppercase">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="text-gray-600 hover:text-navy transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/brands"
              className="ml-auto text-gray-600 hover:text-navy transition-colors"
            >
              Brands
            </Link>
            <Link
              href="/membership"
              className="text-navy hover:text-navy-dark transition-colors"
            >
              MTC+ Membership
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile search ── */}
      <form
        onSubmit={handleSearch}
        className="md:hidden border-b border-gray-200 px-4 py-2.5"
      >
        <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:border-navy">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKUs…"
            className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-3.5 flex items-center bg-navy text-white"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </header>
  );
}
