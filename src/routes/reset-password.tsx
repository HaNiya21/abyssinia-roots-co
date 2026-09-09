import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password | Abyssinia Roots & Co." },
      { name: "description", content: "Set a new password for your Abyssinia Roots & Co. account." },
    ],
  }),
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.updateUser({ password });
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold">Set New Password</h1>
      {done ? (
        <p className="mt-8 text-center text-sm text-green-600 dark:text-green-400">Your password has been updated.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2"><Label htmlFor="password">New Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
        </form>
      )}
    </div>
  );
}
