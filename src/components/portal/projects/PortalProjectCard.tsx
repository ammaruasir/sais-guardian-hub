import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, FileWarning, Info } from "lucide-react";
import type { Project } from "@/data";
import { Button } from "@/components/ui/button";
import { ClassificationBadge, StatusChip } from "@/components/projects/Badges";
import { PortalStageStepper } from "./PortalStageStepper";
import { cn } from "@/lib/utils";

function nextAction(p: Project) {
  switch (p.status) {
    case "additional_docs":
      return { tone: "warning", icon: FileWarning, text: "مطلوب مستندات إضافية — يرجى الرد" };
    case "approved":
      return p.stage === 4
        ? { tone: "success", icon: CheckCircle2, text: "المشروع مكتمل ✅" }
        : {
            tone: "success",
            icon: CheckCircle2,
            text: "تم اعتماد المرحلة — يمكن الانتقال للمرحلة التالية",
          };
    case "pending_final":
      return { tone: "warning", icon: Clock, text: "بانتظار الاعتماد النهائي" };
    case "awaiting_submission":
      return { tone: "muted", icon: AlertTriangle, text: "بانتظار تقديم المرحلة" };
    case "rejected":
      return { tone: "destructive", icon: AlertTriangle, text: "تم رفض التقديم — يرجى المراجعة" };
    default:
      return { tone: "info", icon: Info, text: "التقديم قيد المراجعة لدى الهيئة" };
  }
}

const toneClass: Record<string, string> = {
  warning: "bg-warning/10 border-warning/30 text-warning-foreground",
  success: "bg-success/10 border-success/30 text-success",
  muted: "bg-muted border-border text-muted-foreground",
  destructive: "bg-destructive/10 border-destructive/20 text-destructive",
  info: "bg-secondary/10 border-secondary/30 text-secondary",
};

export function PortalProjectCard({ p }: { p: Project }) {
  const na = nextAction(p);
  const Icon = na.icon;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-lg leading-snug">{p.nameAr}</div>
          <div className="text-xs text-muted-foreground">{p.nameEn}</div>
          <div className="mt-1 text-sm text-muted-foreground">{p.facilityAr}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusChip s={p.status} />
          <ClassificationBadge c={p.classification} />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-background/50 p-3">
        <PortalStageStepper current={p.stage} compact />
      </div>

      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
          toneClass[na.tone],
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{na.text}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[11px] text-muted-foreground num">آخر تحديث: {p.submittedAt}</div>
        <Button asChild size="sm" variant="outline">
          <Link to="/portal/projects/$id" params={{ id: p.id }}>
            عرض التفاصيل <ArrowLeft className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
