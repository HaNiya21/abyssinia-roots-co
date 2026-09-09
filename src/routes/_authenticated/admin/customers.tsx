import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Customers</h2>
      <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        No customers yet.
      </div>
    </div>
  );
}
