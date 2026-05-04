import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { StagePipeline } from "@/components/dashboard/StagePipeline";
import { SectorDonut } from "@/components/dashboard/SectorDonut";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { OverdueTable } from "@/components/dashboard/OverdueTable";
import { useRole } from "@/context/RoleContext";

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
    return <CompanyPlaceholder />;
  }
  return <SaisDashboard />;
}

function SaisDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">لوحة معلومات الهيئة</h1>
          <p className="text-sm text-muted-foreground">نظرة شاملة على المشاريع والمراجعات والامتثال</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          آخر تحديث: قبل دقيقتين
        </div>
      </div>

      <KpiCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StagePipeline />
        </div>
        <SectorDonut />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverdueTable />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}

function CompanyPlaceholder() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 text-center">
      <div className="text-lg font-semibold">بوابة المنشآت</div>
      <p className="max-w-md text-sm text-muted-foreground">
        ستتوفر بوابة المنشآت في المرحلة 4 من البناء. بدّل الدور إلى «مركز الهيئة» لاستعراض لوحة المعلومات الحالية.
      </p>
    </div>
  );
}
