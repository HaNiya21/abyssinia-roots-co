import { createFileRoute, Link } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, ShieldCheck, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Abyssinia Roots & Co. | Premium Ethiopian-Inspired Lifestyle" },
      { name: "description", content: "Discover premium Ethiopian-inspired apparel, accessories, and home goods. Rooted in heritage, designed for today." },
      { property: "og:title", content: "Abyssinia Roots & Co. | Premium Ethiopian-Inspired Lifestyle" },
      { property: "og:description", content: "Discover premium Ethiopian-inspired apparel, accessories, and home goods." },
    ],
  }),
});

const collections = [
  { handle: "apparel", title: "Apparel", description: "Tees, hoodies & sweatshirts", image: "/images/collections/apparel.jpg" },
  { handle: "hats-bags", title: "Hats & Bags", description: "Caps, totes & accessories", image: "/images/collections/hats-bags.jpg" },
  { handle: "home-living", title: "Home & Living", description: "Mugs, posters & decor", image: "/images/collections/home-living.jpg" },
  { handle: "amharic-collection", title: "Amharic Collection", description: "Script & expression", image: "/images/collections/amharic.jpg" },
];

const featuredProducts = [
  { id: "1", handle: "gemed-jump-rope-tee", title: "ገመድ Jump Rope Tee", price: 24.99, image: "/images/products/jump-rope-tee.jpg", badge: "New" },
  { id: "2", handle: "wheel-toy-tee", title: "ተሽከርካሪ Wheel Toy Tee", price: 24.99, image: "/images/products/wheel-toy-tee.jpg", badge: "New" },
  { id: "3", handle: "clapping-game-tee", title: "ጨዋታ Clapping Game Tee", price: 24.99, image: "/images/products/clapping-game-tee.jpg" },
  { id: "4", handle: "biy-marbles-tee", title: "ብይ Marbles Tee", price: 24.99, image: "/images/products/kids-marbles-tee.jpg" },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <img
          src="/images/hero.jpg"
          alt="Abyssinia Roots & Co. hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-medium uppercase tracking-widest text-gold">New Collection</p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
                Rooted in Heritage. <br /> Designed for Today.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/90">
                Premium apparel, accessories, and home goods inspired by Ethiopian culture,
                language, and the beauty of our roots.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2 bg-white text-foreground hover:bg-white/90">
                  <Link to="/shop">Shop Now <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white">
                  <Link to="/collections/$handle" params={{ handle: "amharic-collection" }}>Explore Amharic</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 px-4 py-8 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Free shipping over $50</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Secure checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Ethically produced</span>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">Shop by Collection</h2>
          <p className="mt-3 text-muted-foreground">Curated categories inspired by Ethiopian life and culture.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.handle} {...collection} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-semibold md:text-4xl">The Games We Grew Up With</h2>
              <p className="mt-3 text-muted-foreground">Ethiopian childhood games, hand-illustrated and printed on tees and totes.</p>
            </div>
            <Button asChild variant="outline"><Link to="/shop">View all</Link></Button>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Story banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-2xl bg-coffee text-coffee-foreground md:grid-cols-2">
          <img
            src="/images/collections/gifts.jpg"
            alt="Ethiopian coffee ceremony"
            className="h-80 w-full object-cover md:h-full"
          />
          <div className="p-8 md:p-12">
            <p className="text-sm font-medium uppercase tracking-widest text-gold">Our Heritage</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">Culture Woven Into Every Thread</h2>
            <p className="mt-4 leading-relaxed text-coffee-foreground/80">
              From the Ethiopian highlands to the streets of the world, our designs carry symbols,
              colors, and stories that connect us to home. Each piece is a quiet celebration of
              identity, resilience, and beauty.
            </p>
            <Button asChild className="mt-8 gap-2 bg-white text-foreground hover:bg-white/90">
              <Link to="/about">Read Our Story <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
