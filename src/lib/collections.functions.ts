import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const listCollections = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await createPublishableClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCollectionByHandle = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ handle: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = await createPublishableClient();
    const { data: collection, error } = await supabase
      .from("collections")
      .select(
        `*,
         product_collections(
           products(id, title, handle, price, compare_at_price, status, tags,
             product_images(id, url, alt_text, position))
         )`
      )
      .eq("handle", data.handle)
      .eq("is_active", true)
      .single();
    if (error) throw new Error(error.message);
    return collection;
  });
});
