import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Star, Truck } from "lucide-react";
import { getProductByHandle } from "@/lib/products.functions";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: () => getProductByHandle({ data: { handle } }),
  });

export const Route = createFileRoute("/products/$handle")({
  component: ProductPage,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQuery(params.handle)),
  head: () => ({
    meta: [
      { title: "Product | Abyssinia Roots & Co." },
      { name: "description", content: "Product details for Abyssinia Roots & Co." },
      { property: "og:title", content: "Product | Abyssinia Roots & Co." },
      { property: "og:description", content: "Product details for Abyssinia Roots & Co." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(handle));
  const { addItem } = useCart();

  const images = useMemo(() => {
    const list = (product.product_images ?? [])
      .slice()
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((i: any) => i.url as string);
    return list.length ? list : ["/images/products/tee-1.jpg"];
  }, [product]);

  const variants = useMemo(
    () => (product.product_variants ?? []).slice() as any[],
    [product]
  );

  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const [activeImage, setActiveImage] = useState(images[0]);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = Number(variant?.price ?? product.price ?? 0);
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : undefined;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      variantId: variant?.id,
      title: product.title,
      variantTitle: variant?.title,
      price,
      quantity,
      image: activeImage,
    });
    toast.success(`${product.title} added to your cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            <img src={activeImage} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 ${activeImage === img ? "border-primary" : "border-transparent"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-serif text-3xl font-semibold md:text-4xl">{product.title}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">${price.toFixed(2)}</span>
            {compareAt && (
              <span className="text-lg text-muted-foreground line-through">
                ${compareAt.toFixed(2)}
              </span>
            )}
          </div>
          {product.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {variants.length > 1 && (
            <div className="mt-6">
              <span className="text-sm font-medium">Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${variant?.id === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3 hover:bg-accent"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3 hover:bg-accent"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAdd}>
              Add to Cart — ${(price * quantity).toFixed(2)}
            </Button>
            <Button size="lg" variant="outline" aria-label="Add to wishlist">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            Free shipping on orders over $50
          </div>
        </div>
      </div>
    </div>
  );
}
