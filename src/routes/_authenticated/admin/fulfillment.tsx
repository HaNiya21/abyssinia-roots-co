import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFulfillmentFeed } from "@/lib/admin.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/fulfillment")({
  component: AdminFulfillmentPage,
});

const EVENT_LABELS: Record<string, string> = {
  "order-submit": "Order sent to production",
  "order-creation": "Production confirmed order",
  "order-deletion": "Production cancelled order",
  "order-shipped": "Order shipped",
  "order-payment": "Payment update",
  "order-update": "Order updated",
};

function AdminFulfillmentPage() {
  const fetchFeed = useServerFn(getFulfillmentFeed);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "fulfillment"],
    queryFn: () => fetchFeed(),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading production activity…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fulfillment activity</h2>
      <p className="text-sm text-muted-foreground">
        Every message exchanged with the print and embroidery partner, newest first.
      </p>
      {!data?.length ? (
        <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
          No production activity yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((event: any) => (
            <li key={event.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  {EVENT_LABELS[event.event_type] ?? event.event_type}
                </span>
                <Badge variant={event.processed ? "secondary" : "destructive"}>
                  {event.processed ? "Processed" : "Needs attention"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.order_number || event.external_order_id || "Unmatched order"} ·{" "}
                {new Date(event.created_at).toLocaleString()}
              </p>
              {event.error ? (
                <p className="mt-2 text-sm text-destructive">{event.error}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
