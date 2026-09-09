import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop All | Abyssinia Roots & Co." },
      { name: "description", content: "Browse the full Abyssinia Roots & Co. collection — apparel, accessories, home goods, and gifts inspired by Ethiopian culture." },
      { property: "og:title", content: "Shop All | Abyssinia Roots & Co." },
      { property: "og:description", content: "Browse the full Abyssinia Roots & Co. collection." },
    ],
  }),
});

const products = [
  { id: "1", handle: "habesha-heritage-tee", title: "Habesha Heritage Tee", price: 38, compareAtPrice: 45, image: "/images/products/tee-1.jpg", badge: "Bestseller" },
  { id: "2", handle: "roots-coffee-hoodie", title: "Roots Coffee Hoodie", price: 72, image: "/images/products/hoodie-1.jpg" },
  { id: "3", handle: "amharic-script-cap", title: "Amharic Script Cap", price: 32, image: "/images/products/cap-1.jpg" },
  { id: "4", handle: "abyssinian-tote", title: "Abyssinian Tote", price: 28, image: "/images/products/tote-1.jpg" },
  { id: "5", handle: "ethiopian-wolf-tee", title: "Ethiopian Wolf Tee", price: 36, image: "/images/products/tee-2.jpg" },
  { id: "6", handle: "lalibela-sweatshirt", title: "Lalibela Sweatshirt", price: 68, image: "/images/products/sweatshirt-1.jpg" },
  { id: "7", handle: "teff-grain-mug", title: "Teff Grain Mug", price: 18, image: "/images/products/mug-1.jpg" },
  { id: "8", handle: "coffee-ceremony-poster", title: "Coffee Ceremony Poster", price: 24, image: "/images/products/poster-1.jpg" },
];

function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">Shop All</h1>
          <p className="mt-2 text-muted-foreground">{products.length} products</p>
        </div>
        <Button variant="outline" className="gap-2 self-start">
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Sort
        </Button>
      </header>

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
