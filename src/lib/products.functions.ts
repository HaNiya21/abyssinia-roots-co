import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public read-only server functions for the storefront catalog.
// These use the publishable key so they work during SSR without a session.

const createPublishableClient = async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
};

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await createPublishableClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, title, handle, price, compare_at_price, status, tags,
       product_images(id, url, alt_text, position),
       product_variants(id, title, price, option1, option2, option3)`
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProductByHandle = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ handle: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = await createPublishableClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `*,
         product_images(id, url, alt_text, position),
         product_variants(id, title, sku, price, compare_at_price, option1, option2, option3, fulfillment_source_id),
         categories(id, name, handle),
         fulfillment_sources(id, name, source_type)`
      )
      .eq("handle", data.handle)
      .eq("status", "active")
      .single();
    if (error) throw new Error(error.message);
    return product;
  });

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ q: z.string().optional() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = await createPublishableClient();
    let query = supabase
      .from("products")
      .select(
        `id, title, handle, price, compare_at_price, status, tags,
         product_images(id, url, alt_text, position)`
      )
      .eq("status", "active");
    if (data.q) {
      query = query.or(`title.ilike.%${data.q}%,description.ilike.%${data.q}%,tags.cs.{${data.q}}`);
    }
    const { data: products, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return products ?? [];
  });
