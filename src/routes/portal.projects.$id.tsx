import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { projects, companies, type Stage } from "@/data";
import { getSubmissionsByProject } from "@/data/submissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassificationBadge, SectorBadge, StatusChip } from "@/components/projects/Badges";
import { PortalStageStepper } from "@/components/portal/projects/PortalStageStepper";
import { CurrentStatusCard } from "@/components/portal/projects/CurrentStatusCard";
import { CompanyRequirementsList } from "@/components/portal/projects/CompanyRequirementsList";
import { SubmissionHistoryTimeline } from "@/components/portal/projects/SubmissionHistoryTimeline";
import { ConversationThread } from "@/components/portal/projects/ConversationThread";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/portal/projects/$id")({
  component: PortalProjectDetailPage,
  notFoundComponent: () => (
    <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      المشروع غير موجود.
    </div>
  ),
});

function PortalProjectDetailPage() {
  const { id } = Route.useParams();
  const project = projects.find((p) => p.id === id && p.companyId === "aramco");
  if (!project) throw notFound();
  const company = companies.find((c) => c.id === project.companyId);
  const subs = getSubmissionsByProject(project.id);
  const currentSub = subs.find((s) => s.stage === project.stage);

  const meta: Partial<Record<Stage, { approvedAt?: string; subLabel?: string }>> = {};
  for (const s of subs) {
    if (s.status === "approved") meta[s.stage] = { approvedAt: s.reviewedAt };
  }

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/portal/projects" className="hover:text-foreground">المشاريع</Link>
        <ChevronRight className="h-3 w-3 rotate-180" />
        <span className="text-foreground">{project.nameAr}</span>
      </nav>

      <header className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.nameAr}</h1>
            <p className="text-sm text-muted-foreground">{project.nameEn}</p>
            <p className="mt-1 text-sm">
              <span className="font-medium">{company?.nameAr}</span>
              <span className="text-muted-foreground"> • {project.facilityAr}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <SectorBadge s={project.sector} />
              <ClassificationBadge c={project.classification} />
              <StatusChip s={project.status} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <PortalStageStepper current={project.stage} meta={meta} />
        </div>
      </header>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">الحالة الحالية</TabsTrigger>
          <TabsTrigger value="requirements">المتطلبات والمستندات</TabsTrigger>
          <TabsTrigger value="history">سجل التقديمات</TabsTrigger>
          <TabsTrigger value="messages">المراسلات</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="mt-4">
          <CurrentStatusCard project={project} submission={currentSub} />
        </TabsContent>
        <TabsContent value="requirements" className="mt-4">
          <CompanyRequirementsList project={project} submissions={subs} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <SubmissionHistoryTimeline items={subs} />
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <ConversationThread projectId={project.id} />
        </TabsContent>
      </Tabs>
      <Toaster position="top-center" />
    </div>
  );
}
