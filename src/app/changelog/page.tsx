// src/app/changelog/page.tsx
type Entry = {
  date: string;
  title: string;
  items: string[];
};

const CHANGELOG: Entry[] = [
  {
    date: "2026-08-04",
    title: "Google Sign-In, Stripe webhook wiring, mobile repo fix",
    items: [
      "Added \"Continue with Google\" sign-in/sign-up on both the web app and the mobile app.",
      "Web: new /auth/callback route exchanges the OAuth code for a session.",
      "Mobile: Google sign-in opens an in-app browser session and links back into the app via the mtcsupply:// deep link.",
      "Wired up the missing STRIPE_WEBHOOK_SECRET so local Stripe events (checkout completion, subscription cancellation) verify and reach the app.",
      "Removed a stray, broken mobile/ folder (leftover node_modules with no app code) that was sitting alongside the real mtc-saas-mobile app.",
      "Restored mtc-saas-mobile after an earlier commit had accidentally deleted it from the repo — merged with origin and recovered all 40+ files.",
    ],
  },
  {
    date: "2026-07-23",
    title: "Design update",
    items: ["Storefront and mobile design refresh; removed some duplicated assets."],
  },
  {
    date: "2026-07-21",
    title: "Mobile + web fixes",
    items: ["General bug fixes across the mobile app and web storefront."],
  },
  {
    date: "2026-07-20",
    title: "Checkout hardening, background jobs, redesign",
    items: [
      "Hardened checkout/subscribe/webhook routes: prices are now validated server-side instead of trusting client input, /api/subscribe requires an authenticated user, and the webhook writes through an admin (service-role) Supabase client.",
      "Added a Supabase keep-alive script and scheduled workflow to prevent the free-tier project from pausing due to inactivity.",
      "Redesigned the web storefront and mobile app screens.",
      "Cleaned up a duplicated nested repo that had been accidentally tracked inside this one.",
    ],
  },
  {
    date: "2026-06-16",
    title: "Mobile app buildout",
    items: ["Early mobile app screens and package-lock reconciliation."],
  },
  {
    date: "2026-05-05",
    title: "Stripe proxy",
    items: ["Initial Stripe integration work and fixes."],
  },
  {
    date: "2026-04-30",
    title: "Initial launch",
    items: ["Initial storefront styling and first commit from Create Next App."],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <div className="eyebrow text-navy">MTC Supply Hub</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-gray-900">Changelog</h1>
        <p className="mt-3 text-gray-500">
          A running log of notable changes to the site and mobile app.
        </p>
      </div>

      <div className="space-y-10">
        {CHANGELOG.map((entry) => (
          <div key={entry.date} className="border-l-2 border-gray-200 pl-6 relative">
            <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-navy" />
            <time className="text-xs font-bold tracking-wide uppercase text-gray-400">
              {entry.date}
            </time>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{entry.title}</h2>
            <ul className="mt-3 space-y-2">
              {entry.items.map((item) => (
                <li key={item} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-navy">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
