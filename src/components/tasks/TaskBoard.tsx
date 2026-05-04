import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskDetailSheet } from "./TaskDetailSheet";
import { type Task, type TaskStatus, taskStatusLabel } from "@/data/tasks";

const columns: TaskStatus[] = ["new", "in_progress", "waiting", "completed"];

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [active, setActive] = useState<Task | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((status) => {
          const items = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold">{taskStatusLabel[status]}</h3>
                <span className="num rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <TaskCard key={t.id} task={t} onClick={() => setActive(t)} />
                ))}
                {items.length === 0 && (
                  <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">لا مهام</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <TaskDetailSheet task={active} open={!!active} onClose={() => setActive(null)} />
    </>
  );
}
