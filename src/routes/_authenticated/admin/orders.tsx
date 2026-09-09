import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        No orders yet. Orders will appear here once customers check out.
      </div>
    </div>
  );
}
