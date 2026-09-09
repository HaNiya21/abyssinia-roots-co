import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-and-conditions")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Abyssinia Roots & Co." },
      { name: "description", content: "Terms and conditions for Abyssinia Roots & Co." },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Terms & Conditions</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>Welcome to Abyssinia Roots & Co. By accessing or purchasing from our website, you agree to these terms.</p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Orders & Payment</h2>
          <p className="mt-2">All orders are subject to availability and confirmation of payment. Prices are listed in USD and do not include applicable taxes or duties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
          <p className="mt-2">All designs, images, logos, and content on this site are the property of Abyssinia Roots & Co. and may not be used without permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p className="mt-2">We are not liable for indirect, incidental, or consequential damages arising from the use of our site or products.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Changes</h2>
          <p className="mt-2">We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </div>
  );
}
