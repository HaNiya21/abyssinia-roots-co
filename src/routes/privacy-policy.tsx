import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Abyssinia Roots & Co." },
      { name: "description", content: "Privacy policy for Abyssinia Roots & Co." },
    ],
  }),
});

function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>At Abyssinia Roots & Co., we respect your privacy and are committed to protecting your personal information.</p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p className="mt-2">We collect information you provide when placing an order, creating an account, or subscribing to our newsletter, including name, email, shipping address, and payment details.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">How We Use Information</h2>
          <p className="mt-2">We use your information to process orders, communicate with you, improve our products, and send marketing communications you have opted into.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p className="mt-2">We use cookies and similar technologies to enhance your browsing experience and analyze site traffic.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2">If you have questions about this policy, please contact us through our Contact page.</p>
        </section>
      </div>
    </div>
  );
}
