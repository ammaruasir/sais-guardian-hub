import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskPriorityLabel, taskTypeLabel, type TaskPriority, type TaskType } from "@/data/tasks";
import { reviewers } from "@/data";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";

export function NewTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const projects = useAppStore((s) => s.projects);
  const addTask = useAppStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("review");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignee, setAssignee] = useState(reviewers[0].id);
  const [project, setProject] = useState(projects[0]?.id ?? "");
  const [due, setDue] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!title.trim()) {
      toast.error("الرجاء إدخال العنوان");
      return;
    }
    addTask({
      id: `t${Date.now()}`,
      titleAr: title.trim(),
      projectId: project,
      type,
      priority,
      assigneeId: assignee,
      status: "new",
      dueDate: due || new Date().toISOString().slice(0, 10),
      overdue: false,
      descriptionAr: desc,
      comments: [],
    });
    toast.success("تمت إضافة المهمة");
    onOpenChange(false);
    setTitle("");
    setDesc("");
    setDue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-end">إضافة مهمة جديدة</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">العنوان</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان المهمة"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">النوع</label>
              <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(taskTypeLabel) as TaskType[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {taskTypeLabel[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">الأولوية</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(taskPriorityLabel) as TaskPriority[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {taskPriorityLabel[k].ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">المسؤول</label>
              <Select value={assignee} onValueChange={setAssignee}>
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
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">المشروع</label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">تاريخ الاستحقاق</label>
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">الوصف</label>
            <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={submit}>إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
