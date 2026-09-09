import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const addressSchema = z.record(z.any());

const placeGuestOrderSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        title: z.string().min(1).max(200),
        variantTitle: z.string().max(200).optional(),
        quantity: z.number().int().positive().max(50),
        price: z.number().nonnegative().max(100000),
        image: z.string().max(500).optional(),
      }),
    )
    .min(1)
    .max(50),
  shippingCost: z.number().nonnegative().max(1000),
  taxAmount: z.number().nonnegative().max(100000),
  notes: z.string().max(1000).optional(),
});

/**
 * Public checkout endpoint: anyone (signed in or not) can place an order.
 * Prices and totals are recomputed server-side from the database, never
 * trusted from the browser.
 */
export const placeGuestOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => placeGuestOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-price from the catalogue so the client cannot dictate the amount.
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const variantIds = data.items
      .map((i) => i.variantId)
      .filter((v): v is string => typeof v === "string");

    const [{ data: products }, { data: variants }, { data: defaultSource }] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("id, title, price, status, fulfillment_source_id")
        .in("id", productIds),
      variantIds.length
        ? supabaseAdmin.from("product_variants").select("id, product_id, title, price").in("id", variantIds)
        : Promise.resolve({ data: [] as any[] }),
      supabaseAdmin
        .from("fulfillment_sources")
        .select("id")
        .eq("source_type", "inkthreadable")
        .maybeSingle(),
    ]);

    const productById = new Map((products ?? []).map((p: any) => [p.id, p]));
    const variantById = new Map((variants ?? []).map((v: any) => [v.id, v]));

    const lines = data.items.map((item) => {
      const product = productById.get(item.productId);
      if (!product || product.status !== "active") {
        throw new Error(`"${item.title}" is no longer available`);
      }
      const variant = item.variantId ? variantById.get(item.variantId) : null;
      const price = Number(variant?.price ?? product.price ?? 0);
      return {
        product_id: product.id,
        variant_id: variant?.id ?? null,
        fulfillment_source_id: product.fulfillment_source_id ?? defaultSource?.id ?? null,
        title: product.title as string,
        variant_title: (variant?.title as string | undefined) ?? item.variantTitle ?? null,
        quantity: item.quantity,
        price,
        total: Number((price * item.quantity).toFixed(2)),
        image: item.image ?? null,
      };
    });

    const subtotal = Number(lines.reduce((sum, l) => sum + l.total, 0).toFixed(2));
    const total = Number((subtotal + data.shippingCost + data.taxAmount).toFixed(2));

    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${datePart}-${randomPart}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        email: data.email,
        shipping_address: data.shippingAddress,
        billing_address: data.billingAddress ?? data.shippingAddress,
        subtotal,
        shipping_cost: data.shippingCost,
        tax_amount: data.taxAmount,
        total,
        notes: data.notes ?? null,
      } as never)
      .select()
      .single();

    if (error || !order) throw new Error(error?.message ?? "Could not place your order");

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: (order as any).id })) as never);
    if (itemsError) throw new Error(itemsError.message);

    let fulfillment: { submitted: boolean; reason?: string } = {
      submitted: false,
      reason: "Not attempted",
    };
    try {
      const { submitOrderToInkthreadable } = await import("@/lib/inkthreadable-api.server");
      const result = await submitOrderToInkthreadable((order as any).id);
      fulfillment = result.submitted ? { submitted: true } : { submitted: false, reason: result.reason };
    } catch (err) {
      fulfillment = {
        submitted: false,
        reason: err instanceof Error ? err.message : "Fulfilment submission failed",
      };
    }

    return {
      id: (order as any).id as string,
      orderNumber,
      total,
      fulfillment,
    };
  });

/**
 * Public order lookup — requires both the order number and the email used at
 * checkout, and returns only tracking-relevant fields.
 */
export const lookupOrder = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ orderNumber: z.string().min(4).max(40), email: z.string().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, created_at, status, fulfillment_status, subtotal, shipping_cost, tax_amount, total, order_items(title, variant_title, quantity, total, status, tracking_number, tracking_url)",
      )
      .eq("order_number", data.orderNumber.trim().toUpperCase())
      .ilike("email", data.email.trim())
      .maybeSingle();

    if (!order) throw new Error("We couldn't find an order with those details");
    return order as any;
  });
