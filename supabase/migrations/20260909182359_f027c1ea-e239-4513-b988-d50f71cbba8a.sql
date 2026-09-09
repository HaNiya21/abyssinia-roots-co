ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS supplier_product_code text,
  ADD COLUMN IF NOT EXISTS design_urls jsonb;

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS supplier_product_code text,
  ADD COLUMN IF NOT EXISTS design_urls jsonb;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_error text,
  ADD COLUMN IF NOT EXISTS fulfillment_submitted_at timestamptz;