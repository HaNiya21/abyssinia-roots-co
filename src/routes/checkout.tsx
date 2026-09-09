import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout | Abyssinia Roots & Co." },
      { name: "description", content: "Secure checkout for Abyssinia Roots & Co." },
    ],
  }),
});

function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form className="lg:col-span-2 space-y-8">
          <section className="rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" /></div>
              <div className="grid gap-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" /></div>
              <div className="grid gap-2"><Label htmlFor="city">City</Label><Input id="city" /></div>
              <div className="grid gap-2"><Label htmlFor="postal">Postal code</Label><Input id="postal" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="country">Country</Label><Input id="country" defaultValue="United States" /></div>
            </div>
          </section>
          <Button type="submit" size="lg" className="w-full sm:w-auto">Continue to Payment</Button>
        </form>

        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Habesha Heritage Tee × 1</span><span>$38.00</span></div>
            <div className="flex justify-between"><span>Amharic Script Cap × 2</span><span>$64.00</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>$102.00</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>$102.00</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
