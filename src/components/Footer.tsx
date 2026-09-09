import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Newsletter } from "./Newsletter";

const footerLinks = {
  shop: [
    { label: "Shop All", to: "/shop" },
    { label: "Apparel", to: "/collections/apparel" },
    { label: "Hats & Bags", to: "/collections/hats-bags" },
    { label: "Home & Living", to: "/collections/home-living" },
    { label: "Amharic Collection", to: "/collections/amharic-collection" },
    { label: "Ethiopian Culture & Gifts", to: "/collections/ethiopian-culture-gifts" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ],
  support: [
    { label: "Track Your Order", to: "/order-status" },
    { label: "Shipping & Returns", to: "/shipping-returns" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-coffee text-coffee-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Abyssinia Roots & Co.
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-coffee-foreground/80">
              Modern designs inspired by Ethiopian culture, language, history,
              and the beauty of our roots. Premium apparel, accessories, and home
              goods for those who carry heritage forward.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-coffee-foreground/10 p-2 transition-colors hover:bg-coffee-foreground/20"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-coffee-foreground/10 p-2 transition-colors hover:bg-coffee-foreground/20"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="rounded-full bg-coffee-foreground/10 p-2 transition-colors hover:bg-coffee-foreground/20"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-coffee-foreground/90">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-coffee-foreground/70 transition-colors hover:text-coffee-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-coffee-foreground/90">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-coffee-foreground/70 transition-colors hover:text-coffee-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-coffee-foreground/90">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-coffee-foreground/70 transition-colors hover:text-coffee-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-coffee-foreground/10 pt-8">
          <Newsletter variant="dark" />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-coffee-foreground/10 pt-8 text-xs text-coffee-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Abyssinia Roots & Co. All rights reserved.</p>
          <p>Rooted in Heritage. Designed for Today.</p>
        </div>
      </div>
    </footer>
  );
}
