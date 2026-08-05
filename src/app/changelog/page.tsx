// src/app/changelog/page.tsx
type Entry = {
  date: string;
  title: string;
  items: string[];
};

const CHANGELOG: Entry[] = [
  {
    date: "2026-08-05",
    title: "Storefront redesign: catalog, brands, account, cart & checkout",
    items: [
      "Rebuilt /categories into an \"All Products\" catalog with a sidebar (category list + counts, brand checkboxes, MTC+ tier-pricing promo) and a filterable product grid; /categories/[slug] now shares the same shell, pre-filtered.",
      "Added a new /brands directory page (house vs. partner badges, SKU counts, \"Shop X →\" deep links into the catalog's brand filter).",
      "Added a new /account page: company header, spend/savings/auto-reorder stats, order history table, and auto-reorder schedule cards with a working \"Skip next\".",
      "Merged /checkout into /cart as a single Cart & Checkout page (item table with per-line tier hints, order summary, free-freight nudge, and a checkout form) — /checkout now redirects to /cart.",
      "Redesigned the product detail page: photo + 4 thumbnail dropzones, tiered pricing table with an added MTC+ member tier row, and a specifications table.",
      "Extended the shared catalog/pricing library: brand directory data, a 12-SKU demo catalog, custom per-product pricing tiers for equipment (vs. case-quantity tiers for consumables), ship-time labels, and demo order/schedule data.",
      "Fixed a real bug: Next.js 16 on this project never resolves <Suspense> boundaries around a client component that calls useSearchParams() — it hangs forever showing the fallback (or nothing, with no fallback). Replaced useSearchParams() with a plain window.location.search read and dropped the unnecessary Suspense wrapper.",
      "Fixed a timezone off-by-one in the Account page's order dates, then a follow-up hydration mismatch from the fix itself (new Date(y,m,d) + toLocaleDateString is timezone-sensitive, so the server and client could render different text) — replaced with a manual, timezone-independent date formatter.",
      "Simplified the top nav to Catalog / Brands / MTC+ Membership now that category browsing lives in the catalog page's sidebar; pointed the Account link at /account instead of sign-in.",
      "Filled out the remaining Account sections (Addresses, Payment & Net-30 terms, Tax-exempt certificates, Users & approvals) with the same visual language as Order History.",
      "Fixed a latent cart-badge/cart-page hydration bug: the cart persists to localStorage, which the server can't see, so it always renders an empty cart while the client can rehydrate a real one — a structural (Navbar badge text) and tree-shape (Cart page's empty vs. populated state) mismatch. Root cause: zustand's persist middleware rehydrates synchronously at module load for localStorage, so a naive \"hasHydrated\" flag was already true on the very first client render. Fixed properly with skipHydration + an explicit rehydrate() from a mount-only effect (new CartHydration component in the root layout).",
      "Split /account into one route per tab (/account/orders, /account/schedules, /account/addresses, /account/payment, /account/tax-exempt, /account/users) sharing a layout.tsx sidebar, instead of one long scrolling page — each section's cards/tables now get more room (bigger stat numbers, 2-column instead of 3-column card grids, roomier table padding). Sidebar highlights the active tab via usePathname.",
      "Made /account itself an overview/hub page — a grid of cards (one per section, with a teaser stat like \"6 orders in the last 90 days\" or \"3 active schedules\") linking out to each dedicated page, instead of defaulting straight into Order History content. Order History moved to /account/orders; the sidebar gained an \"Overview\" link back to the hub.",
      "Evaluated the app end-to-end and added a detailed \"Not yet done\" checklist to the README: real catalog data + product photography, Supabase reachability (the project didn't respond to a REST call this session), new tables needed for the Account section's data, remaining unstyled pages (/search, auth, success pages), and the still-decorative Account buttons.",
      "Turned the Navbar's Account link into a hover dropdown split into two columns: My Lists (Create a list, My list, Wishlist) on the left, the Account sections on the right.",
      "Added \"My Lists\" — named, quantity-aware saved product lists for one-click reordering. New /lists (index + inline create-list form) and /lists/[id] (editable item table with an \"Add all to cart\" bulk action, wired to the real cart store).",
      "Added a separate /wishlist — a flat set of favorited products (no quantities), reusing the catalog's product card with a remove-from-wishlist heart button.",
      "Set up a web test suite (Jest + React Testing Library, matching mobile's setup) — 65 tests across 9 suites covering pricing.ts, the cart store, the Cart & Checkout page's cart math, freight logic, and checkout payload/error handling, the Account overview/orders/schedules pages, My Lists (creation, editing, add-all-to-cart), and Wishlist. Also fixed a Stripe API-version type error that had resurfaced from a dependency update. `npm test` / `npm run test:watch` / `npm run test:coverage`.",
    ],
  },
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
