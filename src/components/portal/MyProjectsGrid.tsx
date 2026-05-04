import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { projects, type Stage } from "@/data";
import { StatusChip, ClassificationBadge } from "@/components/projects/Badges";
import { cn } from "@/lib/utils";

function MiniStepper({ stage }: { stage: Stage }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map((n) => {
        const done = n < stage;
        const active = n === stage;
        return (
          <div key={n} className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                done && "bg-success",
                active && "ring-2 ring-secondary ring-offset-1 ring-offset-card bg-secondary",
                !done && !active && "bg-muted",
              )}
            />
            {n < 4 && <div className={cn("h-px w-4", n < stage ? "bg-success" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}

export function MyProjectsGrid() {
  const mine = projects.filter((p) => p.companyId === "aramco");
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">مشاريعنا</h2>
        <Link to="/portal/projects" className="text-xs text-secondary hover:underline inline-flex items-center gap-1">
          عرض الكل <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mine.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-background/40 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold leading-snug">{p.nameAr}</div>
              <ClassificationBadge c={p.classification} />
            </div>
            <div className="mt-3">
              <MiniStepper stage={p.stage} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <StatusChip s={p.status} />
              <div className="text-[11px] text-muted-foreground num">آخر تحديث: {p.submittedAt}</div>
            </div>
            <Link
              to="/portal/projects"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
            >
              عرض المشروع <ArrowLeft className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
