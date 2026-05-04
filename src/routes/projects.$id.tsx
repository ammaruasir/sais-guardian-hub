import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { projects, companies } from "@/data";
import { getSubmissionsByProject } from "@/data/submissions";
import { getActivitiesByProject, getNotesByProject } from "@/data/notes";
import { StageStepper } from "@/components/projects/StageStepper";
import { SubmissionList } from "@/components/projects/SubmissionList";
import { RequirementsChecklist } from "@/components/projects/RequirementsChecklist";
import { ActivityTimeline } from "@/components/projects/ActivityTimeline";
import { InternalNotes } from "@/components/projects/InternalNotes";
import { SubmissionReviewSheet } from "@/components/projects/SubmissionReviewSheet";
import { ClassificationBadge, SectorBadge, StatusChip } from "@/components/projects/Badges";
import type { Submission } from "@/data/submissions";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/projects/$id")({
  component: ProjectDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        المشروع غير موجود.
      </div>
    </AppShell>
  ),
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const project = projects.find((p) => p.id === id);
  if (!project) throw notFound();
  const company = companies.find((c) => c.id === project.companyId);
  const subs = getSubmissionsByProject(id);
  const currentSub = subs.find((s) => s.stage === project.stage);
  const history = subs.filter((s) => s.id !== currentSub?.id);

  const [reviewing, setReviewing] = useState<Submission | null>(null);

  return (
    <AppShell>
      <div className="space-y-5">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/projects" className="hover:text-foreground">المشاريع</Link>
          <ChevronRight className="h-3 w-3 rotate-180" />
          <span className="text-foreground">{project.nameAr}</span>
        </nav>

        <header className="rounded-2xl border border-border bg-card p-5">
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
            <Button variant="outline" size="sm">تصدير ملف المشروع</Button>
          </div>
          <div className="mt-6">
            <StageStepper current={project.stage} />
          </div>
        </header>

        <Tabs defaultValue="submissions">
          <TabsList>
            <TabsTrigger value="submissions">التقديمات</TabsTrigger>
            <TabsTrigger value="requirements">المتطلبات</TabsTrigger>
            <TabsTrigger value="activity">سجل النشاط</TabsTrigger>
            <TabsTrigger value="notes">ملاحظات داخلية</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions" className="mt-4">
            <SubmissionList items={subs} onReview={setReviewing} />
          </TabsContent>
          <TabsContent value="requirements" className="mt-4">
            <RequirementsChecklist stage={project.stage} currentSubmission={currentSub} />
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <ActivityTimeline items={getActivitiesByProject(id)} />
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <InternalNotes initial={getNotesByProject(id)} />
          </TabsContent>
        </Tabs>
      </div>

      <SubmissionReviewSheet
        submission={reviewing}
        history={history}
        open={!!reviewing}
        onOpenChange={(v) => !v && setReviewing(null)}
      />
      <Toaster position="top-center" />
    </AppShell>
  );
}
