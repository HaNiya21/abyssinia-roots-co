import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Star, Truck } from "lucide-react";

export const Route = createFileRoute("/products/$handle")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Product | Abyssinia Roots & Co." },
      { name: "description", content: "Product details for Abyssinia Roots & Co." },
      { property: "og:title", content: "Product | Abyssinia Roots & Co." },
      { property: "og:description", content: "Product details for Abyssinia Roots & Co." },
    ],
  }),
});

const productData: Record<string, {
  title: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
}> = {
  "habesha-heritage-tee": {
    title: "Habesha Heritage Tee",
    price: 38,
    compareAtPrice: 45,
    description: "A premium cotton tee celebrating Ethiopian heritage with a subtle embroidered motif. Soft, breathable, and made to last.",
    images: ["/images/products/tee-1.jpg", "/images/products/tee-1-alt.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Earth", value: "#8B5A2B" }, { name: "Cream", value: "#F5F0E8" }, { name: "Charcoal", value: "#2D2D2D" }],
  },
};

const fallback = {
  title: "Abyssinia Roots Product",
  price: 38,
  description: "Premium Ethiopian-inspired product crafted with care.",
  images: ["/images/products/tee-1.jpg"],
  sizes: ["S", "M", "L", "XL"],
  colors: [{ name: "Earth", value: "#8B5A2B" }],
};

function ProductPage() {
  const { handle } = Route.useParams();
  const product = productData[handle] ?? fallback;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            <img src={activeImage} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img) => (
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

        {/* Details */}
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
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Colors */}
          <div className="mt-6">
            <span className="text-sm font-medium">Color: {selectedColor.name}</span>
            <div className="mt-2 flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`h-9 w-9 rounded-full border-2 ${selectedColor.name === color.name ? "border-primary" : "border-transparent"}`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <span className="text-sm font-medium">Size</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
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
            <Button size="lg" className="flex-1">
              Add to Cart — ${(product.price * quantity).toFixed(2)}
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
