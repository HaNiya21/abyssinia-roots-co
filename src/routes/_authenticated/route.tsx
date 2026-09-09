import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCurrentUser = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => ({
    userId: context.userId,
    email: context.claims?.email as string | undefined,
  }));

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    try {
      const user = await getCurrentUser();
      return { user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
