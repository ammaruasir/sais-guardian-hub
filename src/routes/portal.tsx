import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useRole } from "@/context/RoleContext";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  const { role } = useRole();
  if (role !== "company") return <Navigate to="/" />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
