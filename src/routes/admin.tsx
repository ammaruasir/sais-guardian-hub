import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useRole } from "@/context/RoleContext";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
