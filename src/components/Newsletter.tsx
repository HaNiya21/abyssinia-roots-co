import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterProps {
  variant?: "light" | "dark";
}

export function Newsletter({ variant = "light" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  const isDark = variant === "dark";

  return (
    <div className={isDark ? "text-coffee-foreground" : "text-foreground"}>
      <h3 className="text-lg font-semibold">Join the Roots family</h3>
      <p className={`mt-2 text-sm ${isDark ? "text-coffee-foreground/70" : "text-muted-foreground"}`}>
        Get early access to new drops, Amharic designs, and cultural stories.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={
            isDark
              ? "border-coffee-foreground/20 bg-coffee-foreground/10 text-coffee-foreground placeholder:text-coffee-foreground/50"
              : ""
          }
        />
        <Button type="submit" className="shrink-0">
          Subscribe
        </Button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          Thank you for subscribing!
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-destructive">Please enter a valid email.</p>
      )}
    </div>
  );
}
