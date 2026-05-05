// src/app/auth/sign-in/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckIcon } from "@heroicons/react/24/solid";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "basic",
    name: "Starter",
    description: "Perfect for small operations just getting started.",
    monthly: 4900,
    yearly: 47000,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY ?? "",
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY ?? "",
    features: [
      "Access to all product categories",
      "Standard wholesale pricing",
      "Up to 10 orders / month",
      "Email support",
    ],
    highlighted: false,
    badge: null as string | null,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing restaurants and foodservice operators.",
    monthly: 9900,
    yearly: 95000,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "",
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? "",
    features: [
      "Everything in Starter",
      "Pro wholesale pricing (5–15% off)",
      "Unlimited orders / month",
      "Priority email + phone support",
      "Early access to new products",
      "Bulk order discounts",
    ],
    highlighted: true,
    badge: "Most Popular" as string | null,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom pricing for large chains and distributors.",
    monthly: 24900,
    yearly: 239000,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY ?? "",
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY ?? "",
    features: [
      "Everything in Pro",
      "Enterprise pricing (15–30% off)",
      "Dedicated account manager",
      "Custom invoicing & NET-30 terms",
      "API access for ERP integration",
      "White-glove onboarding",
    ],
    highlighted: false,
    badge: null as string | null,
  },
];

export default function SignInPage() {
  const router = useRouter();

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Membership state
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [subLoading, setSubLoading] = useState<string | null>(null);
  const [subError, setSubError] = useState<string | null>(null);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleSubscribe = async (plan: (typeof PLANS)[number]) => {
    setSubLoading(plan.id);
    setSubError(null);
    const priceId = billing === "monthly" ? plan.priceIdMonthly : plan.priceIdYearly;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to start subscription.");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      setSubError(err instanceof Error ? err.message : "Unexpected error.");
      setSubLoading(null);
    }
  };

  return (
    <div>
      {/* ── Sign In ──────────────────────────────────────────── */}
      <div className="py-16 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-extrabold text-[#1c51a3]">MTC Supply Hub</Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Sign in to your account</h1>
            <p className="text-gray-500 mt-1">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-[#1c51a3] font-semibold hover:underline">Sign up</Link>
            </p>
          </div>

          <form onSubmit={handleSignIn} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2561bb] text-gray-900"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#1c51a3] hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2561bb] text-gray-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#1c51a3] text-white font-bold rounded-lg hover:bg-[#163d7d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-500 px-2">Or start with a membership plan</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* ── Membership Plans ─────────────────────────────────── */}
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Membership Plans</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Join MTC Supply Hub and unlock wholesale pricing, bulk discounts, and priority access — built for restaurant supply professionals.
          </p>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mt-6">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                billing === "monthly" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                billing === "yearly" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className="ml-1.5 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {subError && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">{subError}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 flex flex-col ${
                plan.highlighted ? "border-[#2561bb] shadow-xl shadow-[#d4e2f5]" : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1c51a3] text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(billing === "monthly" ? plan.monthly : plan.yearly)}
                  </span>
                  <span className="text-gray-400 ml-1 text-sm">/ {billing === "monthly" ? "month" : "year"}</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckIcon className="w-5 h-5 text-[#2561bb] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={!!subLoading}
                className={`w-full py-3 rounded-xl font-bold text-base transition-colors ${
                  plan.highlighted
                    ? "bg-[#1c51a3] text-white hover:bg-[#163d7d]"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {subLoading === plan.id ? "Redirecting…" : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          {[
            { q: "Can I cancel at any time?", a: "Yes. You can cancel your membership at any time from your account dashboard. You will retain access until the end of your billing period." },
            { q: "Do I need a membership to place an order?", a: "No — you can browse and purchase without a membership. A membership unlocks discounted pricing, bulk order benefits, and priority support." },
            { q: "How do I upgrade or downgrade my plan?", a: "You can change your plan at any time from the billing section of your account. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
            { q: "Is there a free trial?", a: "We offer a 14-day free trial on the Pro plan for new members — no credit card required." },
          ].map(({ q, a }) => (
            <details key={q} className="group border-b border-gray-200 py-5">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 list-none">
                {q}
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
