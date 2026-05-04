import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useRole } from "@/context/RoleContext";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { role } = useRole();
  if (role === "company") return <Navigate to="/portal/notifications" />;
  return (
    <AppShell>
      <NotificationsList role="sais" />
    </AppShell>
  );
}
