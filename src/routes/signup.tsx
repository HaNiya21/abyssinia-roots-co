import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/account" });
  },
  head: () => ({
    meta: [
      { title: "Create Account | Abyssinia Roots & Co." },
      { name: "description", content: "Create your Abyssinia Roots & Co. account." },
    ],
  }),
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/account";
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold">Create Account</h1>
      <p className="mt-2 text-center text-muted-foreground">Join the Abyssinia Roots & Co. family</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
      </form>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
