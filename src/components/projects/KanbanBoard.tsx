import type { Project, Stage } from "@/data";
import { stageLabel } from "@/data";
import { ProjectCard } from "./ProjectCard";

export function KanbanBoard({ projects }: { projects: Project[] }) {
  const stages: Stage[] = [1, 2, 3, 4];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stages.map((s) => {
        const items = projects.filter((p) => p.stage === s);
        return (
          <div key={s} className="flex min-h-[200px] flex-col rounded-xl border border-border bg-muted/40 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">المرحلة {s}</div>
                <div className="text-sm font-semibold">{stageLabel[s].ar}</div>
              </div>
              <span className="num rounded-md bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {items.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {items.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                  لا توجد مشاريع
                </div>
              ) : (
                items.map((p) => <ProjectCard key={p.id} p={p} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
