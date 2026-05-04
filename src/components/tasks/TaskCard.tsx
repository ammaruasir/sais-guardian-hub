import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ClipboardCheck, FileSearch, MessageSquare } from "lucide-react";
import { type Task, taskPriorityLabel, taskTypeLabel } from "@/data/tasks";
import { reviewers } from "@/data";
import { useAppStore } from "@/store/appStore";

const typeIcon = {
  review: FileSearch,
  inspection: ClipboardCheck,
  followup: MessageSquare,
};

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const projects = useAppStore((s) => s.projects);
  const project = projects.find((p) => p.id === task.projectId);
  const assignee = reviewers.find((r) => r.id === task.assigneeId);
  const Icon = typeIcon[task.type];
  const prio = taskPriorityLabel[task.priority];

  return (
    <Card className="cursor-pointer p-3 transition hover:shadow-md" onClick={onClick}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span>{taskTypeLabel[task.type]}</span>
        </div>
        <Badge variant="outline" className={prio.cls}>
          {prio.ar}
        </Badge>
      </div>
      <div className="mb-2 text-sm font-semibold leading-snug">{task.titleAr}</div>
      {project && (
        <Link
          to="/projects/$id"
          params={{ id: project.id }}
          onClick={(e) => e.stopPropagation()}
          className="mb-3 block truncate text-xs text-secondary hover:underline"
        >
          {project.nameAr}
        </Link>
      )}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {assignee?.initials ?? "?"}
          </div>
          <span className="truncate text-muted-foreground">
            {assignee?.nameAr.replace("م. ", "")}
          </span>
        </div>
        <div
          className={`num flex items-center gap-1 ${task.overdue ? "text-destructive font-semibold" : "text-muted-foreground"}`}
        >
          {task.overdue && <AlertCircle className="h-3.5 w-3.5" />}
          {task.dueDate}
        </div>
      </div>
    </Card>
  );
}
