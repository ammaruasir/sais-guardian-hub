import { createFileRoute } from "@tanstack/react-router";
import { WelcomeBanner } from "@/components/portal/WelcomeBanner";
import { ActionRequiredCards } from "@/components/portal/ActionRequiredCards";
import { MyProjectsGrid } from "@/components/portal/MyProjectsGrid";
import { RecentUpdatesTimeline } from "@/components/portal/RecentUpdatesTimeline";
import { ComplianceScoreWidget } from "@/components/portal/ComplianceScoreWidget";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});

function PortalDashboard() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <ActionRequiredCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyProjectsGrid />
        </div>
        <div className="space-y-6">
          <ComplianceScoreWidget />
          <RecentUpdatesTimeline />
        </div>
      </div>
    </div>
  );
}
