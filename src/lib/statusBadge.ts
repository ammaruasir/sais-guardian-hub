import type { ProjectStatus } from "@/data";

export const statusBadgeClass: Record<ProjectStatus, string> = {
  approved: "bg-success/15 text-success border-success/30",
  under_review: "bg-secondary/15 text-secondary border-secondary/30",
  additional_docs: "bg-warning/20 text-warning-foreground border-warning/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  awaiting_submission: "bg-muted text-muted-foreground border-border",
  pending_final: "bg-warning/20 text-warning-foreground border-warning/30",
};

export const statusLabelAr: Record<ProjectStatus, string> = {
  approved: "معتمد",
  under_review: "قيد المراجعة",
  additional_docs: "مستندات إضافية",
  rejected: "مرفوض",
  awaiting_submission: "بانتظار التقديم",
  pending_final: "بانتظار الاعتماد النهائي",
};
