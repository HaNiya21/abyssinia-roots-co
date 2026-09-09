import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Shopping Cart | Abyssinia Roots & Co." },
      { name: "description", content: "Review your Abyssinia Roots & Co. cart and proceed to checkout." },
    ],
  }),
});

interface CartItem {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

const initialItems: CartItem[] = [
  { id: "1", title: "Habesha Heritage Tee", variant: "Earth / M", price: 38, quantity: 1, image: "/images/products/tee-1.jpg" },
  { id: "2", title: "Amharic Script Cap", variant: "Black / One Size", price: 32, quantity: 2, image: "/images/products/cap-1.jpg" },
];

function CartPage() {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border p-10 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border border-border p-4">
                <img src={item.image} alt={item.title} className="h-24 w-24 rounded-md object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-border">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 hover:bg-accent"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 hover:bg-accent"><Plus className="h-4 w-4" /></button>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{subtotal >= 50 ? "Free" : "$5.00"}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>Calculated at checkout</span></div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Estimated total</span>
                <span>${(subtotal + (subtotal >= 50 ? 0 : 5)).toFixed(2)}</span>
              </div>
            </div>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
