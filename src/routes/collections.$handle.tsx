import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { getCollectionByHandle } from "@/lib/collections.functions";

export const Route = createFileRoute("/collections/$handle")({
  component: CollectionPage,
  loader: ({ params }) => getCollectionByHandle({ data: { handle: params.handle } }),
  head: () => ({
    meta: [
      { title: "Collection | Abyssinia Roots & Co." },
      { name: "description", content: "Explore curated Ethiopian-inspired products in this collection." },
      { property: "og:title", content: "Collection | Abyssinia Roots & Co." },
      { property: "og:description", content: "Explore curated Ethiopian-inspired products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const collectionImages: Record<string, string> = {
  apparel: "/images/collections/apparel.jpg",
  "hats-bags": "/images/collections/hats-bags.jpg",
  "home-living": "/images/collections/home-living.jpg",
  "amharic-collection": "/images/collections/amharic.jpg",
  "ethiopian-culture-gifts": "/images/collections/gifts.jpg",
};

type ProductRow = {
  id: string;
  title: string;
  handle: string;
  price: number;
  compare_at_price: number | null;
  product_images?: { url: string; position: number | null }[];
};

function CollectionPage() {
  const { handle } = Route.useParams();
  const collection = Route.useLoaderData() as any;

  const products: ProductRow[] = (collection?.product_collections ?? [])
    .map((pc: any) => pc.products)
    .filter(Boolean);

  const image =
    collection?.image_url ?? collectionImages[handle] ?? "/images/collections/apparel.jpg";

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <img src={image} alt={collection?.title ?? "Collection"} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-serif text-3xl font-semibold md:text-5xl">{collection?.title ?? "Collection"}</h1>
          {collection?.description && (
            <p className="mt-3 max-w-xl text-white/90">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        {products.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No products in this collection yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const img = [...(product.product_images ?? [])].sort(
                (a, b) => (a.position ?? 0) - (b.position ?? 0)
              )[0]?.url;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  handle={product.handle}
                  title={product.title}
                  price={Number(product.price)}
                  compareAtPrice={product.compare_at_price}
                  image={img}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
