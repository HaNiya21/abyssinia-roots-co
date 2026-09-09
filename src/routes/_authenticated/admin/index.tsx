import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Package, ShoppingBag, Users, DollarSign, Truck } from "lucide-react";
import { getAdminOverview } from "@/lib/admin.functions";
import { FulfillmentBadge } from "@/components/FulfillmentBadge";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const fetchOverview = useServerFn(getAdminOverview);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => fetchOverview(),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading dashboard…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Sales" value={`$${(data?.totalSales ?? 0).toFixed(2)}`} />
        <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Products" value={String(data?.productCount ?? 0)} />
        <StatCard icon={<Package className="h-5 w-5" />} label="Orders" value={String(data?.orderCount ?? 0)} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Customers" value={String(data?.customerCount ?? 0)} />
      </div>

      <div className="rounded-lg border border-border p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-5 w-5" />
          <span className="text-sm font-medium">Awaiting production or shipping</span>
        </div>
        <p className="mt-2 text-2xl font-semibold">{data?.awaitingFulfillment ?? 0}</p>
        <Link to="/admin/fulfillment" className="mt-2 inline-block text-sm underline">
          View production activity
        </Link>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        {!data?.recentOrders?.length ? (
          <p className="mt-2 text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {data.recentOrders.map((order: any) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <span className="font-medium">{order.order_number}</span>
                <span className="text-muted-foreground">{order.email}</span>
                <FulfillmentBadge status={order.fulfillment_status} />
                <span className="font-semibold">${Number(order.total ?? 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-sm font-medium">{label}</span></div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
