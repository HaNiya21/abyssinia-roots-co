import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Wishlist | Abyssinia Roots & Co." },
      { name: "description", content: "Your saved Abyssinia Roots & Co. wishlist items." },
    ],
  }),
});

const products = [
  { id: "1", handle: "habesha-heritage-tee", title: "Habesha Heritage Tee", price: 38, compareAtPrice: 45, image: "/images/products/tee-1.jpg", badge: "Bestseller" },
  { id: "2", handle: "roots-coffee-hoodie", title: "Roots Coffee Hoodie", price: 72, image: "/images/products/hoodie-1.jpg" },
];

function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Wishlist</h1>
      {products.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border p-10 text-center">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button asChild className="mt-4"><Link to="/shop">Explore Products</Link></Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
