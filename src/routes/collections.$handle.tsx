import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/collections/$handle")({
  component: CollectionPage,
  head: () => ({
    meta: [
      { title: "Collection | Abyssinia Roots & Co." },
      { name: "description", content: "Explore curated Ethiopian-inspired products in this collection." },
      { property: "og:title", content: "Collection | Abyssinia Roots & Co." },
      { property: "og:description", content: "Explore curated Ethiopian-inspired products." },
    ],
  }),
});

const collections: Record<string, { title: string; description: string; image: string }> = {
  apparel: {
    title: "Apparel",
    description: "T-shirts, hoodies, sweatshirts, and jackets rooted in Ethiopian heritage.",
    image: "/images/collections/apparel.jpg",
  },
  "hats-bags": {
    title: "Hats & Bags",
    description: "Caps, totes, and accessories for everyday journeys.",
    image: "/images/collections/hats-bags.jpg",
  },
  "home-living": {
    title: "Home & Living",
    description: "Mugs, posters, and decor that bring Ethiopian warmth into your space.",
    image: "/images/collections/home-living.jpg",
  },
  "amharic-collection": {
    title: "Amharic Collection",
    description: "Modern streetwear featuring Amharic script and Ethiopian expressions.",
    image: "/images/collections/amharic.jpg",
  },
  "ethiopian-culture-gifts": {
    title: "Ethiopian Culture & Gifts",
    description: "Meaningful gifts inspired by Ethiopian traditions, history, and art.",
    image: "/images/collections/gifts.jpg",
  },
};

const products = [
  { id: "1", handle: "habesha-heritage-tee", title: "Habesha Heritage Tee", price: 38, compareAtPrice: 45, image: "/images/products/tee-1.jpg", badge: "Bestseller" },
  { id: "2", handle: "roots-coffee-hoodie", title: "Roots Coffee Hoodie", price: 72, image: "/images/products/hoodie-1.jpg" },
  { id: "3", handle: "amharic-script-cap", title: "Amharic Script Cap", price: 32, image: "/images/products/cap-1.jpg" },
  { id: "4", handle: "abyssinian-tote", title: "Abyssinian Tote", price: 28, image: "/images/products/tote-1.jpg" },
];

function CollectionPage() {
  const { handle } = Route.useParams();
  const collection = collections[handle] ?? {
    title: "Collection",
    description: "Discover our curated selection.",
    image: "/images/collections/apparel.jpg",
  };

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <img src={collection.image} alt={collection.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-serif text-3xl font-semibold md:text-5xl">{collection.title}</h1>
          <p className="mt-3 max-w-xl text-white/90">{collection.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">{products.length} products</p>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter & Sort
          </Button>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
