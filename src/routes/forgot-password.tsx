import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Forgot Password | Abyssinia Roots & Co." },
      { name: "description", content: "Reset your Abyssinia Roots & Co. password." },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold">Reset Password</h1>
      <p className="mt-2 text-center text-muted-foreground">Enter your email and we&apos;ll send you a reset link</p>
      {sent ? (
        <p className="mt-8 text-center text-sm text-green-600 dark:text-green-400">Check your email for the reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
        </form>
      )}
    </div>
  );
}
