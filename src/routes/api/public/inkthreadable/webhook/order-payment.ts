import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/inkthreadable/webhook/order-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleInkthreadableWebhook } = await import("@/lib/inkthreadable.server");
        return handleInkthreadableWebhook("order-payment", request);
      },
    },
  },
});
