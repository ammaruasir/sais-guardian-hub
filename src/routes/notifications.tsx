import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useRole } from "@/context/RoleContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t } = useT();
  usePageTitle(t("notifications") + " — SAIS");
  const { role } = useRole();
  if (role === "company") return <Navigate to="/portal/notifications" />;
  return (
    <AppShell>
      <NotificationsList role="sais" />
    </AppShell>
  );
}
