// src/lib/types.ts – shared domain types used across the app

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number; // in cents
  image_url: string | null;
  category_id: string;
  stock: number;
  unit: string; // e.g. "case", "each", "lb"
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type MembershipTier = {
  id: string;
  name: string;
  description: string;
  price_monthly: number; // in cents
  price_yearly: number;  // in cents
  stripe_price_id_monthly: string;
  stripe_price_id_yearly: string;
  features: string[];
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  membership_tier: string | null;
  stripe_customer_id: string | null;
};
