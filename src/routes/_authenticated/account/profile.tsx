import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <form className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" /></div>
        <div className="grid gap-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" /></div>
        <div className="grid gap-2 sm:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" /></div>
        <div className="sm:col-span-2"><Button>Save Changes</Button></div>
      </form>
    </div>
  );
}
