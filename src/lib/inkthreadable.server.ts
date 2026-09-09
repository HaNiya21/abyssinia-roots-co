/**
 * Server-only handling of Inkthreadable fulfilment webhooks.
 *
 * Inkthreadable posts JSON to one URL per event. Each URL carries a private
 * token (query string `?token=` or the `x-webhook-token` header) that we
 * compare against INKTHREADABLE_WEBHOOK_TOKEN.
 *
 * Payload field names are read defensively: we only use values that are
 * actually present and never assume undocumented behaviour.
 */

export type InkthreadableEvent =
  | "order-creation"
  | "order-deletion"
  | "order-shipped"
  | "order-payment"
  | "order-update";

type Json = Record<string, unknown>;

function pick(obj: Json, keys: string[]): unknown {
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request: Request): boolean {
  const expected = process.env["INKTHREADABLE_WEBHOOK_TOKEN"];
  if (!expected) return false;
  const url = new URL(request.url);
  const provided =
    url.searchParams.get("token") ??
    request.headers.get("x-webhook-token") ??
    request.headers.get("x-inkthreadable-token") ??
    "";
  return timingSafeEqual(provided, expected);
}

const ORDER_STATUS_BY_EVENT: Record<InkthreadableEvent, string | null> = {
  "order-creation": "processing",
  "order-deletion": "cancelled",
  "order-shipped": "shipped",
  "order-payment": null,
  "order-update": null,
};

export async function handleInkthreadableWebhook(
  event: InkthreadableEvent,
  request: Request,
): Promise<Response> {
  if (!authorize(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: Json;
  try {
    payload = (await request.json()) as Json;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (typeof payload !== "object" || payload === null) {
    return new Response("Invalid payload", { status: 400 });
  }

  const order = (payload["order"] as Json | undefined) ?? payload;

  const externalId = asString(
    pick(order, ["id", "orderId", "order_id", "inkthreadableId"]),
  );
  const reference = asString(
    pick(order, ["reference", "orderReference", "order_reference", "orderNumber", "order_number"]),
  );
  const trackingNumber = asString(
    pick(order, ["tracking", "trackingNumber", "tracking_number", "trackingCode"]),
  );
  const trackingUrl = asString(
    pick(order, ["trackingUrl", "tracking_url", "trackingLink", "url"]),
  );
  const carrier = asString(pick(order, ["carrier", "courier", "shippingCarrier"]));
  const remoteStatus = asString(pick(order, ["status", "orderStatus", "state"]));

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: eventRow } = await supabaseAdmin
    .from("inkthreadable_events")
    .insert({
      event_type: event,
      external_order_id: externalId,
      order_number: reference,
      payload: payload as never,
    })
    .select("id")
    .single();

  const finish = async (error?: string, orderId?: string) => {
    if (eventRow?.id) {
      await supabaseAdmin
        .from("inkthreadable_events")
        .update({
          processed: !error,
          error: error ?? null,
          ...(orderId ? { order_id: orderId } : {}),
        })
        .eq("id", eventRow.id);
    }
    return error
      ? new Response(JSON.stringify({ received: true, matched: false, error }), {
          status: 202,
          headers: { "Content-Type": "application/json" },
        })
      : new Response(JSON.stringify({ received: true, matched: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
  };

  // Match the store order: by external id first, then by our order number.
  let matched: { id: string; metadata: unknown } | null = null;

  if (externalId) {
    const { data } = await supabaseAdmin
      .from("orders")
      .select("id, metadata")
      .eq("external_order_id", externalId)
      .maybeSingle();
    matched = data ?? null;
  }
  if (!matched && reference) {
    const { data } = await supabaseAdmin
      .from("orders")
      .select("id, metadata")
      .eq("order_number", reference)
      .maybeSingle();
    matched = data ?? null;
  }

  if (!matched) {
    return finish("No matching order found for this notification");
  }

  const orderUpdate: Record<string, unknown> = {};
  if (externalId) orderUpdate["external_order_id"] = externalId;

  const nextStatus = ORDER_STATUS_BY_EVENT[event];
  if (nextStatus) orderUpdate["status"] = nextStatus;

  if (event === "order-payment") orderUpdate["payment_status"] = "paid";
  if (event === "order-creation") orderUpdate["fulfillment_status"] = "in_production";
  if (event === "order-deletion") orderUpdate["fulfillment_status"] = "cancelled";
  if (event === "order-shipped") orderUpdate["fulfillment_status"] = "fulfilled";
  if (event === "order-update" && remoteStatus) {
    orderUpdate["fulfillment_status"] = remoteStatus.toLowerCase().replace(/\s+/g, "_");
  }

  const baseMetadata =
    matched.metadata && typeof matched.metadata === "object" && !Array.isArray(matched.metadata)
      ? (matched.metadata as Json)
      : {};
  orderUpdate["metadata"] = {
    ...baseMetadata,
    inkthreadable: {
      ...((baseMetadata["inkthreadable"] as Json) ?? {}),
      last_event: event,
      last_event_at: new Date().toISOString(),
      ...(externalId ? { external_order_id: externalId } : {}),
      ...(remoteStatus ? { status: remoteStatus } : {}),
      ...(carrier ? { carrier } : {}),
    },
  };

  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .update(orderUpdate as never)
    .eq("id", matched.id);
  if (orderError) return finish(orderError.message, matched.id);

  // Line items fulfilled by Inkthreadable follow the order's fulfilment state.
  const itemUpdate: Record<string, unknown> = {};
  if (event === "order-creation") itemUpdate["status"] = "in_production";
  if (event === "order-deletion") itemUpdate["status"] = "cancelled";
  if (event === "order-shipped") {
    itemUpdate["status"] = "shipped";
    itemUpdate["shipped_at"] = new Date().toISOString();
    if (trackingNumber) itemUpdate["tracking_number"] = trackingNumber;
    if (trackingUrl) itemUpdate["tracking_url"] = trackingUrl;
  }

  if (Object.keys(itemUpdate).length > 0) {
    const { data: source } = await supabaseAdmin
      .from("fulfillment_sources")
      .select("id")
      .eq("source_type", "inkthreadable")
      .maybeSingle();

    let query = supabaseAdmin.from("order_items").update(itemUpdate as never).eq("order_id", matched.id);
    if (source?.id) query = query.eq("fulfillment_source_id", source.id);
    const { error: itemError } = await query;
    if (itemError) return finish(itemError.message, matched.id);
  }

  return finish(undefined, matched.id);
}
