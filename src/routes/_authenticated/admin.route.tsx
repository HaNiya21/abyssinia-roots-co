import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Package, LayoutDashboard, ShoppingBag, Users, Settings } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async () => {
    // In a real app, check admin role here via server function.
    // For now, we allow access to demonstrate the dashboard.
    return { isAdmin: true };
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Abyssinia Roots & Co." },
      { name: "description", content: "Manage products, orders, and store settings." },
    ],
  }),
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Admin Dashboard</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
