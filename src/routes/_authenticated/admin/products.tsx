import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <Button>Add Product</Button>
      </div>
      <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        No products yet. Add your first product to get started.
      </div>
    </div>
  );
}
