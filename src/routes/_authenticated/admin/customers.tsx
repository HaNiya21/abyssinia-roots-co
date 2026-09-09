import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminCustomers } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const fetchCustomers = useServerFn(getAdminCustomers);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => fetchCustomers(),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading customers…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Customers</h2>
      {!data?.length ? (
        <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
          No customers yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Email</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Spent</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c: any) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3">
                    {[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="p-3">{c.email ?? "—"}</td>
                  <td className="p-3">{c.orderCount}</td>
                  <td className="p-3">${Number(c.lifetimeValue).toFixed(2)}</td>
                  <td className="p-3">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
