// lib/types.ts – shared domain types (mirrors the web app)

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
  // Optional merchandising fields — not all products have these (real DB rows
  // may not populate them yet); UI should hide brand/SKU chips when absent.
  sku?: string | null;
  brand_code?: string | null;
  brand_name?: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  total_amount: number; // in cents
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number; // in cents
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
