import { CheckCircle2, Circle, AlertCircle, ArrowLeft } from "lucide-react";
import type { AssignmentEntry } from "@/data/requests";
import { useAppStore } from "@/store/appStore";

export function AssignmentChain({ chain }: { chain: AssignmentEntry[] }) {
  const departments = useAppStore((s) => s.departments);
  const deptName = (k: string) => departments.find((d) => d.key === k)?.nameAr ?? k;

  return (
    <div className="md:overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-stretch md:min-w-max gap-2 p-2">
        {chain.map((e, i) => {
          const isLast = i === chain.length - 1;
          const isCurrent = isLast && !e.endedAt;
          const isCompleted = !!e.endedAt;
          const tone =
            e.action === "rejected"
              ? "border-destructive/50 bg-destructive/5"
              : e.action === "approved"
                ? "border-success/50 bg-success/5"
                : isCurrent
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20 animate-pulse"
                  : isCompleted
                    ? "border-border bg-card"
                    : "border-border bg-muted/30";
          return (
            <div key={e.id} className="flex flex-col md:flex-row md:items-center gap-2">
              <div className={`w-full md:min-w-[200px] md:w-auto rounded-lg border p-3 ${tone}`}>
                <div className="flex items-center gap-2 mb-2">
                  {e.action === "approved" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : e.action === "rejected" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Circle className="h-4 w-4 text-primary" />
                  )}
                  <div className="text-xs font-bold">{deptName(e.department)}</div>
                </div>
                <div className="text-xs text-foreground">{e.assigneeAr}</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {e.startedAt}{e.endedAt ? ` → ${e.endedAt}` : " — جارٍ"}
                </div>
                {e.noteAr && (
                  <div className="text-[11px] text-muted-foreground mt-2 line-clamp-2 border-t border-border/50 pt-1">
                    {e.noteAr}
                  </div>
                )}
              </div>
              {!isLast && <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0 rotate-90 md:rotate-0 self-center" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
