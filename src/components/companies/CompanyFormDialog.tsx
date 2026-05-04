import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/appStore";
import { sectorLabel, type Company, type Sector } from "@/data";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";

export function CompanyFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Company | null;
}) {
  const { currentUser } = useRole();
  const addCompany = useAppStore((s) => s.addCompany);
  const updateCompany = useAppStore((s) => s.updateCompany);
  const addAudit = useAppStore((s) => s.addAudit);

  const [form, setForm] = useState<Company>({
    id: "",
    nameAr: "",
    nameEn: "",
    sector: "industrial",
    facilitiesCount: 1,
    activeProjects: 0,
    compliance: "review",
  });
  useEffect(() => {
    if (initial) setForm(initial);
    else
      setForm({
        id: "",
        nameAr: "",
        nameEn: "",
        sector: "industrial",
        facilitiesCount: 1,
        activeProjects: 0,
        compliance: "review",
      });
  }, [initial, open]);

  const submit = () => {
    if (!form.nameAr.trim()) {
      toast.error("الاسم بالعربية مطلوب");
      return;
    }
    if (initial) {
      updateCompany(initial.id, form);
      addAudit({
        user: currentUser.name,
        type: "تعديل منشأة",
        description: `تعديل ${form.nameAr}`,
        page: `companies/${initial.id}`,
        level: "info",
      });
      toast.success("تم تحديث المنشأة");
    } else {
      const id = `co${Date.now()}`;
      addCompany({ ...form, id });
      addAudit({
        user: currentUser.name,
        type: "إنشاء منشأة",
        description: `إضافة ${form.nameAr}`,
        page: `companies/${id}`,
        level: "info",
      });
      toast.success("تمت إضافة المنشأة");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-end">{initial ? "تعديل منشأة" : "إضافة منشأة"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>الاسم بالعربية</Label>
            <Input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            />
          </div>
          <div>
            <Label>الاسم بالإنجليزية</Label>
            <Input
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            />
          </div>
          <div>
            <Label>القطاع</Label>
            <Select
              value={form.sector}
              onValueChange={(v) => setForm({ ...form, sector: v as Sector })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(sectorLabel) as Sector[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {sectorLabel[s].ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>عدد المنشآت</Label>
            <Input
              type="number"
              value={form.facilitiesCount}
              onChange={(e) => setForm({ ...form, facilitiesCount: Number(e.target.value) })}
            />
          </div>
          <div className="col-span-2">
            <Label>حالة الامتثال</Label>
            <Select
              value={form.compliance}
              onValueChange={(v) => setForm({ ...form, compliance: v as Company["compliance"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliant">ممتثل</SelectItem>
                <SelectItem value="review">قيد المراجعة</SelectItem>
                <SelectItem value="non_compliant">غير ممتثل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>{initial ? "حفظ" : "إضافة"}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
