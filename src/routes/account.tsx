import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, User } from "lucide-react";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My Account | Abyssinia Roots & Co." },
      { name: "description", content: "Manage your Abyssinia Roots & Co. account, orders, and wishlist." },
    ],
  }),
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">My Account</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AccountCard icon={<Package className="h-6 w-6" />} title="Orders" description="View order history and tracking" to="/account/orders" />
        <AccountCard icon={<Heart className="h-6 w-6" />} title="Wishlist" description="Saved items and favorites" to="/wishlist" />
        <AccountCard icon={<MapPin className="h-6 w-6" />} title="Addresses" description="Manage shipping addresses" to="/account/addresses" />
        <AccountCard icon={<User className="h-6 w-6" />} title="Profile" description="Edit your account details" to="/account/profile" />
      </div>
      <div className="mt-10 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <p className="mt-2 text-muted-foreground">You have no recent orders.</p>
        <Button asChild className="mt-4" variant="outline"><Link to="/shop">Start Shopping</Link></Button>
      </div>
    </div>
  );
}

function AccountCard({ icon, title, description, to }: { icon: React.ReactNode; title: string; description: string; to: string }) {
  return (
    <Link to={to} className="group rounded-lg border border-border p-6 transition-colors hover:border-primary/50 hover:bg-accent">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">{description}</p>
    </Link>
  );
}
