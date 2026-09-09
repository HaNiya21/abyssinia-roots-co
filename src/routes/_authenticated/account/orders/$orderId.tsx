import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrder } from "@/lib/orders.functions";
import { FulfillmentBadge } from "@/components/FulfillmentBadge";

export const Route = createFileRoute("/_authenticated/account/orders/$orderId")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const fetchOrder = useServerFn(getMyOrder);
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["my-order", orderId],
    queryFn: () => fetchOrder({ data: { orderId } }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading order…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!order) return null;

  const o = order as any;

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="text-sm underline">
        Back to orders
      </Link>

      <div className="rounded-lg border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{o.order_number}</h2>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(o.created_at).toLocaleString()}
            </p>
          </div>
          <FulfillmentBadge status={o.fulfillment_status} />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {o.fulfillment_status === "shipped" || o.fulfillment_status === "delivered"
            ? "Your order has left our production partner — tracking is below."
            : o.fulfillment_status === "submitted"
              ? "Your order is with our embroidery and print partner. We'll email tracking as soon as it ships."
              : "We're preparing your order for production."}
        </p>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h3 className="font-semibold">Items</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {(o.order_items ?? []).map((item: any) => (
            <li key={item.id} className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
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

        <div className="mt-6 space-y-1 border-t border-border pt-4 text-sm">
          <Row label="Subtotal" value={o.subtotal} />
          <Row label="Shipping" value={o.shipping_cost} />
          <Row label="Tax" value={o.tax_amount} />
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>${Number(o.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number | string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>${Number(value ?? 0).toFixed(2)}</span>
    </div>
  );
}
