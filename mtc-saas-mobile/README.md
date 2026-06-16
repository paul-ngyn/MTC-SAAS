# MTC Supply Hub – Mobile App

React Native companion app built with **Expo Router** (SDK 53). Shares the same Supabase project and Stripe account as the Next.js web app.

## Structure

```
mtc-saas-mobile/
├── app/
│   ├── _layout.tsx          # Root layout + session guard
│   ├── (auth)/              # Sign-in / Sign-up (unprotected)
│   ├── (tabs)/              # Bottom tab navigator
│   │   ├── index.tsx        # Home
│   │   ├── categories.tsx   # All categories
│   │   ├── search.tsx       # Product search
│   │   ├── cart.tsx         # Shopping cart + checkout
│   │   └── account.tsx      # Profile + membership
│   ├── categories/[slug].tsx  # Products in a category
│   ├── products/[slug].tsx    # Product detail
│   └── membership.tsx         # Membership plans
├── components/
│   ├── ProductCard.tsx
│   └── CategoryCard.tsx
└── lib/
    ├── supabase.ts          # Supabase client
    ├── cart-store.ts        # Zustand cart (AsyncStorage)
    └── types.ts             # Shared domain types
```

## Setup

1. **Assets** — Add the following to `assets/`:
   - `icon.png` (1024×1024)
   - `splash-icon.png` (200×200, transparent background)
   - `adaptive-icon.png` (1024×1024, Android adaptive icon foreground)
   - `favicon.png` (48×48, web)

   Or run `npx expo install expo-asset` and replace with your brand logo.

2. **Environment** — `.env` is pre-filled with the Supabase + Stripe keys from the web app. Update `EXPO_PUBLIC_API_URL` to your deployed web app URL in production:

   ```
   EXPO_PUBLIC_API_URL=https://your-deployed-site.com
   ```

   Add Stripe Price IDs for membership if you want in-app subscriptions:
   ```
   EXPO_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY=price_...
   EXPO_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
   EXPO_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
   ```

3. **Install** (already done):
   ```bash
   npm install
   ```

## Development

```bash
# Start Expo dev server
npx expo start

# Scan the QR code with the Expo Go app on your phone
# Or press 'i' for iOS simulator / 'a' for Android emulator
```

## Checkout flow

Cart checkout calls the web app's `/api/checkout` endpoint (which creates a Stripe-hosted checkout session), then opens the URL in the device browser. When the user finishes, they return to the app.

## Production build (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform all
```
