// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/categories", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-orange-600">
            MTC
          </span>
          <span className="hidden sm:inline text-sm font-medium text-gray-500">
            Supply Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/auth/sign-in"
            className="hidden md:inline-block px-4 py-2 text-sm font-semibold rounded-md border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-gray-700 hover:text-orange-600"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/auth/sign-in"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block text-center px-4 py-2 text-sm font-semibold rounded-md bg-orange-600 text-white"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
