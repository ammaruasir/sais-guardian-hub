import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/appStore";
import type { Role } from "@/data/admin";
import { toast } from "sonner";

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role?: Role | null;
}) {
  const addRole = useAppStore((s) => s.addRole);
  const updateRole = useAppStore((s) => s.updateRole);
  const addAudit = useAppStore((s) => s.addAudit);

  const [nameAr, setNameAr] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setNameAr(role?.nameAr ?? "");
      setKey(role?.key ?? "");
      setDescription(role?.description ?? "");
    }
  }, [open, role]);

  const editing = !!role;

  const submit = () => {
    if (!nameAr || !key) {
      toast.error("يرجى تعبئة الاسم والمفتاح");
      return;
    }
    if (editing && role) {
      updateRole(role.key, { nameAr, description });
      addAudit({ user: "Admin User", type: "تعديل دور", description: `تعديل الدور ${nameAr}`, page: "admin/roles", level: "info" });
      toast.success("تم التحديث بنجاح ✓");
    } else {
      addRole({ nameAr, key: key.replace(/\s+/g, "_").toLowerCase(), description });
      addAudit({ user: "Admin User", type: "إنشاء دور", description: `إضافة دور جديد: ${nameAr}`, page: "admin/roles", level: "info" });
      toast.success("تم الإنشاء بنجاح ✓");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">{editing ? "تعديل الدور" : "إضافة دور جديد"}</DialogTitle>
          <DialogDescription className="text-right">
            عرّف اسم الدور ومفتاحه ووصفه ليتم استخدامه في مصفوفة الصلاحيات.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-right block mb-1.5">الاسم (عربي)</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="text-right" />
          </div>
          <div>
            <Label className="text-right block mb-1.5">المفتاح (إنجليزي)</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} disabled={editing} placeholder="role_key" />
          </div>
          <div>
            <Label className="text-right block mb-1.5">الوصف</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-right" />
          </div>
        </div>
        <DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
          <Button onClick={submit}>حفظ</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
