import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("profile_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .eq("profile_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    return order;
  });

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        email: z.string().email(),
        shippingAddress: z.record(z.any()),
        billingAddress: z.record(z.any()).optional(),
        items: z.array(
          z.object({
            productId: z.string(),
            variantId: z.string().optional(),
            title: z.string(),
            variantTitle: z.string().optional(),
            quantity: z.number().int().positive(),
            price: z.number().positive(),
            image: z.string().optional(),
          })
        ),
        subtotal: z.number().nonnegative(),
        shippingCost: z.number().nonnegative(),
        taxAmount: z.number().nonnegative(),
        total: z.number().nonnegative(),
        notes: z.string().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Generate order number: ORD-YYYYMMDD-XXXX
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${datePart}-${randomPart}`;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        profile_id: userId,
        email: data.email,
        shipping_address: data.shippingAddress,
        billing_address: data.billingAddress ?? data.shippingAddress,
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        tax_amount: data.taxAmount,
        total: data.total,
        notes: data.notes ?? null,
      })
      .select()
      .single();

    if (error || !order) throw new Error(error?.message ?? "Failed to create order");

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId ?? null,
      title: item.title,
      variant_title: item.variantTitle ?? null,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      image: item.image ?? null,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    // Push the order to Inkthreadable for production. Never blocks checkout:
    // failures are stored on the order and surfaced in the admin dashboard.
    let fulfillment: { submitted: boolean; reason?: string } = {
      submitted: false,
      reason: "Not attempted",
    };
    try {
      const { submitOrderToInkthreadable } = await import("@/lib/inkthreadable-api.server");
      const result = await submitOrderToInkthreadable(order.id);
      fulfillment = result.submitted
        ? { submitted: true }
        : { submitted: false, reason: result.reason };
    } catch (error) {
      fulfillment = {
        submitted: false,
        reason: error instanceof Error ? error.message : "Fulfilment submission failed",
      };
    }

    return { ...order, fulfillment };
  });
