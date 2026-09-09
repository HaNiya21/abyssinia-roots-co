import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  links: { label: string; to: string }[];
  onNavigate: () => void;
}

export function MobileNav({ links, onNavigate }: MobileNavProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <span className="font-serif text-lg font-semibold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onNavigate} aria-label="Close menu">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "bg-accent text-foreground font-semibold" }}
          >
            {link.label}
          </Link>
        ))}
        <hr className="my-2 border-border" />
        <Link
          to="/about"
          onClick={onNavigate}
          className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          About Us
        </Link>
        <Link
          to="/contact"
          onClick={onNavigate}
          className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          Contact
        </Link>
        <Link
          to="/faq"
          onClick={onNavigate}
          className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          FAQ
        </Link>
      </nav>
    </div>
  );
}
