import { useState } from "react";
import type { Project, Stage } from "@/data";
import { stageLabel } from "@/data";
import { ProjectCard } from "./ProjectCard";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { FolderKanban } from "lucide-react";

export function KanbanBoard({ projects }: { projects: Project[] }) {
  const stages: Stage[] = [1, 2, 3, 4];
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverStage, setHoverStage] = useState<Stage | null>(null);
  const updateProjectStatus = useAppStore((s) => s.updateProjectStatus);

  const onDrop = (s: Stage, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) {
      const project = projects.find((p) => p.id === id);
      if (project) {
        updateProjectStatus(id, project.status, s);
        toast.success(`تم نقل المشروع إلى: ${stageLabel[s].ar}`);
      }
    }
    setDraggingId(null);
    setHoverStage(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stages.map((s) => {
        const items = projects.filter((p) => p.stage === s);
        const isHover = hoverStage === s;
        return (
          <div
            key={s}
            onDragOver={(e) => {
              e.preventDefault();
              setHoverStage(s);
            }}
            onDragLeave={() => setHoverStage((c) => (c === s ? null : c))}
            onDrop={(e) => onDrop(s, e)}
            className={`flex min-h-[200px] flex-col rounded-xl border border-border bg-muted/40 p-3 transition ${isHover ? "border-dashed border-primary bg-primary/5" : ""}`}
          >
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
                <EmptyState icon={FolderKanban} message="لا توجد مشاريع في هذه المرحلة" />
              ) : (
                items.map((p) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", p.id);
                      setDraggingId(p.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    style={{ opacity: draggingId === p.id ? 0.5 : 1 }}
                  >
                    <ProjectCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
