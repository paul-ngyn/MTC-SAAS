// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const CartButton = () => (
    <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#1c51a3] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );

  const SearchBar = ({ placeholder }: { placeholder: string }) => (
    <div className="flex w-full rounded-md border border-gray-500 overflow-hidden focus-within:ring-2 focus-within:ring-[#2561bb] focus-within:border-[#2561bb]">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 pl-5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="px-3.5 flex items-center justify-center bg-[#1c51a3] hover:bg-[#163d7d] transition-colors"
      >
        <MagnifyingGlassIcon className="w-4 h-4 text-white" />
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Desktop row: logo | search | actions ── */}
        <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-6 h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-extrabold tracking-tight text-[#1c51a3]">MTC</span>
            <span className="text-sm font-medium text-gray-500">Supply Hub</span>
          </Link>

          <form onSubmit={handleSearch} className="flex justify-center">
            <div className="w-[83%]">
              <SearchBar placeholder="Search products, categories…" />
            </div>
          </form>

          <div className="flex items-center gap-3 flex-shrink-0">
            <CartButton />
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 text-sm font-semibold rounded-md border border-[#1c51a3] text-[#1c51a3] hover:bg-[#1c51a3] hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* ── Mobile: logo + actions ── */}
        <div className="flex md:hidden items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#1c51a3]">MTC</span>
          </Link>
          <div className="flex items-center gap-3">
            <CartButton />
            <Link
              href="/auth/sign-in"
              className="px-3 py-1.5 text-sm font-semibold rounded-md border border-[#1c51a3] text-[#1c51a3] hover:bg-[#1c51a3] hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* ── Mobile: full-width search row ── */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <SearchBar placeholder="Search products…" />
        </form>

      </div>
    </header>
  );
}
