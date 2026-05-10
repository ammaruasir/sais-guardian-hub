import { createFileRoute, Navigate } from "@tanstack/react-router";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useRole } from "@/context/RoleContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/portal/notifications")({
  component: PortalNotificationsPage,
});

function PortalNotificationsPage() {
  const { t } = useT();
  usePageTitle(t("notifications") + " — " + t("company_portal"));
  const { role } = useRole();
  if (role !== "company") return <Navigate to="/notifications" />;
  return <NotificationsList role="company" />;
}
