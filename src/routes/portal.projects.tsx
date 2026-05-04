import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { PortalProjectCard } from "@/components/portal/projects/PortalProjectCard";

export const Route = createFileRoute("/portal/projects")({
  component: PortalProjectsPage,
});

function PortalProjectsPage() {
  const projects = useAppStore((s) => s.projects);
  const mine = projects.filter((p) => p.companyId === "aramco");
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">مشاريعنا</h1>
        <p className="mt-1 text-sm text-muted-foreground">جميع المشاريع المسجلة لدى الهيئة العليا للأمن الصناعي</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {mine.map((p) => (
          <PortalProjectCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
