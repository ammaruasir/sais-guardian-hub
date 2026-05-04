import { createFileRoute, Navigate } from "@tanstack/react-router";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useRole } from "@/context/RoleContext";

export const Route = createFileRoute("/portal/notifications")({
  component: PortalNotificationsPage,
});

function PortalNotificationsPage() {
  const { role } = useRole();
  if (role !== "company") return <Navigate to="/notifications" />;
  return <NotificationsList role="company" />;
}
