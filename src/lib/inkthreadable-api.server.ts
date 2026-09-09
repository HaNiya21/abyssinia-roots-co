/**
 * Server-only client for submitting orders to Inkthreadable for production.
 *
 * Auth: every request carries AppId plus a Signature query parameter, where
 * Signature = SHA1(request body + secret key).
 * Endpoint: POST https://www.inkthreadable.co.uk/api/orders.php
 */

const API_BASE = "https://www.inkthreadable.co.uk";

type Json = Record<string, unknown>;

async function sha1Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function str(obj: Json | null | undefined, keys: string[]): string {
  if (!obj) return "";
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function toSupplierAddress(address: Json | null | undefined): Json {
  const first = str(address, ["firstName", "first_name", "firstname"]);
  const last = str(address, ["lastName", "last_name", "lastname"]);
  const full = str(address, ["name", "fullName", "full_name"]);
  const parts = full.split(" ");
  return {
    firstName: first || parts[0] || "",
    lastName: last || parts.slice(1).join(" ") || "",
    company: str(address, ["company"]),
    address1: str(address, ["address1", "line1", "address", "street"]),
    address2: str(address, ["address2", "line2", "apartment"]),
    city: str(address, ["city", "town"]),
    county: str(address, ["county", "state", "province", "region"]),
    postcode: str(address, ["postcode", "postal_code", "postalCode", "zip"]),
    country: str(address, ["country", "country_name"]) || "United Kingdom",
    phone1: str(address, ["phone1", "phone", "telephone"]),
  };
}

/** Public site origin so artwork links the supplier fetches are absolute. */
const PUBLIC_SITE_URL = "https://abyssinia-roots-co.lovable.app";

function absoluteArtwork(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${PUBLIC_SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function designsFrom(value: unknown): Json | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Json)
      .filter(([, v]) => typeof v === "string" && v !== "")
      .map(([k, v]) => [k, absoluteArtwork(v as string)] as const);
    if (entries.length > 0) return Object.fromEntries(entries);
  }
  return null;
}

/** Products decorated with stitched thread rather than printed ink. */
const EMBROIDERED_CODE_PREFIXES = ["STTU", "JH0", "STAU", "BC0", "BB1"];

function isEmbroidered(code: string): boolean {
  const upper = code.toUpperCase();
  return EMBROIDERED_CODE_PREFIXES.some((prefix) => upper.startsWith(prefix));
}


export type SubmitResult =
  | { submitted: true; externalOrderId: string | null }
  | { submitted: false; reason: string };

/**
 * Builds the supplier payload for a stored order and sends it for production.
 * Never throws: failures are recorded on the order so checkout still succeeds.
 */
export async function submitOrderToInkthreadable(orderId: string): Promise<SubmitResult> {
  const appId = process.env["INKTHREADABLE_APP_ID"];
  const secret = process.env["INKTHREADABLE_SECRET_KEY"];
  if (!appId || !secret) return { submitted: false, reason: "Inkthreadable credentials are not configured" };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return { submitted: false, reason: orderError?.message ?? "Order not found" };
  }

  const items = ((order as unknown as { order_items?: Json[] }).order_items ?? []) as Json[];
  if (items.length === 0) return { submitted: false, reason: "Order has no items" };

  const variantIds = items.map((i) => i["variant_id"]).filter((v): v is string => typeof v === "string");
  const productIds = items.map((i) => i["product_id"]).filter((v): v is string => typeof v === "string");

  const [{ data: variants }, { data: products }] = await Promise.all([
    variantIds.length
      ? supabaseAdmin
          .from("product_variants")
          .select("id, sku, supplier_product_code, design_urls")
          .in("id", variantIds)
      : Promise.resolve({ data: [] as Json[] }),
    productIds.length
      ? supabaseAdmin
          .from("products")
          .select("id, sku, supplier_product_code, design_urls, title")
          .in("id", productIds)
      : Promise.resolve({ data: [] as Json[] }),
  ]);

  const variantById = new Map((variants ?? []).map((v) => [(v as Json)["id"] as string, v as Json]));
  const productById = new Map((products ?? []).map((p) => [(p as Json)["id"] as string, p as Json]));

  const supplierItems: Json[] = [];
  const skipped: string[] = [];
  const embroideredTitles: string[] = [];


  for (const item of items) {
    const variant = variantById.get(item["variant_id"] as string) ?? null;
    const product = productById.get(item["product_id"] as string) ?? null;

    const pn =
      str(variant, ["supplier_product_code", "sku"]) || str(product, ["supplier_product_code", "sku"]);
    if (!pn) {
      skipped.push(String(item["title"] ?? "item"));
      continue;
    }

    const designs = designsFrom(variant?.["design_urls"]) ?? designsFrom(product?.["design_urls"]);
    const embroidered = isEmbroidered(pn);
    if (embroidered) embroideredTitles.push(String(item["title"] ?? pn));

    supplierItems.push({
      pn,
      quantity: Number(item["quantity"] ?? 1),
      retailPrice: Number(item["price"] ?? 0),
      ...(embroidered ? { printType: "embroidery", decoration: "embroidery" } : {}),
      ...(designs ? { designs } : {}),
    });
  }


  if (supplierItems.length === 0) {
    return {
      submitted: false,
      reason: `No items have a supplier product code${skipped.length ? ` (${skipped.join(", ")})` : ""}`,
    };
  }

  const shipping = (order as unknown as Json)["shipping_address"] as Json | null;
  const billing = ((order as unknown as Json)["billing_address"] as Json | null) ?? shipping;

  const body = JSON.stringify({
    external_id: (order as unknown as Json)["order_number"],
    comment: (order as unknown as Json)["notes"] ?? "",
    shipping_address: toSupplierAddress(shipping),
    billing_address: toSupplierAddress(billing),
    shipping: { shippingMethod: "regular" },
    items: supplierItems,
  });

  const signature = await sha1Hex(body + secret);
  const url = `${API_BASE}/api/orders.php?AppId=${encodeURIComponent(appId)}&Signature=${signature}`;

  let externalOrderId: string | null = null;
  let failure: string | null = null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await response.text();

    if (!response.ok) {
      failure = `Inkthreadable responded ${response.status}: ${text.slice(0, 400)}`;
    } else {
      try {
        const parsed = JSON.parse(text) as Json;
        const candidate = (parsed["id"] ?? (parsed["order"] as Json | undefined)?.["id"]) as
          | string
          | number
          | undefined;
        if (candidate !== undefined) externalOrderId = String(candidate);
      } catch {
        // Non-JSON success body: keep the raw response for the audit trail.
      }
    }

    await supabaseAdmin.from("inkthreadable_events").insert({
      event_type: "order-submit",
      external_order_id: externalOrderId,
      order_id: orderId,
      order_number: String((order as unknown as Json)["order_number"] ?? ""),
      payload: { request: JSON.parse(body), response: text.slice(0, 4000) } as never,
      processed: !failure,
      error: failure,
    } as never);
  } catch (error) {
    failure = error instanceof Error ? error.message : "Failed to reach Inkthreadable";
  }

  await supabaseAdmin
    .from("orders")
    .update({
      ...(externalOrderId ? { external_order_id: externalOrderId } : {}),
      fulfillment_status: failure ? "submission_failed" : "submitted",
      fulfillment_error: failure,
      fulfillment_submitted_at: new Date().toISOString(),
    } as never)
    .eq("id", orderId);

  return failure ? { submitted: false, reason: failure } : { submitted: true, externalOrderId };
}
