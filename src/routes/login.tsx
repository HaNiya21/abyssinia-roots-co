import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/account" });
  },
  head: () => ({
    meta: [
      { title: "Login | Abyssinia Roots & Co." },
      { name: "description", content: "Sign in to your Abyssinia Roots & Co. account." },
    ],
  }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    let destination = "/account";
    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();
      if (profile?.is_admin) destination = "/admin";
    }
    setLoading(false);
    window.location.href = destination;
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold">Welcome Back</h1>
      <p className="mt-2 text-center text-muted-foreground">Sign in to your Abyssinia Roots & Co. account</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account? <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
