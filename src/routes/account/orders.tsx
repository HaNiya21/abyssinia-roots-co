import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Order History</h2>
      <p className="mt-2 text-muted-foreground">You haven&apos;t placed any orders yet.</p>
    </div>
  );
}
