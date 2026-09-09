import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { QueryClient } from "@tanstack/react-query";
import appCss from "@/styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Abyssinia Roots & Co. — premium Ethiopian-inspired apparel, accessories, and home goods. Rooted in heritage, designed for today." },
      { name: "theme-color", content: "#faf8f5" },
      { property: "og:site_name", content: "Abyssinia Roots & Co." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Abyssinia Roots & Co." },
      { property: "og:description", content: "Premium Ethiopian-inspired apparel, accessories, and home goods." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abyssinia Roots & Co." },
      { name: "twitter:description", content: "Premium Ethiopian-inspired apparel, accessories, and home goods." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="font-serif text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link to="/" className="mt-8 inline-flex rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Return home
      </Link>
    </div>
  ),
});

import { CartProvider } from "@/hooks/useCart";

function RootComponent() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </CartProvider>
  );
}
