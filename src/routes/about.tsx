import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Abyssinia Roots & Co." },
      { name: "description", content: "Learn the story behind Abyssinia Roots & Co. — a premium Ethiopian-inspired lifestyle brand." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Our Story</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Abyssinia Roots & Co. was born from a simple belief: heritage should be worn with pride,
        and tradition can live beautifully in the modern world. Inspired by Ethiopia&apos;s rich
        history, language, coffee culture, and landscapes, we create apparel, accessories, and
        home goods that honor where we come from while embracing contemporary design.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Every piece is thoughtfully designed — from Amharic script details to earth-toned palettes
        drawn from the Ethiopian highlands. We partner with ethical producers and fulfillment
        services to bring these designs to a global community that values culture, quality, and
        meaning.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[
          { title: "Heritage", text: "Designs inspired by Ethiopian history, art, and identity." },
          { title: "Quality", text: "Premium materials and finishes made for everyday wear." },
          { title: "Community", text: "Built for the diaspora and anyone who carries roots forward." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border p-6">
            <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
