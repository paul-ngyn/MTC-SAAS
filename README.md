# MTC — Maple Trade Corporation Hub

Central distribution hub for restaurant / foodservice supply. Wholesale
catalog with six house and partner brands, tiered case-quantity pricing, and an
MTC+ membership (free freight, deeper tiers, auto-reorder). One web storefront +
a companion Expo mobile app.

## Repo layout — read this first

This repo has exactly two apps, both tracked directly in this repository:

- **`/` (repo root)** — the Next.js webapp (`src/app`, `src/components`, etc.)
- **`mtc-saas-mobile/`** — the Expo / React Native mobile app

**There should never be a folder literally named `mtc-saas` (lowercase) anywhere inside this repo.** That name is deliberately blocked in `.gitignore`. It used to exist as a second, nested git clone of this same repository (GitHub repo names are case-insensitive, so `github.com/paul-ngyn/mtc-saas` and `github.com/paul-ngyn/MTC-SAAS` are the same repo) — a leftover from an accidental `git clone` done from inside this working copy instead of a separate location. Work committed inside that nested clone did **not** sync back to this repo's history correctly, which is why webapp changes went missing once.

**If you ever see a `mtc-saas/` folder appear in your checkout** (e.g. on another computer that hasn't caught up yet): do not edit files inside it. Check `git -C mtc-saas log --oneline -5` and `git -C mtc-saas remote -v` first — if it has commits not present in this repo's history, manually copy/cherry-pick that work into the correct place (`src/` for webapp changes) before deleting the folder. Never `git add` a directory that contains its own `.git` folder into this repo.

## Design system

Both apps share one visual language (navy `#1c51a3` / white, condensed display
type, uppercase eyebrow labels):

- **Web:** brand tokens live in `src/app/globals.css` (`--navy`, `--navy-dark`,
  `--tint`). Display headings use the **Archivo** font via `next/font`
  (`.font-display`), body text uses Inter. Static storefront data (categories,
  brands, featured products) is centralized in **`src/lib/catalog.ts`** and
  reused by the navbar, homepage, and footer.
- **Mobile:** matching tokens in `mtc-saas-mobile/lib/theme.ts`; tiered pricing
  logic in `mtc-saas-mobile/lib/pricing.ts`.

## Getting Started

### Web (repo root)

```bash
npm install
npm run dev          # http://localhost:3000
```

Edit the storefront homepage in `src/app/page.tsx`.

### Mobile (`mtc-saas-mobile/`)

```bash
cd mtc-saas-mobile
npm install
npm start            # scan the QR code with Expo Go
npm test             # jest suite
```

See [`mtc-saas-mobile/README.md`](mtc-saas-mobile/README.md) for the in-depth
mobile guide — architecture, how mobile reaches Stripe through the web app's API
routes, the web/mobile parity matrix, and the prioritized mobile TODO.

> Checkout and membership on mobile POST to the **web app's** `/api/checkout`
> and `/api/subscribe`, so run the web app too when testing those — and point
> `EXPO_PUBLIC_API_URL` at a host the device can actually reach (`localhost`
> won't resolve from a phone).

## Status & roadmap

Design is being aligned to the approved mockups (web hub PDF + mobile
screenshot). Supabase and Stripe wiring is being redone separately — treat the
`.env.local` keys and `src/lib/{supabase,stripe}` clients as scaffolding for now.

### Done

- [x] Web hub homepage (hero, categories, brands, top movers, MTC+ CTA, footer)
- [x] Web catalog page (`/categories`) — sidebar filters (category + brand),
      product grid with per-product tiered pricing, brand deep-links
- [x] Web brands directory (`/brands`)
- [x] Web account section — `/account` is an overview hub (cards linking to
      each section with a teaser stat); one dedicated page per section
      (`/account/orders`, `/account/schedules`, `/account/addresses`,
      `/account/payment`, `/account/tax-exempt`, `/account/users`), all
      sharing a common sidebar layout
- [x] Web product detail page — tiered pricing table, MTC+ member tier row,
      quantity stepper, specifications table
- [x] Web cart merged with checkout into one Cart & Checkout page
- [x] Web membership page restyled to match
- [x] Expo mobile screens (Home / Browse / Product / Cart) polished + demo-data
      fallbacks so they render in Expo Go before Supabase is wired
- [x] Mobile screen-level parity with web — added the Brands directory,
      My Lists (index + detail with add-all-to-cart), Wishlist, and the four
      Account sub-sections (addresses, payment/Net-30, tax-exempt, users),
      all registered as stack screens and linked from the Account tab
- [x] Mobile auth polish — back button on sign-in/sign-up (the auth group runs
      `headerShown: false`, so it's an in-body control) and the real
      multi-color Google mark via `react-native-svg` instead of a blue "G"
- [x] Web/mobile catalog reconciled — the two demo catalogs had drifted (same
      products under different ids: `imp-ir-6`/`im-r6`, `mtc-w18`/`mtc-f18-2k`,
      `mtc-k9-200`/`td-k9-200`, plus `mtc-b500` filed under a different
      category). `mtc-saas-mobile/lib/catalog.ts` now mirrors the web's
      `ALL_PRODUCTS` exactly — same 12 ids, slugs, names, prices, units, and
      categories — so a cart or saved list resolves on either platform
- [x] Free-freight threshold unified at **$500** (the web hub PDF's number, and
      what the web announcement copy already said; the mobile mockup's $250 was
      dropped). Mobile now also itemizes `FLAT_FREIGHT` ($24.99) instead of
      showing "At checkout", so its displayed Total is the real charge.
      Both constants live in each app's `catalog.ts`
- [x] Cart persistence hydration bug fixed (localStorage vs. SSR mismatch)
- [x] Navbar "Account" is now a hover dropdown, auth-adaptive: button reads
      "Sign In" when signed out / "Account" when signed in; left column shows
      Sign in + Create an account (signed out) or My Lists + Log out (signed
      in); right column (Account sections) is unchanged either way
- [x] "My Lists" — named, quantity-aware saved lists for one-click reordering
      (`/lists`, `/lists/[id]`, wired to the real cart)
- [x] "Wishlist" — a flat favorited-products page (`/wishlist`)
- [x] Web test suite added (Jest + React Testing Library) — 72 tests across 10
      suites covering `src/lib/pricing.ts`, the cart store, the Cart &
      Checkout page (including the checkout payload/error handling), the
      Account overview/orders/schedules pages, My Lists (index, creation, and
      detail with add-all-to-cart), Wishlist, and the auth-adaptive
      AccountMenu (both signed-in/out states + sign-out). Run with `npm test`.

### Not yet done

**Content — real catalog data**
- [ ] Generate/import the real product catalog (the ~1,600 SKUs implied by
      the homepage stat) — everything today is ~12 hand-written demo products
      in `src/lib/catalog.ts` / `mtc-saas-mobile/lib/catalog.ts`
- [ ] Real product photography — every photo slot is a placeholder dropzone
      (`public/` has no product images at all yet)
- [ ] Populate the Supabase `categories` / `products` tables from that catalog
      once generated (schema already exists in `supabase/schema.sql`)

**Backend wiring**
- [ ] Confirm the Supabase project is resumed/reachable — it did not respond
      to a REST request during this session (likely paused from inactivity;
      there's already a keep-alive script at `scripts/supabase-keep-alive.js`,
      confirm its scheduled workflow is actually running)
- [ ] Re-wire Supabase auth (sign-in/sign-up already call it — verify end to
      end once the project is reachable) and catalog reads across all pages
      that currently fall back to demo data
- [ ] End-to-end test the Stripe checkout + membership subscribe flow with a
      live (non-paused) Supabase project, since `/api/checkout` and
      `/api/subscribe` both look up live prices/customers there
- [ ] Add new Supabase tables for the Account section's new modules —
      addresses, payment methods/Net-30 terms, tax-exempt certificates, users
      & approval limits, auto-reorder schedules — none of these exist in
      `supabase/schema.sql` yet, only `profiles/categories/products/orders/order_items`

**Design gaps — pages not yet touched by the redesign**
- [ ] `/search` — still the old un-restyled UI (hardcoded hex colors, no
      Archivo/navy tokens) and has no demo-data fallback, so it shows "0
      results" until Supabase is reachable
- [ ] `/auth/sign-in`, `/auth/sign-up` — functional (Google sign-in wired) but
      still old styling
- [ ] `/checkout/success`, `/membership/success` — still old styling

**Functionality — demo buttons that don't do anything yet**
- [ ] Account: "Add a SKU →" (schedules), "+ Add address", "Update" (payment),
      "Upload certificate →", "Invite user →", "Reorder" (order history), and
      the Edit buttons on addresses/schedules are all display-only placeholders
- [ ] Catalog/Brands: nothing missing here — Add-to-cart and brand filters are
      fully wired to real state

**Mobile parity** — see [`mtc-saas-mobile/README.md`](mtc-saas-mobile/README.md)
for the in-depth mobile guide (architecture, parity matrix, full TODO). The
screen-level gap is now closed; what remains:

- [ ] **Pricing engines have diverged and will produce different prices.**
      `src/lib/pricing.ts` accepts an optional `customBreaks?: TierBreak[]` on
      every function (so a product can override the default 1-9/10-49/50+
      schedule via `product.tierBreaks`) and exposes `getMemberPrice()`.
      `mtc-saas-mobile/lib/pricing.ts` has neither. Nothing breaks today only
      because no demo product sets `tierBreaks` — the moment real catalog data
      carries per-product tiers, the same SKU costs a different amount on each
      platform. Port `customBreaks` + `getMemberPrice()` to mobile and add the
      MTC+ member-price row to the mobile product page
- [ ] `search.tsx` and `orders.tsx` are the only mobile screens without a
      demo-data fallback, so they show empty until Supabase is reachable
- [ ] Mobile Brands "Shop {CODE} →" routes to the generic category grid; web
      deep-links to `/categories?brand=CODE`. Needs a brand param on the mobile
      catalog route
- [ ] Mobile-only opportunities not started: push notifications (order shipped,
      schedule due), pull-to-refresh, offline handling

**"My Lists" / Wishlist follow-ups**
- [ ] Created lists (via "+ Create new list") only live in component state —
      they vanish on refresh; same for wishlist removals. Needs real
      persistence (Supabase table) once the backend is wired
- [ ] Wishlist has no "add to wishlist" entry point yet (no heart icon on
      product cards/detail pages) — only removal from `/wishlist` itself works

### Guest browsing (temporary)

While Supabase is being wired up, the mobile storefront (Home / Browse /
Product / Cart) is browsable **without** signing in — matching the public web
hub. Sign-in is only required for the Account tab and checkout. See
`mtc-saas-mobile/app/_layout.tsx`; when auth is ready, decide whether to keep
guest browsing or restore a login requirement.

## Environment

Each app reads its own `.env.local` (Supabase URL/anon key + Stripe price IDs).
These are per-developer and git-ignored — never commit them.
