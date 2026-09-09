import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-returns")({
  component: ShippingReturnsPage,
  head: () => ({
    meta: [
      { title: "Shipping & Returns | Abyssinia Roots & Co." },
      { name: "description", content: "Shipping and returns policy for Abyssinia Roots & Co." },
    ],
  }),
});

function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Shipping & Returns</h1>
      <div className="mt-8 space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Shipping</h2>
          <p className="mt-2">We offer standard and expedited shipping options. Orders over $50 ship free within the United States. International orders may be subject to customs duties and taxes.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Processing Time</h2>
          <p className="mt-2">Most orders are processed within 2–5 business days. Made-to-order or print-on-demand items may take slightly longer.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Returns</h2>
          <p className="mt-2">Items may be returned within 30 days of delivery in unworn condition with original tags. To start a return, contact us with your order number.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Exchanges</h2>
          <p className="mt-2">Exchanges are available for size or color when stock allows. We recommend placing a new order and returning the original for faster processing.</p>
        </section>
      </div>
    </div>
  );
}
