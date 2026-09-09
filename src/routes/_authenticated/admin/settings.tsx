import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Store Settings</h2>
      <div className="rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Configure store details, fulfillment sources, and integrations.</p>
        <Button className="mt-4" variant="outline">Save Settings</Button>
      </div>
    </div>
  );
}
