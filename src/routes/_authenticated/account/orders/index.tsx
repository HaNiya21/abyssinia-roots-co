import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrders } from "@/lib/orders.functions";
import { FulfillmentBadge } from "@/components/FulfillmentBadge";

export const Route = createFileRoute("/_authenticated/account/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const fetchOrders = useServerFn(getMyOrders);
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchOrders(),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading your orders…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Order History</h2>
      {!data?.length ? (
        <p className="mt-2 text-muted-foreground">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((order: any) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <div>
                <Link to="/account/orders/$orderId" params={{ orderId: order.id }} className="font-medium underline">
                  {order.order_number}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} · {order.order_items?.length ?? 0} item(s)
                </p>
              </div>
              <FulfillmentBadge status={order.fulfillment_status} />
              <span className="font-semibold">${Number(order.total ?? 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
