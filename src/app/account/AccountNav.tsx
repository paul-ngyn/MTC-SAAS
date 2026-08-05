// src/app/account/AccountNav.tsx – Sidebar nav with active-route highlighting
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_LINKS } from "./data";

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-gray-200">
      {SIDEBAR_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-2 py-2.5 text-sm transition-colors ${
              active
                ? "bg-tint font-bold text-navy"
                : "text-gray-700 hover:text-navy hover:bg-tint"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
