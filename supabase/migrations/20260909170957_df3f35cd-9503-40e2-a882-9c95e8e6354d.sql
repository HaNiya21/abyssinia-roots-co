CREATE TABLE public.inkthreadable_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  external_order_id TEXT,
  order_number TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.inkthreadable_events TO service_role;

ALTER TABLE public.inkthreadable_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view fulfillment events"
ON public.inkthreadable_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

GRANT SELECT ON public.inkthreadable_events TO authenticated;

CREATE INDEX inkthreadable_events_order_idx ON public.inkthreadable_events(order_id);
CREATE INDEX inkthreadable_events_type_idx ON public.inkthreadable_events(event_type);

CREATE TRIGGER set_inkthreadable_events_updated_at
BEFORE UPDATE ON public.inkthreadable_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS external_order_id TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled';

CREATE INDEX IF NOT EXISTS orders_external_order_id_idx ON public.orders(external_order_id);