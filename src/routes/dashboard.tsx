import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/features/dashboard/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · CareerPilot" }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}