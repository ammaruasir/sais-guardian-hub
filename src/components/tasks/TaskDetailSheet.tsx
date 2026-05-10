import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import {
  type Task,
  type TaskComment,
  type TaskStatus,
  taskPriorityLabel,
  taskStatusLabel,
  taskTypeLabel,
} from "@/data/tasks";
import { reviewers } from "@/data";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";

export function TaskDetailSheet({
  task,
  open,
  onClose,
}: {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}) {
  const projects = useAppStore((s) => s.projects);
  const requests = useAppStore((s) => s.requests);
  const updateTask = useAppStore((s) => s.updateTask);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const [status, setStatus] = useState<TaskStatus>("new");
  const [assignee, setAssignee] = useState<string>("");
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setAssignee(task.assigneeId);
      setComments(task.comments ?? []);
      setDraft("");
    }
  }, [task]);

  if (!task) return null;
  const project = projects.find((p) => p.id === task.projectId);
  const prio = taskPriorityLabel[task.priority];

  const addComment = () => {
    if (!draft.trim()) return;
    setComments([...comments, { by: "أنت", text: draft.trim(), ts: "الآن" }]);
    setDraft("");
    toast.success("تمت إضافة التعليق");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-end">{task.titleAr}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={prio.cls}>
              {prio.ar}
            </Badge>
            <Badge variant="outline">{taskTypeLabel[task.type]}</Badge>
            <Badge variant="outline" className="num">
              {task.dueDate}
            </Badge>
          </div>

          {task.descriptionAr && (
            <div className="rounded-md bg-muted p-3 text-sm">{task.descriptionAr}</div>
          )}

          {project && (
            <div className="text-sm">
              <span className="text-muted-foreground">المشروع: </span>
              <Link
                to="/projects/$id"
                params={{ id: project.id }}
                className="text-secondary hover:underline"
              >
                {project.nameAr}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">الحالة</label>
              <Select
                value={status}
                onValueChange={(v) => {
                  const ns = v as TaskStatus;
                  setStatus(ns);
                  if (task) {
                    updateTaskStatus(task.id, ns);
                    toast.success("تم تحديث الحالة");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(taskStatusLabel) as TaskStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {taskStatusLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">المسؤول</label>
              <Select
                value={assignee}
                onValueChange={(v) => {
                  setAssignee(v);
                  if (task) updateTask(task.id, { assigneeId: v });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reviewers.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">التعليقات</h4>
            <div className="space-y-2">
              {comments.map((c, i) => (
                <div key={i} className="rounded-md border bg-card p-2 text-sm">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{c.by}</span>
                    <span>{c.ts}</span>
                  </div>
                  <div>{c.text}</div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-xs text-muted-foreground">لا توجد تعليقات بعد</div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="إضافة تعليق…"
                rows={2}
              />
              <Button size="sm" onClick={addComment}>
                إضافة تعليق
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (!task) return;
                deleteTask(task.id);
                toast.success("تم حذف المهمة");
                onClose();
              }}
            >
              حذف المهمة
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
