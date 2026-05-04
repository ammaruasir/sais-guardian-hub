import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskDetailSheet } from "./TaskDetailSheet";
import { type Task, type TaskStatus, taskStatusLabel } from "@/data/tasks";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { Inbox } from "lucide-react";

const columns: TaskStatus[] = ["new", "in_progress", "waiting", "completed"];

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [active, setActive] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<TaskStatus | null>(null);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);

  const onDrop = (status: TaskStatus, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) {
      updateTaskStatus(id, status);
      toast.success(`تم نقل المهمة إلى: ${taskStatusLabel[status]}`);
    }
    setDraggingId(null);
    setHoverCol(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((status) => {
          const items = tasks.filter((t) => t.status === status);
          const isHover = hoverCol === status;
          return (
            <div
              key={status}
              onDragOver={(e) => { e.preventDefault(); setHoverCol(status); }}
              onDragLeave={() => setHoverCol((c) => (c === status ? null : c))}
              onDrop={(e) => onDrop(status, e)}
              className={`rounded-lg border bg-muted/30 p-3 transition ${isHover ? "border-dashed border-primary bg-primary/5" : ""}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold">{taskStatusLabel[status]}</h3>
                <span className="num rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.id); setDraggingId(t.id); }}
                    onDragEnd={() => setDraggingId(null)}
                    style={{ opacity: draggingId === t.id ? 0.5 : 1 }}
                  >
                    <TaskCard task={t} onClick={() => setActive(t)} />
                  </div>
                ))}
                {items.length === 0 && <EmptyState icon={Inbox} message="لا مهام" />}
              </div>
            </div>
          );
        })}
      </div>
      <TaskDetailSheet task={active} open={!!active} onClose={() => setActive(null)} />
    </>
  );
}
