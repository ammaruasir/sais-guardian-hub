import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { getActivitiesByProject, getNotesByProject } from "@/data/notes";
import { StageStepper } from "@/components/projects/StageStepper";
import { SubmissionList } from "@/components/projects/SubmissionList";
import { RequirementsChecklist } from "@/components/projects/RequirementsChecklist";
import { ActivityTimeline } from "@/components/projects/ActivityTimeline";
import { InternalNotes } from "@/components/projects/InternalNotes";
import { SubmissionReviewSheet } from "@/components/projects/SubmissionReviewSheet";
import { ClassificationBadge, SectorBadge, StatusChip } from "@/components/projects/Badges";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { Submission } from "@/data/submissions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const project = useAppStore((s) => s.projects.find((p) => p.id === id));
  const company = useAppStore((s) => project ? s.companies.find((c) => c.id === project.companyId) : undefined);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const addAudit = useAppStore((s) => s.addAudit);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [reviewing, setReviewing] = useState<Submission | null>(null);

  const allSubs = useAppStore((s) => s.submissions);
  if (!project) throw notFound();
  const subs = allSubs.filter((s) => s.projectId === id);
  const currentSub = subs.find((s) => s.stage === project.stage);
  const history = subs.filter((s) => s.id !== currentSub?.id);

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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Pencil className="ml-1 h-4 w-4" />تعديل</Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirmDel(true)}><Trash2 className="ml-1 h-4 w-4" />حذف</Button>
              <Button variant="outline" size="sm">تصدير ملف المشروع</Button>
            </div>
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
      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} initial={project} />
      <ConfirmDialog
        open={confirmDel}
        onOpenChange={setConfirmDel}
        title="حذف مشروع"
        description={`هل أنت متأكد من حذف "${project.nameAr}"؟`}
        confirmText="حذف"
        onConfirm={() => {
          deleteProject(project.id);
          addAudit({ user: "Admin User", type: "حذف مشروع", description: `حذف ${project.nameAr}`, page: `projects/${project.id}`, level: "warning" });
          toast.success("تم حذف المشروع");
          navigate({ to: "/projects" });
        }}
      />
      <Toaster position="top-center" />
    </AppShell>
  );
}
