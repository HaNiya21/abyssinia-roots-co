import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout | Abyssinia Roots & Co." },
      { name: "description", content: "Secure checkout for handcrafted Ethiopian-inspired apparel from Abyssinia Roots & Co." },
      { property: "og:title", content: "Checkout | Abyssinia Roots & Co." },
      { property: "og:description", content: "Complete your order of embroidered Ethiopian-inspired apparel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const SHIPPING_FLAT: number = 0;
const TAX_RATE: number = 0;

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const placeOrder = useServerFn(createOrder);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = subtotal > 0 ? SHIPPING_FLAT : 0;
  const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shippingCost + taxAmount).toFixed(2));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    setSubmitting(true);
    try {
      const order = await placeOrder({
        data: {
          email: value("email"),
          shippingAddress: {
            firstName: value("firstName"),
            lastName: value("lastName"),
            address1: value("address1"),
            address2: value("address2"),
            city: value("city"),
            county: value("county"),
            postcode: value("postcode"),
            country: value("country"),
            phone: value("phone"),
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            title: item.title,
            variantTitle: item.variantTitle,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          subtotal,
          shippingCost,
          taxAmount,
          total,
          notes: value("notes") || undefined,
        },
      });

      clearCart();
      if ((order as any).fulfillment?.submitted) {
        toast.success("Order placed and sent to production");
      } else {
        toast.success("Order placed — we're finalising production details");
      }
      navigate({ to: "/account/orders/$orderId", params: { orderId: (order as any).id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place your order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Checkout</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <form className="lg:col-span-2 space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold">Contact</h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" name="firstName" required /></div>
                <div className="grid gap-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" name="lastName" required /></div>
                <div className="grid gap-2 sm:col-span-2"><Label htmlFor="address1">Address</Label><Input id="address1" name="address1" required /></div>
                <div className="grid gap-2 sm:col-span-2"><Label htmlFor="address2">Apartment, suite (optional)</Label><Input id="address2" name="address2" /></div>
                <div className="grid gap-2"><Label htmlFor="city">City</Label><Input id="city" name="city" required /></div>
                <div className="grid gap-2"><Label htmlFor="county">State / County</Label><Input id="county" name="county" /></div>
                <div className="grid gap-2"><Label htmlFor="postcode">Postal code</Label><Input id="postcode" name="postcode" required /></div>
                <div className="grid gap-2"><Label htmlFor="country">Country</Label><Input id="country" name="country" defaultValue="United Kingdom" required /></div>
              </div>
            </section>

            <section className="rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold">Order notes</h2>
              <Textarea id="notes" name="notes" className="mt-4" placeholder="Anything our makers should know?" />
            </section>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Placing order…" : "Place order"}
            </Button>
          </form>

          <div className="h-fit rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span>
                    {item.title}
                    {item.variantTitle ? ` — ${item.variantTitle}` : ""} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-3"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span></div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
