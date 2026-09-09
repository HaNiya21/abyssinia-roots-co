import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ | Abyssinia Roots & Co." },
      { name: "description", content: "Frequently asked questions about orders, shipping, returns, and products." },
    ],
  }),
});

const faqs = [
  { q: "Where do you ship?", a: "We ship worldwide from our fulfillment partners. Shipping rates and delivery times are calculated at checkout." },
  { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for unworn items with original tags attached. Sale items are final sale." },
  { q: "How do I find my size?", a: "Each product page includes a detailed size guide. If you are between sizes, we generally recommend sizing up for a relaxed fit." },
  { q: "Are your products ethically made?", a: "Yes. We partner with responsible producers and fulfillment services that meet high labor and environmental standards." },
  { q: "Can I track my order?", a: "Once your order ships, you will receive an email with tracking information. You can also view order status in your account." },
];

function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
