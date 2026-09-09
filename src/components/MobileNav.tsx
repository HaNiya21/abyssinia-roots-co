import { Link } from "@tanstack/react-router";
import { X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileNavProps {
  links: { label: string; to: string }[];
  onNavigate: () => void;
  user?: SupabaseUser | null;
  onSignOut?: () => void | Promise<void>;
}

export function MobileNav({ links, onNavigate, user, onSignOut }: MobileNavProps) {
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
        <hr className="my-2 border-border" />
        {user ? (
          <>
            <Link
              to="/account"
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              <User className="h-4 w-4" /> My Account
            </Link>
            <button
              onClick={() => {
                onSignOut?.();
                onNavigate();
              }}
              className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onNavigate}
            className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            Sign In
          </Link>
        )}
      </nav>
    </div>
  );
}
