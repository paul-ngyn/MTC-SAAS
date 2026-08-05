// src/components/AccountMenu.tsx – Navbar "Account" / "Sign In" button →
// two-column dropdown. Left column is state-dependent: My Lists + Log out
// when signed in, or Sign in + Create an account when signed out. Right
// column (Account sections) is unchanged either way.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { SIDEBAR_LINKS } from "@/app/account/data";
import { useAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const LIST_LINKS = [
  { label: "Create a list", href: "/lists?create=1" },
  { label: "My list", href: "/lists" },
  { label: "Wishlist", href: "/wishlist" },
];

// Small delay before closing on mouseleave so moving the cursor diagonally
// from the button down into the panel doesn't cause it to flicker shut.
const CLOSE_DELAY_MS = 150;

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { user } = useAuthUser();
  const signedIn = !!user;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };
  const closeSoon = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => () => clearCloseTimer(), []);

  const handleSignOut = async () => {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-navy transition-colors"
      >
        <UserIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{signedIn ? "Account" : "Sign In"}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[440px] bg-white border border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* Left column: My Lists + Log out (signed in) or Sign in + Create an account (signed out) */}
            <div className="p-4">
              <h3 className="eyebrow text-gray-400 mb-3">
                {signedIn ? "My Lists" : "Account"}
              </h3>
              {signedIn ? (
                <>
                  <ul className="space-y-1">
                    {LIST_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block px-2 py-1.5 -mx-2 text-sm text-gray-700 hover:text-navy hover:bg-tint transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-2 py-1.5 -mx-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/auth/sign-in"
                      onClick={() => setOpen(false)}
                      className="block px-2 py-1.5 -mx-2 text-sm font-semibold text-navy hover:bg-tint transition-colors"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/sign-up"
                      onClick={() => setOpen(false)}
                      className="block px-2 py-1.5 -mx-2 text-sm text-gray-700 hover:text-navy hover:bg-tint transition-colors"
                    >
                      Create an account
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Account sections */}
            <div className="p-4">
              <h3 className="eyebrow text-gray-400 mb-3">Account</h3>
              <ul className="space-y-1">
                {SIDEBAR_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-1.5 -mx-2 text-sm text-gray-700 hover:text-navy hover:bg-tint transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
