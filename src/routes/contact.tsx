import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us | Abyssinia Roots & Co." },
      { name: "description", content: "Get in touch with Abyssinia Roots & Co. for support, partnerships, or questions." },
    ],
  }),
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Contact Us</h1>
      <p className="mt-4 text-muted-foreground">
        Have a question, collaboration idea, or need help with an order? We&apos;d love to hear from you.
      </p>
      <form className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" /></div>
          <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" /></div>
        </div>
        <div className="grid gap-2"><Label htmlFor="subject">Subject</Label><Input id="subject" /></div>
        <div className="grid gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} /></div>
        <Button type="submit" size="lg">Send Message</Button>
      </form>
    </div>
  );
}
