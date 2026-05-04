import { CheckCircle2, Circle } from "lucide-react";
import { requirementsByStage } from "@/data/requirements";
import type { Stage } from "@/data";
import type { Submission } from "@/data/submissions";

export function RequirementsChecklist({ stage, currentSubmission }: { stage: Stage; currentSubmission?: Submission }) {
  const reqs = requirementsByStage[stage];
  const submittedDocs = currentSubmission?.documents.length ?? 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">متطلبات المرحلة {stage}</h3>
        <span className="num text-xs text-muted-foreground">
          {Math.min(submittedDocs, reqs.length)}/{reqs.length}
        </span>
      </div>
      <ul className="space-y-2">
        {reqs.map((r, i) => {
          const ok = i < submittedDocs;
          return (
            <li key={r.code} className="flex items-center gap-3 rounded-md border border-border/60 bg-background px-3 py-2">
              {ok ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
              )}
              <div className="flex-1">
                <div className="text-sm">{r.labelAr}</div>
              </div>
              <span className="num rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {r.code}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
