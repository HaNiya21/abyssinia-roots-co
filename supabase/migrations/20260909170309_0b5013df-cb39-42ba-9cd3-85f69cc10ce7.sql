-- Core ecommerce schema for Abyssinia Roots & Co.
-- Includes products, collections, variants, inventory, orders, customers, reviews,
-- fulfillment sources, wishlist, and recently-viewed tracking.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fulfillment sources (Own Brand, Inkthreadable, Amazon, Third Party, Dropship Supplier)
CREATE TYPE public.fulfillment_source_type AS ENUM (
  'own_brand',
  'inkthreadable',
  'amazon',
  'third_party',
  'dropship_supplier'
);

CREATE TABLE public.fulfillment_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  source_type public.fulfillment_source_type NOT NULL DEFAULT 'own_brand',
  is_active boolean NOT NULL DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fulfillment_sources TO authenticated;
GRANT ALL ON public.fulfillment_sources TO service_role;
ALTER TABLE public.fulfillment_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfillment sources are viewable by everyone"
  ON public.fulfillment_sources
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage fulfillment sources"
  ON public.fulfillment_sources
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  handle text NOT NULL UNIQUE,
  description text,
  image text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly viewable when active"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Collections
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  handle text NOT NULL UNIQUE,
  description text,
  image text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT SELECT ON public.collections TO anon;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are publicly viewable when active"
  ON public.collections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage collections"
  ON public.collections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  handle text NOT NULL UNIQUE,
  description text,
  description_html text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price numeric(12,2) NOT NULL,
  compare_at_price numeric(12,2),
  cost_per_item numeric(12,2),
  sku text,
  barcode text,
  weight numeric(10,2),
  weight_unit text DEFAULT 'kg',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  seo_title text,
  seo_description text,
  fulfillment_source_id uuid REFERENCES public.fulfillment_sources(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable when active"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product collections (many-to-many)
CREATE TABLE public.product_collections (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, collection_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_collections TO authenticated;
GRANT SELECT ON public.product_collections TO anon;
GRANT ALL ON public.product_collections TO service_role;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product collections are publicly viewable"
  ON public.product_collections
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage product collections"
  ON public.product_collections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product variants
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL,
  sku text,
  barcode text,
  price numeric(12,2),
  compare_at_price numeric(12,2),
  cost_per_item numeric(12,2),
  weight numeric(10,2),
  weight_unit text DEFAULT 'kg',
  option1 text,
  option2 text,
  option3 text,
  fulfillment_source_id uuid REFERENCES public.fulfillment_sources(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT SELECT ON public.product_variants TO anon;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants are publicly viewable"
  ON public.product_variants
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage product variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inventory tracking per variant
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL UNIQUE REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  location text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT SELECT ON public.inventory TO anon;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory is publicly viewable"
  ON public.inventory
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage inventory"
  ON public.inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT SELECT ON public.product_images TO anon;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are publicly viewable"
  ON public.product_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Profiles / customers
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  phone text,
  accepts_marketing boolean NOT NULL DEFAULT false,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update own profile"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Addresses
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  company text,
  address1 text NOT NULL,
  address2 text,
  city text NOT NULL,
  province text,
  country text NOT NULL,
  postal_code text NOT NULL,
  phone text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON public.addresses
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Orders
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded'
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  currency text NOT NULL DEFAULT 'USD',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping_cost numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Authenticated users can manage orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Order items with per-line fulfillment source
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  fulfillment_source_id uuid REFERENCES public.fulfillment_sources(id) ON DELETE SET NULL,
  title text NOT NULL,
  variant_title text,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(12,2) NOT NULL,
  total numeric(12,2) NOT NULL,
  sku text,
  image text,
  status text NOT NULL DEFAULT 'pending',
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.profile_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can manage order items"
  ON public.order_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are publicly viewable"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Users can create reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Wishlist
CREATE TABLE public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON public.wishlists
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Recently viewed
CREATE TABLE public.recently_viewed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recently_viewed TO authenticated;
GRANT ALL ON public.recently_viewed TO service_role;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own recently viewed"
  ON public.recently_viewed
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Discounts
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  value numeric(12,2) NOT NULL,
  applies_to text NOT NULL DEFAULT 'entire_order',
  minimum_amount numeric(12,2),
  usage_limit integer,
  usage_count integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.discounts TO authenticated;
GRANT SELECT ON public.discounts TO anon;
GRANT ALL ON public.discounts TO service_role;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active discounts are publicly viewable"
  ON public.discounts
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage discounts"
  ON public.discounts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default fulfillment sources
INSERT INTO public.fulfillment_sources (name, source_type, is_active)
VALUES
  ('Own Brand', 'own_brand', true),
  ('Inkthreadable', 'inkthreadable', true),
  ('Amazon', 'amazon', true),
  ('Third Party', 'third_party', true),
  ('Dropship Supplier', 'dropship_supplier', true)
ON CONFLICT (name) DO NOTHING;

-- Seed categories
INSERT INTO public.categories (name, handle, description, sort_order)
VALUES
  ('Apparel', 'apparel', 'T-shirts, hoodies, sweatshirts, and jackets', 1),
  ('Hats & Bags', 'hats-bags', 'Caps, totes, and accessories', 2),
  ('Home & Living', 'home-living', 'Mugs, posters, and decor', 3),
  ('Amharic Collection', 'amharic-collection', 'Modern streetwear featuring Amharic script', 4),
  ('Ethiopian Culture & Gifts', 'ethiopian-culture-gifts', 'Meaningful gifts inspired by Ethiopian traditions', 5)
ON CONFLICT (handle) DO NOTHING;

-- Seed collections
INSERT INTO public.collections (title, handle, description, sort_order)
VALUES
  ('Apparel', 'apparel', 'Tees, hoodies & sweatshirts', 1),
  ('Hats & Bags', 'hats-bags', 'Caps, totes & accessories', 2),
  ('Home & Living', 'home-living', 'Mugs, posters & decor', 3),
  ('Amharic Collection', 'amharic-collection', 'Script & expression', 4),
  ('Ethiopian Culture & Gifts', 'ethiopian-culture-gifts', 'Traditional & modern gifts', 5)
ON CONFLICT (handle) DO NOTHING;

-- Seed sample products
INSERT INTO public.products (
  title, handle, description, price, compare_at_price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Habesha Heritage Tee',
  'habesha-heritage-tee',
  'A premium cotton tee celebrating Ethiopian heritage with a subtle embroidered motif.',
  38.00,
  45.00,
  c.id,
  'active',
  fs.id,
  ARRAY['bestseller', 'heritage']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'apparel' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Roots Coffee Hoodie',
  'roots-coffee-hoodie',
  'Espresso brown hoodie with small coffee bean embroidery detail.',
  72.00,
  c.id,
  'active',
  fs.id,
  ARRAY['hoodie', 'coffee']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'apparel' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Amharic Script Cap',
  'amharic-script-cap',
  'Black baseball cap with embroidered Amharic script in gold.',
  32.00,
  c.id,
  'active',
  fs.id,
  ARRAY['amharic', 'cap']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'hats-bags' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Abyssinian Tote',
  'abyssinian-tote',
  'Natural canvas tote with Ethiopian-inspired geometric print.',
  28.00,
  c.id,
  'active',
  fs.id,
  ARRAY['tote', 'geometric']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'hats-bags' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Ethiopian Wolf Tee',
  'ethiopian-wolf-tee',
  'Olive green tee with minimalist Ethiopian wolf illustration.',
  36.00,
  c.id,
  'active',
  fs.id,
  ARRAY['wildlife', 'tee']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'apparel' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Lalibela Sweatshirt',
  'lalibela-sweatshirt',
  'Warm sand crewneck with embroidered Lalibela cross motif.',
  68.00,
  c.id,
  'active',
  fs.id,
  ARRAY['sweatshirt', 'lalibela']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'apparel' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Teff Grain Mug',
  'teff-grain-mug',
  'Cream ceramic mug with elegant Amharic calligraphy.',
  18.00,
  c.id,
  'active',
  fs.id,
  ARRAY['mug', 'home']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'home-living' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

INSERT INTO public.products (
  title, handle, description, price, category_id, status, fulfillment_source_id, tags
)
SELECT
  'Coffee Ceremony Poster',
  'coffee-ceremony-poster',
  'Framed art print of an Ethiopian coffee ceremony scene.',
  24.00,
  c.id,
  'active',
  fs.id,
  ARRAY['poster', 'coffee']
FROM public.categories c, public.fulfillment_sources fs
WHERE c.handle = 'home-living' AND fs.name = 'Inkthreadable'
ON CONFLICT (handle) DO NOTHING;

-- Link products to collections
INSERT INTO public.product_collections (product_id, collection_id)
SELECT p.id, col.id
FROM public.products p
JOIN public.collections col ON col.handle = 'apparel'
WHERE p.handle IN ('habesha-heritage-tee', 'roots-coffee-hoodie', 'ethiopian-wolf-tee', 'lalibela-sweatshirt')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_collections (product_id, collection_id)
SELECT p.id, col.id
FROM public.products p
JOIN public.collections col ON col.handle = 'hats-bags'
WHERE p.handle IN ('amharic-script-cap', 'abyssinian-tote')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_collections (product_id, collection_id)
SELECT p.id, col.id
FROM public.products p
JOIN public.collections col ON col.handle = 'home-living'
WHERE p.handle IN ('teff-grain-mug', 'coffee-ceremony-poster')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_collections (product_id, collection_id)
SELECT p.id, col.id
FROM public.products p
JOIN public.collections col ON col.handle = 'amharic-collection'
WHERE p.handle IN ('amharic-script-cap', 'habesha-heritage-tee')
ON CONFLICT DO NOTHING;

-- Seed product images
INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/tee-1.jpg', 'Habesha Heritage Tee', 0
FROM public.products p WHERE p.handle = 'habesha-heritage-tee'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/hoodie-1.jpg', 'Roots Coffee Hoodie', 0
FROM public.products p WHERE p.handle = 'roots-coffee-hoodie'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/cap-1.jpg', 'Amharic Script Cap', 0
FROM public.products p WHERE p.handle = 'amharic-script-cap'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/tote-1.jpg', 'Abyssinian Tote', 0
FROM public.products p WHERE p.handle = 'abyssinian-tote'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/tee-2.jpg', 'Ethiopian Wolf Tee', 0
FROM public.products p WHERE p.handle = 'ethiopian-wolf-tee'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/sweatshirt-1.jpg', 'Lalibela Sweatshirt', 0
FROM public.products p WHERE p.handle = 'lalibela-sweatshirt'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/mug-1.jpg', 'Teff Grain Mug', 0
FROM public.products p WHERE p.handle = 'teff-grain-mug'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT p.id, '/images/products/poster-1.jpg', 'Coffee Ceremony Poster', 0
FROM public.products p WHERE p.handle = 'coffee-ceremony-poster'
ON CONFLICT DO NOTHING;

-- Seed variants and inventory for each product
INSERT INTO public.product_variants (product_id, title, sku, price, option1)
SELECT p.id, 'M', p.handle || '-m', p.price, 'M'
FROM public.products p
ON CONFLICT DO NOTHING;

INSERT INTO public.inventory (variant_id, quantity)
SELECT v.id, 100
FROM public.product_variants v
ON CONFLICT (variant_id) DO NOTHING;

-- Helper function to update updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER order_items_updated_at BEFORE UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER discounts_updated_at BEFORE UPDATE ON public.discounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER fulfillment_sources_updated_at BEFORE UPDATE ON public.fulfillment_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
