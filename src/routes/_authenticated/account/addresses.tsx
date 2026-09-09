import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <Button size="sm">Add Address</Button>
      </div>
      <p className="mt-4 text-muted-foreground">No saved addresses.</p>
    </div>
  );
}
