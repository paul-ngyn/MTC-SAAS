-- ============================================================
-- MTC Supply Hub – Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension (already on by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with business-specific fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL,
  full_name         TEXT,
  company_name      TEXT,
  membership_tier   TEXT CHECK (membership_tier IN ('basic', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Categories ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  price       INTEGER NOT NULL,       -- in cents (USD)
  image_url   TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  stock       INTEGER NOT NULL DEFAULT 0,
  unit        TEXT NOT NULL DEFAULT 'each',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_session_id    TEXT UNIQUE,
  total_amount         INTEGER NOT NULL,  -- in cents
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Order Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id),
  quantity    INTEGER NOT NULL,
  unit_price  INTEGER NOT NULL  -- in cents, snapshot at time of purchase
);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "profiles: own read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: own update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Products: publicly readable
CREATE POLICY "categories: public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "products: public read" ON public.products FOR SELECT USING (true);

-- Orders: users can see their own orders
CREATE POLICY "orders: own read" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "order_items: own read" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- ── Seed Data ─────────────────────────────────────────────────────────────────
INSERT INTO public.categories (name, slug, description) VALUES
  ('Kitchen Equipment', 'kitchen-equipment', 'Commercial cooking equipment for professional kitchens.'),
  ('Disposables', 'disposables', 'Single-use packaging, containers, and serviceware.'),
  ('Smallwares', 'smallwares', 'Knives, utensils, prep tools, and more.'),
  ('Refrigeration', 'refrigeration', 'Reach-in coolers, walk-ins, and refrigerated display cases.'),
  ('Cleaning Supplies', 'cleaning-supplies', 'Chemicals, mops, brushes, and sanitation equipment.'),
  ('Food Storage', 'food-storage', 'Containers, shelving, and food storage solutions.')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products for each category
INSERT INTO public.products (name, slug, description, price, category_id, stock, unit)
SELECT
  'Commercial 6-Burner Range', 'commercial-6-burner-range',
  'Heavy-duty stainless steel 6-burner gas range with convection oven.',
  289900,
  id, 15, 'each'
FROM public.categories WHERE slug = 'kitchen-equipment'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, category_id, stock, unit)
SELECT
  'White 9" Foam Plates (500-pack)', 'white-9-foam-plates-500',
  'Lightweight and sturdy disposable foam plates, perfect for to-go orders.',
  2899,
  id, 200, 'case'
FROM public.categories WHERE slug = 'disposables'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, category_id, stock, unit)
SELECT
  '10" Chef Knife – NSF Certified', 'chef-knife-10in-nsf',
  'High-carbon stainless steel blade with ergonomic handle. NSF certified.',
  3499,
  id, 80, 'each'
FROM public.categories WHERE slug = 'smallwares'
ON CONFLICT (slug) DO NOTHING;
