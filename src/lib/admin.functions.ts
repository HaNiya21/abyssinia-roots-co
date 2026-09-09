import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Throws unless the signed-in user is flagged as an admin. */
async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", context.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.is_admin) throw new Error("Forbidden");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [orders, products, customers] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, order_number, email, total, status, payment_status, fulfillment_status, created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    const rows = orders.data ?? [];
    const totalSales = rows
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

    return {
      totalSales,
      orderCount: rows.length,
      productCount: products.count ?? 0,
      customerCount: customers.count ?? 0,
      awaitingFulfillment: rows.filter(
        (o) => o.fulfillment_status !== "shipped" && o.fulfillment_status !== "delivered",
      ).length,
      recentOrders: rows.slice(0, 8),
    };
  });

export const getAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: profiles, error }, { data: orders }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, email, first_name, last_name, phone, accepts_marketing, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin.from("orders").select("profile_id, total, payment_status"),
    ]);
    if (error) throw new Error(error.message);

    return (profiles ?? []).map((p) => {
      const own = (orders ?? []).filter((o) => o.profile_id === p.id);
      return {
        ...p,
        orderCount: own.length,
        lifetimeValue: own
          .filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + Number(o.total ?? 0), 0),
      };
    });
  });

export const getFulfillmentFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("inkthreadable_events")
      .select("id, event_type, external_order_id, order_number, processed, error, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Re-sends an order to Inkthreadable (used when the first attempt failed). */
export const resubmitOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { submitOrderToInkthreadable } = await import("@/lib/inkthreadable-api.server");
    return submitOrderToInkthreadable(data.orderId);
  });
