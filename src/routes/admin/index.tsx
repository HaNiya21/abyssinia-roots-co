import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Sales" value="$0.00" />
        <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Products" value="0" />
        <StatCard icon={<Package className="h-5 w-5" />} label="Orders" value="0" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Customers" value="0" />
      </div>
      <div className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <p className="mt-2 text-muted-foreground">No orders yet.</p>
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
