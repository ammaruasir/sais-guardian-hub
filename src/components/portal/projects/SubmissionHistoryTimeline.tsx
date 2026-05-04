import { FileText } from "lucide-react";
import type { Submission } from "@/data/submissions";
import { stageLabel, reviewers } from "@/data";
import { StatusChip } from "@/components/projects/Badges";

const subStatusMap = {
  approved: "approved",
  under_review: "under_review",
  additional_docs: "additional_docs",
  rejected: "rejected",
  pending_final: "pending_final",
} as const;

export function SubmissionHistoryTimeline({ items }: { items: Submission[] }) {
  const sorted = [...items].sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
  return (
    <div className="relative">
      <div className="absolute right-4 top-2 bottom-2 w-px bg-border" />
      <ul className="space-y-5">
        {sorted.map((s) => {
          const reviewer = reviewers.find((r) => r.id === s.reviewerId);
          return (
            <li key={s.id} className="relative pr-12">
              <div className="absolute right-2 top-3 h-5 w-5 rounded-full border-2 border-primary bg-card" />
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">المرحلة {s.stage} — {stageLabel[s.stage].ar}</div>
                  <StatusChip s={subStatusMap[s.status] as never} />
                </div>
                <div className="mt-1 num text-xs text-muted-foreground">تاريخ التقديم: {s.submittedAt}</div>
                <div className="mt-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1.5">المستندات المُقدّمة</div>
                  <ul className="space-y-1">
                    {s.documents.map((d) => (
                      <li key={d.name} className="flex items-center gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{d.name}</span>
                        <span className="num text-muted-foreground">· {d.size}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {s.comments && (
                  <div className="mt-3 rounded-md border-r-2 border-secondary bg-muted/40 px-3 py-2 text-xs">
                    <div className="font-semibold text-secondary">{reviewer?.nameAr ?? "المراجع"}</div>
                    <div className="mt-0.5 text-foreground/80">{s.comments}</div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
