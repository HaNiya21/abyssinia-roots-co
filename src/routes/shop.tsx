import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  loader: () => listProducts(),
  head: () => ({
    meta: [
      { title: "Shop All | Abyssinia Roots & Co." },
      { name: "description", content: "Browse the full Abyssinia Roots & Co. collection — apparel, accessories, home goods, and gifts inspired by Ethiopian culture." },
      { property: "og:title", content: "Shop All | Abyssinia Roots & Co." },
      { property: "og:description", content: "Browse the full Abyssinia Roots & Co. collection." },
    ],
  }),
});

type LoadedProduct = {
  id: string;
  title: string;
  handle: string;
  price: number | string | null;
  compare_at_price: number | string | null;
  product_images?: { url: string; position: number | null }[] | null;
};

function primaryImage(product: LoadedProduct): string {
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  return images[0]?.url ?? "/images/products/tee-1.jpg";
}

function ShopPage() {
  const products = (Route.useLoaderData() ?? []) as unknown as LoadedProduct[];

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
          <ProductCard
            key={product.id}
            id={product.id}
            handle={product.handle}
            title={product.title}
            price={Number(product.price ?? 0)}
            compareAtPrice={
              product.compare_at_price != null ? Number(product.compare_at_price) : null
            }

            image={primaryImage(product)}
          />
        ))}
      </div>
    </div>
  );
}

