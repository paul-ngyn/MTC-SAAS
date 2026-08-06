# MTC Supply Hub — Mobile App

React Native companion app built with **Expo Router** (SDK 54). Shares the same
Supabase project and the same Stripe account as the Next.js web app at the repo
root.

This README is the in-depth guide for the mobile side: how it fits together, how
it talks to the web app, what's built, and what's left. For the whole-product
picture (web + mobile) see the [root README](../README.md).

---

## How mobile relates to the web app

The two apps are peers that share a backend, not a client and a server:

```
                    ┌──────────────────────┐
                    │  Supabase (shared)   │
                    │  auth · catalog ·    │
                    │  orders · profiles   │
                    └──────────┬───────────┘
                       ▲               ▲
          direct reads │               │ direct reads
          (anon key)   │               │ (anon key)
                       │               │
      ┌────────────────┴───┐     ┌─────┴──────────────┐
      │   Web (Next.js)    │     │  Mobile (Expo)     │
      │   repo root        │     │  mtc-saas-mobile/  │
      └────────┬───────────┘     └─────┬──────────────┘
               │                       │
               │  /api/checkout        │  HTTPS POST to the *web app's*
               │  /api/subscribe       │  API routes (EXPO_PUBLIC_API_URL)
               │  /api/webhooks/stripe │
               ▼                       │
      ┌────────────────────┐           │
      │ Stripe (secret key │◀──────────┘
      │ lives here only)   │
      └────────────────────┘
```

Two consequences that drive most of the design:

1. **Mobile reads Supabase directly** with the anon key, exactly like the web
   app does — same tables, same RLS.
2. **Mobile never talks to Stripe directly.** It POSTs to the web app's
   `/api/checkout` and `/api/subscribe` routes and opens the returned
   Stripe-hosted Checkout URL in the device browser. The Stripe secret key and
   webhook secret stay server-side in the web app and are never bundled into the
   mobile binary. See [Payments](#payments-how-mobile-checkout-works).

---

## Project structure

```
mtc-saas-mobile/
├── app/
│   ├── _layout.tsx              # Root layout: session tracking + stack registration
│   ├── (auth)/                  # Unprotected auth group (no tab bar)
│   │   ├── sign-in.tsx          #   email/password + Google, in-body back button
│   │   └── sign-up.tsx
│   ├── (tabs)/                  # Bottom tab navigator
│   │   ├── index.tsx            #   Home — search, MTC+ banner, categories, reorder
│   │   ├── categories.tsx       #   Browse — category grid              [tab]
│   │   ├── orders.tsx           #   Order history                       [tab]
│   │   ├── account.tsx          #   Profile, MTC+ status, schedules,    [tab]
│   │   │                        #   + link rows into everything below
│   │   ├── search.tsx           #   Product search      (routable, href: null)
│   │   └── cart.tsx             #   Cart + checkout     (routable, href: null)
│   ├── categories/[slug].tsx    # Products in a category, brand/stock/sort chips
│   ├── products/[slug].tsx      # Product detail with tiered pricing table
│   ├── brands.tsx               # Brands directory
│   ├── lists/
│   │   ├── index.tsx            # My Lists — saved lists for one-click reorder
│   │   └── [id].tsx             # List detail + add-all-to-cart
│   ├── wishlist.tsx             # Favorited products
│   ├── account/                 # Business-account sub-sections
│   │   ├── addresses.tsx
│   │   ├── payment.tsx          #   Net-30 terms + card on file
│   │   ├── tax-exempt.tsx
│   │   └── users.tsx            #   Users & approval limits
│   └── membership.tsx           # MTC+ plans + Stripe subscribe
├── components/
│   ├── ProductRow.tsx           # Horizontal product list item
│   ├── CategoryCard.tsx
│   ├── StatusChip.tsx           # Verified / Pending / Active / Invited badge
│   ├── GoogleSignInButton.tsx   # Official multi-color Google mark (react-native-svg)
│   └── HeaderBackButton.tsx     # Back that falls back to Home when stack is empty
└── lib/
    ├── supabase.ts              # Supabase client
    ├── google-auth.ts           # Google OAuth via expo-web-browser
    ├── catalog.ts               # Demo categories / products / BRANDS
    ├── cart-store.ts            # Zustand cart, persisted to AsyncStorage
    ├── reorder-store.ts         # Persisted auto-reorder schedules
    ├── lists.ts                 # Demo saved lists
    ├── wishlist.ts              # Demo favorited product ids
    ├── account-data.ts          # Demo addresses / Net-30 / certs / users
    ├── pricing.ts               # Tiered wholesale pricing
    ├── theme.ts                 # Shared design tokens (navy #1c51a3, etc.)
    └── types.ts                 # Shared domain types
```

Only four tabs are visible (Home / Browse / Orders / Account). `search` and
`cart` live inside `(tabs)/` but are hidden from the bar via `href: null` — they
are pushed as routes instead. Everything under `app/account/`, `app/lists/`,
plus `brands` and `wishlist`, is registered as a stack screen in
`app/_layout.tsx`; **a new screen won't get a header or a working back button
until you add it there.**

---

## Setup

### 1. Assets

Add to `assets/`:

- `icon.png` (1024×1024)
- `splash-icon.png` (200×200, transparent background)
- `adaptive-icon.png` (1024×1024, Android adaptive-icon foreground)
- `favicon.png` (48×48, web)

### 2. Environment

`.env` is git-ignored and pre-filled with the Supabase + Stripe *public* keys.

**Safe to put here** (everything prefixed `EXPO_PUBLIC_` is compiled into the
app binary and readable by anyone who downloads it):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...      # publishable = public, fine
EXPO_PUBLIC_API_URL=https://your-deployed-site.com  # the web app's origin

# Membership price IDs — identifiers, not secrets. Must match the
# NEXT_PUBLIC_STRIPE_PRICE_* values in the web app's .env.local.
EXPO_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY=price_...
EXPO_PUBLIC_STRIPE_PRICE_BASIC_YEARLY=price_...
EXPO_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
EXPO_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_...
EXPO_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
EXPO_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=price_...
```

> **Never put `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or
> `SUPABASE_SERVICE_ROLE_KEY` in this file.** There is no server here to use
> them — the mobile app never calls Stripe directly and never receives a
> webhook. Anything in this file ships to every device that installs the app.
> Those three belong only in the web app's `.env.local`.

**`EXPO_PUBLIC_API_URL` must be reachable *from the device*.** `localhost:3000`
only resolves when running Expo web on the same machine as the Next.js dev
server:

| Target                | Value                                          |
| --------------------- | ---------------------------------------------- |
| Expo web, same machine| `http://localhost:3000`                        |
| Physical phone (LAN)  | `http://192.168.x.x:3000` (find via `ipconfig`)|
| Android emulator      | `http://10.0.2.2:3000`                         |
| Production            | `https://your-deployed-site.com`               |

### 3. Install and run

```bash
npm install
npx expo start          # scan the QR with Expo Go, or press i / a
npx expo start -c       # same, but clears the Metro cache (use after dep changes)
npm test                # Jest — 58 tests across 8 suites
npx tsc --noEmit        # type check
```

For anything that hits checkout or membership, run the web app at the repo root
(`npm run dev`) at the same time.

---

## Two patterns worth knowing before you edit

### Demo-data fallback

Supabase is still being wired up, so most screens **seed synchronously from
`lib/catalog.ts` and only override if a live query returns rows**:

```ts
const [products, setProducts] = useState(() => getDemoProductsForCategory(slug));
// ...then, in an effect: if (data && data.length > 0) { setProducts(data); setIsLive(true); }
```

This is why the app renders instantly in Expo Go with no backend. Keep the
pattern when adding screens — a screen that only reads Supabase shows an empty
state until the project is reachable. `search.tsx` and `orders.tsx` currently
*lack* this fallback (see the TODO below).

### Demo data is duplicated, not shared — keep it in sync by hand

`mtc-saas-mobile/lib/catalog.ts` is a hand-maintained copy of
`src/lib/catalog.ts`. **The web app is the source of truth**; mirror any change
there into the mobile file.

The two are currently aligned: the same 12 products, with identical ids, slugs,
names, prices, units, and category assignments, plus the same
`FREE_FREIGHT_THRESHOLD` ($500) and `FLAT_FREIGHT` ($24.99).

They *had* drifted (`imp-ir-6`/`im-r6`, `mtc-w18`/`mtc-f18-2k`,
`mtc-k9-200`/`td-k9-200`, and `mtc-b500` under a different category), which is
why this matters: a cart, saved list, or reorder schedule created on one
platform has to resolve on the other, and once the real catalog is imported both
apps read the same Supabase rows by id. Anything referencing a product id —
`lib/lists.ts`, `lib/wishlist.ts`, `REORDER_CANDIDATES` in the Account tab, the
Home screen's reorder shortcuts — has to move with it.

The web catalog also carries fields mobile's `Product` type doesn't have yet
(`bulk_price`, `tierBreaks`, `specs`, `shipsInDays`); see the pricing item in
[What's next](#1-pricing-correctness--the-one-real-divergence).

---

## Payments: how mobile checkout works

**Cart checkout**

1. `(tabs)/cart.tsx` POSTs the cart to `${EXPO_PUBLIC_API_URL}/api/checkout`.
2. The **web app** (holding `STRIPE_SECRET_KEY`) creates a Stripe Checkout
   session and returns its URL.
3. Mobile opens that URL with `expo-web-browser`; the user pays in the browser.
4. On dismiss, the app asks whether to clear the cart.
5. Stripe fires `checkout.session.completed` at the **web app's**
   `/api/webhooks/stripe`, which verifies the signature with
   `STRIPE_WEBHOOK_SECRET` and writes to Supabase.

**Membership subscribe** — same shape, via `/api/subscribe`, using the
`EXPO_PUBLIC_STRIPE_PRICE_*` id for the selected plan and billing cycle.

The mobile app is out of the loop from step 3 onward. That is why it needs no
Stripe secret and no webhook secret: Stripe only ever POSTs to the one endpoint
URL registered in the Stripe Dashboard, which is the web app's.

---

## Parity with the web app

| Web                             | Mobile                              | State |
| ------------------------------- | ----------------------------------- | ----- |
| `/` homepage                    | `(tabs)/index.tsx`                  | ✅ |
| `/categories` catalog           | `(tabs)/categories.tsx` + `categories/[slug].tsx` | ⚠️ split into grid → per-category list; web filters category **and** brand in one view |
| `/products/[slug]`              | `products/[slug].tsx`               | ⚠️ no MTC+ member-price row |
| `/cart` (Cart & Checkout)       | `(tabs)/cart.tsx`                   | ⚠️ no business/email/address fields |
| `/brands`                       | `brands.tsx`                        | ✅ |
| `/lists`, `/lists/[id]`         | `lists/index.tsx`, `lists/[id].tsx` | ✅ |
| `/wishlist`                     | `wishlist.tsx`                      | ✅ |
| `/account` overview             | `(tabs)/account.tsx`                | ✅ different shape (profile + inline schedules + link rows) |
| `/account/orders`               | `(tabs)/orders.tsx`                 | ⚠️ no demo fallback |
| `/account/schedules`            | inline in the Account tab           | ✅ |
| `/account/addresses`            | `account/addresses.tsx`             | ✅ display-only (as on web) |
| `/account/payment`              | `account/payment.tsx`               | ✅ display-only (as on web) |
| `/account/tax-exempt`           | `account/tax-exempt.tsx`            | ✅ display-only (as on web) |
| `/account/users`                | `account/users.tsx`                 | ✅ display-only (as on web) |
| `/membership`                   | `membership.tsx`                    | ✅ |
| `/search`                       | `(tabs)/search.tsx`                 | ⚠️ no demo fallback |
| `/auth/sign-in`, `/auth/sign-up`| `(auth)/`                           | ✅ mobile is ahead — already restyled |
| `/checkout/success`, `/membership/success` | —                        | n/a — handled in the device browser |

---

## What's next

Ordered by what will bite you first.

### 1. Pricing correctness — the one real divergence

`src/lib/pricing.ts` and `mtc-saas-mobile/lib/pricing.ts` are **not** the same
engine, and the difference is not cosmetic:

- Web takes an optional `customBreaks?: TierBreak[]` on every function, so a
  product can override the default 1-9 / 10-49 / 50+ schedule via
  `product.tierBreaks`. Mobile has no such parameter and always applies the
  default.
- Web has `getMemberPrice()` (used on the product page for the MTC+ row).
  Mobile has no equivalent.

Today nothing breaks, because no demo product actually sets `tierBreaks`. The
moment one does — or the moment real catalog data carries per-product tiers —
**the same product quietly costs a different amount on mobile than on web.**

- [ ] Port `TierBreak` + the `customBreaks` parameter and `getMemberPrice()` into
      `mtc-saas-mobile/lib/pricing.ts`
- [ ] Add `tierBreaks?: TierBreak[]` to the mobile `Product` type
      (`lib/types.ts`) and thread it through `ProductRow`, `cart.tsx`,
      `products/[slug].tsx`, and `lists/[id].tsx`
- [ ] Add the MTC+ member-price row to the mobile product detail page

### 2. Finish the Stripe setup

- [ ] Confirm no `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` lines are in
      `mtc-saas-mobile/.env` (they belong only in the web app's `.env.local`)
- [ ] Create the 6 membership prices in the Stripe Dashboard
      (Basic / Pro / Enterprise × monthly / yearly) and paste the same
      `price_...` ids into **both** `.env.local` (`NEXT_PUBLIC_STRIPE_PRICE_*`)
      and `.env` (`EXPO_PUBLIC_STRIPE_PRICE_*`). Until then, subscribing shows
      "This plan is not yet configured."
- [ ] Point `EXPO_PUBLIC_API_URL` at something the device can reach (see the
      table in [Setup](#2-environment))
- [ ] Verify the Stripe Dashboard webhook endpoint targets the deployed **web**
      app's `/api/webhooks/stripe`; for local testing run
      `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] End-to-end test both flows from a physical device with a live Supabase
      project: cart → Stripe → `orders` row written; subscribe → Stripe →
      `profiles.membership_tier` updated

### 3. Backend wiring

- [ ] Confirm the Supabase project is resumed and reachable (it has been pausing
      from inactivity; there's a keep-alive at `scripts/supabase-keep-alive.js`
      — check its workflow actually runs)
- [ ] Verify sign-in / sign-up / Google OAuth end-to-end on a device. The OAuth
      redirect is the part most likely to need work — confirm the deep-link
      scheme in `app.json` is registered as an allowed redirect URL in the
      Supabase dashboard
- [ ] Import the real catalog into Supabase, then delete the demo fallbacks (or
      keep them behind a dev flag) — see the id-drift warning above
- [ ] Add demo-data fallbacks to `search.tsx` and `orders.tsx`, or accept that
      they stay empty until the backend is live
- [ ] Add the Supabase tables the Account sub-sections need — addresses,
      payment methods / Net-30 terms, tax-exempt certificates, users &
      approval limits, auto-reorder schedules. None exist in
      `supabase/schema.sql` yet (only `profiles`, `categories`, `products`,
      `orders`, `order_items`), which is why all four screens are display-only
      on both platforms
- [ ] Persist My Lists and Wishlist. Both are component state today, so a
      created list or a removed favorite vanishes on reload — on web too

### 4. Features still missing on mobile

- [ ] No "add to wishlist" entry point — there's no heart on `ProductRow` or the
      product detail screen, so `wishlist.tsx` can only ever remove. (Web has
      the same gap.)
- [ ] Account sub-screen buttons are placeholders: "+ Add address", "Edit",
      "Update" (payment), "Upload certificate →", "Invite user →"
- [ ] Order history has no "Reorder" action
- [ ] Brands screen's "Shop {CODE} →" routes to the generic category grid
      rather than a brand-filtered list — web deep-links to
      `/categories?brand=CODE`. Needs a brand param on the mobile catalog route
- [ ] No push notifications (order shipped, schedule due, Net-30 statement) —
      the most obvious mobile-only win once orders are real
- [ ] No offline handling: with no network and no Supabase, screens fall back to
      demo data silently, which is misleading in production

### 5. Polish and native concerns

- [ ] Pull-to-refresh on Home / Browse / Orders
- [ ] Skeleton loaders instead of a bare `ActivityIndicator`
- [ ] Empty and error states audited per screen (several only handle "empty")
- [ ] Accessibility pass — hit targets, `accessibilityLabel` on icon-only
      buttons, dynamic-type behavior
- [ ] Test on a small device (iPhone SE) — the Account tab and cart summary are
      dense
- [ ] Expand the Jest suite to the new screens (brands, lists, wishlist, the
      four account sub-screens) — currently 58 tests covering pricing, both
      stores, `CategoryCard`, `ProductRow`, and the home/cart/account screens

### 6. Shipping

- [ ] Replace placeholder assets with real brand artwork
- [ ] Set bundle identifiers, version, and build numbers in `app.json`
- [ ] `eas build --profile preview` for internal distribution first
- [ ] App Store / Play Store listings, privacy policy, and data-safety
      disclosures (the app collects email + order history)

```bash
npm install -g eas-cli
eas login
eas build --platform all
```

---

## Known environment gotchas

- **`Cannot find module 'babel-preset-expo'`** — it resolves only inside
  `node_modules/expo/node_modules/`. It's pinned as a top-level devDependency
  to keep Metro and Jest working; don't remove it.
- **Stale Metro cache after installing a dependency** — symptoms are phantom
  "unable to resolve module" errors for packages that are clearly installed.
  Fix with `npx expo start -c`.
- **`npx expo install <pkg>` may error with `Cannot find module
  './utils/autoAddConfigPlugins.js'`** on this Expo version. The package still
  installs correctly; the failing step only auto-adds config plugins, which
  matters for native modules — verify `app.json` manually in that case.
