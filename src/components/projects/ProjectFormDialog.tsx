import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/appStore";
import { sectorLabel, type Project, type Sector, type Classification, type Stage, classificationLabel } from "@/data";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Project | null;
};

export function ProjectFormDialog({ open, onOpenChange, initial }: Props) {
  const companies = useAppStore((s) => s.companies);
  const users = useAppStore((s) => s.users);
  const reviewersFromUsers = users.filter((u) => u.department.includes("المراجعات") || u.department.includes("السلامة"));
  const addProject = useAppStore((s) => s.addProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const addAudit = useAppStore((s) => s.addAudit);

  const [form, setForm] = useState<Project>({
    id: "", nameAr: "", nameEn: "", companyId: companies[0]?.id ?? "",
    facilityAr: "", sector: "petroleum", classification: "medium", stage: 1 as Stage,
    status: "awaiting_submission", reviewerId: "khaled", daysInStage: 0, submittedAt: "—",
  });

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm((f) => ({ ...f, id: "", nameAr: "", nameEn: "", facilityAr: "" }));
  }, [initial, open]);

  const submit = () => {
    if (!form.nameAr.trim()) { toast.error("الاسم بالعربية مطلوب"); return; }
    if (initial) {
      updateProject(initial.id, form);
      addAudit({ user: "Admin User", type: "تعديل مشروع", description: `تعديل مشروع ${form.nameAr}`, page: `projects/${initial.id}`, level: "info" });
      toast.success("تم تحديث المشروع");
    } else {
      const id = `p${Date.now()}`;
      addProject({ ...form, id });
      addAudit({ user: "Admin User", type: "إنشاء مشروع", description: `إضافة مشروع ${form.nameAr}`, page: `projects/${id}`, level: "info" });
      toast.success("تمت إضافة المشروع");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-2xl">
        <DialogHeader><DialogTitle className="text-end">{initial ? "تعديل مشروع" : "إضافة مشروع"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>الاسم بالعربية</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
          <div><Label>الاسم بالإنجليزية</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></div>
          <div>
            <Label>المنشأة</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>اسم الموقع</Label><Input value={form.facilityAr} onChange={(e) => setForm({ ...form, facilityAr: e.target.value })} /></div>
          <div>
            <Label>القطاع</Label>
            <Select value={form.sector} onValueChange={(v) => setForm({ ...form, sector: v as Sector })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.keys(sectorLabel) as Sector[]).map((s) => <SelectItem key={s} value={s}>{sectorLabel[s].ar}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>التصنيف</Label>
            <Select value={form.classification} onValueChange={(v) => setForm({ ...form, classification: v as Classification })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.keys(classificationLabel) as Classification[]).map((s) => <SelectItem key={s} value={s}>{classificationLabel[s].ar}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>المراجع المسؤول</Label>
            <Select value={form.reviewerId} onValueChange={(v) => setForm({ ...form, reviewerId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="khaled">م. خالد الحربي</SelectItem>
                <SelectItem value="fahad">م. فهد القحطاني</SelectItem>
                <SelectItem value="noura">م. نورة الشمري</SelectItem>
                <SelectItem value="abdullah">م. عبدالله الدوسري</SelectItem>
                {reviewersFromUsers.map((u) => <SelectItem key={u.id} value={u.id}>{u.nameAr}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter><Button onClick={submit}>{initial ? "حفظ" : "إضافة"}</Button><Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
