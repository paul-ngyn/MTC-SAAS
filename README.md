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

## Status & roadmap

Design is being aligned to the approved mockups (web hub PDF + mobile
screenshot). Supabase and Stripe wiring is being redone separately — treat the
`.env.local` keys and `src/lib/{supabase,stripe}` clients as scaffolding for now.

- [x] Web hub homepage rebuilt to match the design (hero, categories, brands,
      top movers, MTC+ CTA, footer)
- [x] Web product detail page — tiered pricing table + quantity stepper
- [x] Web categories, cart, and membership pages restyled to match
- [x] Expo mobile screens (Home / Browse / Product / Cart) polished + demo-data
      fallbacks so they render in Expo Go before Supabase is wired
- [ ] Re-wire Supabase (auth + catalog) and Stripe (checkout + membership)

### Guest browsing (temporary)

While Supabase is being wired up, the mobile storefront (Home / Browse /
Product / Cart) is browsable **without** signing in — matching the public web
hub. Sign-in is only required for the Account tab and checkout. See
`mtc-saas-mobile/app/_layout.tsx`; when auth is ready, decide whether to keep
guest browsing or restore a login requirement.

> **Note:** the free-freight threshold differs between the two mockups — the web
> hub PDF says **$500**, the mobile screenshot banner says **$250**. The code
> currently follows each design (web `$500`, mobile `$250`); unify once decided.

## Environment

Each app reads its own `.env.local` (Supabase URL/anon key + Stripe price IDs).
These are per-developer and git-ignored — never commit them.
