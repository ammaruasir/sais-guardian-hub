import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/appStore";
import { type Consultant, type ConsultantStatus, type Specialization, specializationLabel, consultantStatusLabel } from "@/data/consultants";
import { toast } from "sonner";

export function ConsultantFormDialog({
  open, onOpenChange, initial,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial?: Consultant | null }) {
  const addConsultant = useAppStore((s) => s.addConsultant);
  const updateConsultant = useAppStore((s) => s.updateConsultant);
  const addAudit = useAppStore((s) => s.addAudit);

  const [form, setForm] = useState<Consultant>({
    id: "", nameAr: "", nameEn: "", licenseNo: "", specializations: ["security"],
    activeProjects: 0, licenseExpiry: "2027-01-01", status: "active", phone: "", email: "",
  });
  useEffect(() => { if (initial) setForm(initial); else setForm({ id: "", nameAr: "", nameEn: "", licenseNo: "", specializations: ["security"], activeProjects: 0, licenseExpiry: "2027-01-01", status: "active", phone: "", email: "" }); }, [initial, open]);

  const toggleSpec = (s: Specialization) => {
    setForm((f) => ({ ...f, specializations: f.specializations.includes(s) ? f.specializations.filter((x) => x !== s) : [...f.specializations, s] }));
  };

  const submit = () => {
    if (!form.nameAr.trim() || !form.licenseNo.trim()) { toast.error("الاسم ورقم الترخيص مطلوبان"); return; }
    if (initial) {
      updateConsultant(initial.id, form);
      addAudit({ user: "Admin User", type: "تعديل استشاري", description: `تعديل ${form.nameAr}`, page: `consultants/${initial.id}`, level: "info" });
      toast.success("تم تحديث الاستشاري");
    } else {
      const id = `c${Date.now()}`;
      addConsultant({ ...form, id });
      addAudit({ user: "Admin User", type: "إنشاء استشاري", description: `إضافة ${form.nameAr}`, page: `consultants/${id}`, level: "info" });
      toast.success("تمت إضافة الاستشاري");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="text-end">{initial ? "تعديل استشاري" : "إضافة استشاري"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>الاسم بالعربية</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
          <div><Label>الاسم بالإنجليزية</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></div>
          <div><Label>رقم الترخيص</Label><Input value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} /></div>
          <div><Label>تاريخ الانتهاء</Label><Input type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} /></div>
          <div><Label>الهاتف</Label><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>البريد</Label><Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="col-span-2">
            <Label>التخصصات</Label>
            <div className="mt-2 flex gap-3">
              {(Object.keys(specializationLabel) as Specialization[]).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.specializations.includes(s)} onCheckedChange={() => toggleSpec(s)} />
                  {specializationLabel[s]}
                </label>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <Label>الحالة</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ConsultantStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.keys(consultantStatusLabel) as ConsultantStatus[]).map((s) => <SelectItem key={s} value={s}>{consultantStatusLabel[s].ar}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter><Button onClick={submit}>{initial ? "حفظ" : "إضافة"}</Button><Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
