import { createFileRoute } from "@tanstack/react-router";
import { WelcomeBanner } from "@/components/portal/WelcomeBanner";
import { ActionRequiredCards } from "@/components/portal/ActionRequiredCards";
import { ActiveRequestsSection } from "@/components/portal/ActiveRequestsSection";
import { RecentUpdatesTimeline } from "@/components/portal/RecentUpdatesTimeline";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});

function PortalDashboard() {
  const { t } = useT();
  usePageTitle(t("dashboard") + " — " + t("company_portal"));
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <ActionRequiredCards />
      <ActiveRequestsSection />
      <RecentUpdatesTimeline />
    </div>
  );
}
