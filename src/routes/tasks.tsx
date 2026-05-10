import { useMemo, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { currentUserId } from "@/data/tasks";
import { useAppStore } from "@/store/appStore";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/tasks")({
  component: GuardedTasks,
});

function GuardedTasks() {
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return <TasksPage />;
}

function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const [mine, setMine] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, isAr } = useT();
  const filtered = useMemo(
    () => (mine ? tasks.filter((tk) => tk.assigneeId === currentUserId) : tasks),
    [mine, tasks],
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("tasks")}</h1>
            <p className="text-sm text-muted-foreground">
              {isAr ? "إدارة مهام المراجعة والتفتيش والمتابعة" : "Manage review, inspection and follow-up tasks"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={mine} onCheckedChange={setMine} />
              <span>{isAr ? "مهامي" : "My tasks"}</span>
            </label>
            <Button onClick={() => setOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              {isAr ? "إضافة مهمة" : "Add task"}
            </Button>
          </div>
        </div>
        <TaskBoard tasks={filtered} />
        <NewTaskDialog open={open} onOpenChange={setOpen} />
      </div>
      <Toaster position="top-center" />
    </AppShell>
  );
}
