import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { RequestsNeedingAction } from "@/components/dashboard/RequestsNeedingAction";
import { RequestsByStatusDonut } from "@/components/dashboard/RequestsByStatusDonut";
import { RequestsByDepartmentBar } from "@/components/dashboard/RequestsByDepartmentBar";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StagePipeline } from "@/components/dashboard/StagePipeline";
import { SectorDonut } from "@/components/dashboard/SectorDonut";
import { OverdueTable } from "@/components/dashboard/OverdueTable";
import { useRole } from "@/context/RoleContext";
import { useT } from "@/hooks/useT";
import { usePageTitle } from "@/hooks/usePageTitle";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell>
      <RoleAwareDashboard />
    </AppShell>
  );
}

function RoleAwareDashboard() {
  const { role } = useRole();
  if (role === "company") {
    return <Navigate to="/portal" />;
  }
  return <SaisDashboard />;
}

function SaisDashboard() {
  const { t, isAr } = useT();
  usePageTitle(t("dashboard") + " — SAIS");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAr ? "لوحة معلومات الهيئة" : "SAIS Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "نظرة شاملة على الطلبات والمراجعات والامتثال"
              : "An overview of requests, reviews, and compliance"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          {t("last_updated")}: {isAr ? "قبل دقيقتين" : "2 minutes ago"}
        </div>
      </div>

      <KpiCards />

      <RequestsNeedingAction />

      <div className="grid gap-6 lg:grid-cols-2">
        <RequestsByStatusDonut />
        <RequestsByDepartmentBar />
      </div>

      <ActivityFeed />

      <details className="group rounded-2xl border border-border bg-card">
        <summary className="cursor-pointer list-none p-4 text-sm font-semibold flex items-center justify-between">
          <span>{isAr ? "عرض إحصائيات المشاريع (الكلاسيكية)" : "Show project statistics (classic)"}</span>
          <span className="text-xs text-muted-foreground group-open:hidden">
            {isAr ? "عرض" : "Show"}
          </span>
          <span className="text-xs text-muted-foreground hidden group-open:inline">
            {isAr ? "إخفاء" : "Hide"}
          </span>
        </summary>
        <div className="p-4 pt-0 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2"><StagePipeline /></div>
            <SectorDonut />
          </div>
          <OverdueTable />
        </div>
      </details>
    </div>
  );
}
