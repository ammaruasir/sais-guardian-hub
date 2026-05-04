import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/appStore";
import { departments, type AdminUser } from "@/data/admin";
import { PasswordRequirements, checkPassword } from "./PasswordRequirements";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user?: AdminUser | null;
};

export function UserFormDialog({ open, onOpenChange, user }: Props) {
  const { currentUser } = useRole();
  const roles = useAppStore((s) => s.roles);
  const addUser = useAppStore((s) => s.addUser);
  const updateUser = useAppStore((s) => s.updateUser);
  const addAudit = useAppStore((s) => s.addAudit);

  const [nameAr, setNameAr] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [roleKey, setRoleKey] = useState(roles[0]?.key ?? "viewer");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (open) {
      setNameAr(user?.nameAr ?? "");
      setEmail(user?.email ?? "");
      setDepartment(user?.department ?? departments[0]);
      setRoleKey(user?.roleKey ?? roles[0]?.key ?? "viewer");
      setActive(user?.active ?? true);
      setPassword("");
      setShowPwd(false);
    }
  }, [open, user, roles]);

  const editing = !!user;
  const pwdOk = (() => {
    if (editing && !password) return true;
    const r = checkPassword(password);
    return r.length && r.upper && r.lower && r.number && r.special;
  })();
  const valid = nameAr && /\S+@\S+\.\S+/.test(email) && department && roleKey && pwdOk;

  const submit = () => {
    if (!valid) {
      toast.error("يرجى إكمال جميع الحقول وتحقيق متطلبات كلمة المرور");
      return;
    }
    if (editing && user) {
      updateUser(user.id, { nameAr, email, department, roleKey, active });
      addAudit({
        user: currentUser.name,
        type: "تعديل مستخدم",
        description: `تعديل بيانات ${nameAr}`,
        page: "admin/users",
        level: "info",
      });
      toast.success("تم التحديث بنجاح ✓");
    } else {
      addUser({ nameAr, email, department, roleKey, active });
      addAudit({
        user: currentUser.name,
        type: "إنشاء مستخدم",
        description: `إضافة مستخدم جديد: ${nameAr}`,
        page: "admin/users",
        level: "info",
      });
      toast.success("تم الإنشاء بنجاح ✓");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-end">
            {editing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
          </DialogTitle>
          <DialogDescription className="text-end">
            {editing
              ? "قم بتحديث بيانات المستخدم."
              : "أدخل بيانات المستخدم الجديد وحدد دوره في النظام."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-end block">الاسم الكامل</Label>
            <Input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="text-end"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-end block">البريد الإلكتروني</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@sais.gov.sa"
              type="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-end block">الإدارة</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-end block">
              {editing ? "كلمة المرور (اختياري)" : "كلمة المرور الجديدة"}
            </Label>
            <div className="relative">
              <Input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute start-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {(password || !editing) && <PasswordRequirements password={password} />}
          </div>
          <div className="space-y-1.5">
            <Label className="text-end block">الدور الوظيفي</Label>
            <Select value={roleKey} onValueChange={setRoleKey}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {r.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Switch checked={active} onCheckedChange={setActive} />
            <div className="text-end">
              <div className="text-sm font-medium">حالة الحساب</div>
              <p className="text-xs text-muted-foreground">
                {active ? "نشط — يمكن للمستخدم تسجيل الدخول" : "غير نشط — تم تعطيل الحساب"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
          <Button onClick={submit}>حفظ المستخدم</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
