import { Calendar, FileWarning, CheckCircle2, Clock, MessageSquareQuote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Project } from "@/data";
import { stageLabel, reviewers } from "@/data";
import type { Submission } from "@/data/submissions";
import { StatusChip } from "@/components/projects/Badges";
import { Button } from "@/components/ui/button";

export function CurrentStatusCard({
  project,
  submission,
}: {
  project: Project;
  submission?: Submission;
}) {
  const reviewer = reviewers.find((r) => r.id === project.reviewerId);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">المرحلة الحالية</div>
            <div className="mt-1 text-xl font-bold">
              <span className="num">{project.stage}</span>. {stageLabel[project.stage].ar}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="num">تاريخ التقديم: {project.submittedAt}</span>
            </div>
          </div>
          <div className="scale-110 origin-top-right">
            <StatusChip s={project.status} />
          </div>
        </div>

        {submission?.comments && (
          <div className="mt-4 rounded-xl border-e-4 border-secondary bg-secondary/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <MessageSquareQuote className="h-4 w-4" />
              تعليق المراجع — {reviewer?.nameAr}
            </div>
            <p className="mt-2 text-sm leading-relaxed">{submission.comments}</p>
          </div>
        )}
      </div>

      {project.status === "additional_docs" && (
        <CalloutCard
          tone="warning"
          icon={FileWarning}
          title="مطلوب مستندات إضافية"
          body="قام المراجع بطلب تعديلات أو مستندات إضافية لاستكمال المراجعة."
          ctaLabel="إرفاق المستندات المطلوبة"
          ctaTo="/portal/submissions/new"
          ctaSearch={{ project: project.id, stage: project.stage }}
        />
      )}
      {project.status === "approved" && project.stage < 4 && (
        <CalloutCard
          tone="success"
          icon={CheckCircle2}
          title="تم اعتماد المرحلة"
          body="يمكنكم الآن تقديم متطلبات المرحلة التالية."
          ctaLabel={`بدء تقديم المرحلة ${project.stage + 1}`}
          ctaTo="/portal/submissions/new"
          ctaSearch={{ project: project.id, stage: project.stage + 1 }}
        />
      )}
      {project.status === "approved" && project.stage === 4 && (
        <CalloutCard
          tone="success"
          icon={CheckCircle2}
          title="المشروع مكتمل"
          body="تم اعتماد جميع المراحل بنجاح."
        />
      )}
      {project.status === "under_review" && (
        <CalloutCard
          tone="info"
          icon={Clock}
          title="التقديم قيد المراجعة"
          body="سيتم إشعاركم عند صدور القرار."
        />
      )}
      {project.status === "pending_final" && (
        <CalloutCard
          tone="warning"
          icon={Clock}
          title="بانتظار الاعتماد النهائي"
          body="جاري إعداد التوصية النهائية من قِبل لجنة الاعتماد."
        />
      )}
    </div>
  );
}

function CalloutCard({
  tone,
  icon: Icon,
  title,
  body,
  ctaLabel,
  ctaTo,
  ctaSearch,
}: {
  tone: "warning" | "success" | "info";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaTo?: "/portal/submissions/new";
  ctaSearch?: { project: string; stage: number };
}) {
  const cls =
    tone === "warning"
      ? "border-warning/40 bg-warning/10"
      : tone === "success"
        ? "border-success/40 bg-success/10"
        : "border-secondary/40 bg-secondary/10";
  return (
    <div className={`rounded-2xl border p-5 ${cls}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          {ctaLabel && ctaTo && (
            <Button asChild className="mt-3" size="sm">
              <Link to={ctaTo} search={ctaSearch as never}>
                {ctaLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
