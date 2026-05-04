import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import type { AdminUser } from "@/data/admin";
import { Mail, Building, Shield, Activity } from "lucide-react";

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const roles = useAppStore((s) => s.roles);
  const audit = useAppStore((s) => s.audit);
  if (!user) return null;
  const role = roles.find((r) => r.key === user.roleKey);
  const recent = audit.filter((a) => a.user === user.nameAr).slice(0, 8);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-right">تفاصيل المستخدم</SheetTitle>
          <SheetDescription className="text-right">عرض البيانات والنشاط الأخير</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user.nameAr.replace(/^[أم]\.\s*/, "").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <div className="font-bold text-base">{user.nameAr}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <Badge variant={user.active ? "default" : "secondary"} className="mt-1">
                {user.active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> الدور</span>
              <span className="font-medium">{role?.nameAr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> الإدارة</span>
              <span className="font-medium">{user.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> البريد</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> الأحداث الأمنية</span>
              <span className="font-medium">{user.events}</span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">آخر النشاط</div>
            {recent.length === 0 ? (
              <div className="text-xs text-muted-foreground">لا يوجد نشاط مسجل</div>
            ) : (
              <ul className="space-y-2">
                {recent.map((e) => (
                  <li key={e.id} className="rounded-md border p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{e.type}</span>
                      <span className="text-muted-foreground">{new Date(e.ts).toLocaleString("ar-SA")}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">{e.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
