import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface ProductCardProps {
  id?: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string;
  badge?: string;
}

export function ProductCard({
  handle,
  title,
  price,
  compareAtPrice,
  image,
  badge,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Link to="/products/$handle" params={{ handle }}>
          <img
            src={image ?? "/images/products/tee-1.jpg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {badge && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            {badge}
          </span>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWishlisted(!wishlisted)}
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`}
          />
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <Link
          to="/products/$handle"
          params={{ handle }}
          className="text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {title}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">${price.toFixed(2)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
