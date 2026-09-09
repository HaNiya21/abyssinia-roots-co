import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupOrder } from "@/lib/guest-orders.functions";
import { FulfillmentBadge } from "@/components/FulfillmentBadge";

export const Route = createFileRoute("/order-status")({
  validateSearch: z.object({ order: z.string().optional(), email: z.string().optional() }),
  component: OrderStatusPage,
  head: () => ({
    meta: [
      { title: "Track Your Order | Abyssinia Roots & Co." },
      {
        name: "description",
        content:
          "Look up your Abyssinia Roots & Co. order with your order number and email to see production and shipping progress.",
      },
      { property: "og:title", content: "Track Your Order | Abyssinia Roots & Co." },
      {
        property: "og:description",
        content: "Check production and delivery progress for your Abyssinia Roots & Co. order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function OrderStatusPage() {
  const search = Route.useSearch();
  const lookup = useServerFn(lookupOrder);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const result = await lookup({
        data: {
          orderNumber: String(form.get("orderNumber") ?? ""),
          email: String(form.get("email") ?? ""),
        },
      });
      setOrder(result);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Could not find that order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Track your order</h1>
      <p className="mt-2 text-muted-foreground">
        Enter your order number and the email you used at checkout.
      </p>

      <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="orderNumber">Order number</Label>
          <Input
            id="orderNumber"
            name="orderNumber"
            required
            defaultValue={search.order ?? ""}
            placeholder="ORD-20260909-1234"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={search.email ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Looking up…" : "Find my order"}
          </Button>
        </div>
      </form>

      {error ? <p className="mt-6 text-destructive">{error}</p> : null}

      {order ? (
        <div className="mt-10 rounded-lg border border-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{order.order_number}</h2>
              <p className="text-sm text-muted-foreground">
                Placed {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <FulfillmentBadge status={order.fulfillment_status} />
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            {(order.order_items ?? []).map((item: any, index: number) => (
              <li key={index} className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
                <span>
                  {item.title}
                  {item.variant_title ? ` — ${item.variant_title}` : ""} × {item.quantity}
                </span>
                <span className="text-muted-foreground">
                  {item.tracking_number ? (
                    item.tracking_url ? (
                      <a className="underline" href={item.tracking_url} target="_blank" rel="noreferrer">
                        Track {item.tracking_number}
                      </a>
                    ) : (
                      `Tracking ${item.tracking_number}`
                    )
                  ) : (
                    item.status
                  )}
                </span>
                <span className="font-medium">${Number(item.total ?? 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Total</span>
            <span>${Number(order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
