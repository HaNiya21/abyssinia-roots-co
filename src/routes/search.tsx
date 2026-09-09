import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search | Abyssinia Roots & Co." },
      { name: "description", content: "Search products in the Abyssinia Roots & Co. store." },
    ],
  }),
});

const products = [
  { id: "1", handle: "habesha-heritage-tee", title: "Habesha Heritage Tee", price: 38, compareAtPrice: 45, image: "/images/products/tee-1.jpg", badge: "Bestseller" },
  { id: "2", handle: "roots-coffee-hoodie", title: "Roots Coffee Hoodie", price: 72, image: "/images/products/hoodie-1.jpg" },
  { id: "3", handle: "amharic-script-cap", title: "Amharic Script Cap", price: 32, image: "/images/products/cap-1.jpg" },
];

function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Search</h1>
      <div className="relative mt-6">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for products, collections, or designs..." className="pl-10" />
      </div>
      <p className="mt-6 text-muted-foreground">Showing {products.length} results for &quot;heritage&quot;</p>
      <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
