import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  unfulfilled: { label: "Not sent to production", variant: "outline" },
  submitted: { label: "Sent to production", variant: "secondary" },
  submission_failed: { label: "Production error", variant: "destructive" },
  in_production: { label: "In production", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function FulfillmentBadge({ status }: { status: string | null | undefined }) {
  const key = (status ?? "unfulfilled").toLowerCase();
  const entry = LABELS[key] ?? { label: status ?? "Unknown", variant: "outline" as const };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
