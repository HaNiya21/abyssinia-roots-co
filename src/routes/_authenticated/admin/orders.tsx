import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getAdminOrders, resubmitOrder } from "@/lib/admin.functions";
import { FulfillmentBadge } from "@/components/FulfillmentBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrdersPage,
});

function money(value: number | string | null) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function AdminOrdersPage() {
  const fetchOrders = useServerFn(getAdminOrders);
  const retry = useServerFn(resubmitOrder);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => fetchOrders(),
  });

  const retryMutation = useMutation({
    mutationFn: (orderId: string) => retry({ data: { orderId } }),
    onSuccess: (result) => {
      if (result.submitted) toast.success("Order sent to production");
      else toast.error(result.reason);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading orders…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!data?.length)
    return (
      <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        No orders yet. Orders will appear here once customers check out.
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <div className="space-y-4">
        {data.map((order: any) => (
          <div key={order.id} className="rounded-lg border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  {order.email} · {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FulfillmentBadge status={order.fulfillment_status} />
                <span className="text-sm font-semibold">{money(order.total)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Payment: </span>
                {order.payment_status}
              </p>
              <p>
                <span className="text-muted-foreground">Production ref: </span>
                {order.external_order_id ?? "—"}
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {(order.order_items ?? []).map((item: any) => (
                <li key={item.id} className="flex flex-wrap justify-between gap-2 border-t border-border pt-2">
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
                </li>
              ))}
            </ul>

            {order.fulfillment_error ? (
              <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {order.fulfillment_error}
              </p>
            ) : null}

            {order.fulfillment_status !== "shipped" && order.fulfillment_status !== "delivered" ? (
              <Button
                className="mt-4"
                size="sm"
                variant="outline"
                disabled={retryMutation.isPending}
                onClick={() => retryMutation.mutate(order.id)}
              >
                {order.external_order_id ? "Resend to production" : "Send to production"}
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
