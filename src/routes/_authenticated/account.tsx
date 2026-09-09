import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Package, Heart, MapPin, User, LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountLayout,
  head: () => ({
    meta: [
      { title: "My Account | Abyssinia Roots & Co." },
      { name: "description", content: "Manage your Abyssinia Roots & Co. account." },
    ],
  }),
});

const links = [
  { to: "/account", label: "Overview", icon: User },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

function AccountLayout() {
  const checkAdmin = useServerFn(getIsAdmin);
  const { data: adminData } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => checkAdmin(),
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = !!adminData?.isAdmin;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">My Account</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
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
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
