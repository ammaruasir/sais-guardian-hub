import { useState, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAppStore } from "@/store/appStore";
import type { AdminUser } from "@/data/admin";
import { UserFormDialog } from "./UserFormDialog";
import { UserDetailSheet } from "./UserDetailSheet";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

export function UsersTable() {
  const users = useAppStore((s) => s.users);
  const roles = useAppStore((s) => s.roles);
  const deleteUser = useAppStore((s) => s.deleteUser);
  const addAudit = useAppStore((s) => s.addAudit);

  const [q, setQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [delUser, setDelUser] = useState<AdminUser | null>(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.nameAr.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term),
    );
  }, [q, users]);

  const handleDelete = (u: AdminUser) => {
    if (u.roleKey === "super_admin") {
      const remaining = users.filter((x) => x.roleKey === "super_admin").length;
      if (remaining <= 1) {
        toast.error("لا يمكن حذف آخر مدير نظام أعلى");
        return;
      }
    }
    deleteUser(u.id);
    addAudit({ user: "Admin User", type: "حذف مستخدم", description: `حذف المستخدم ${u.nameAr}`, page: "admin/users", level: "warning" });
    toast.success("تم الحذف بنجاح ✓");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث في النظام..."
            className="pe-10 text-end"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-end">المستخدم</TableHead>
              <TableHead className="text-end">الدور الوظيفي</TableHead>
              <TableHead className="text-end">الإدارة</TableHead>
              <TableHead className="text-end">الحالة</TableHead>
              <TableHead className="text-end">الأحداث الأمنية</TableHead>
              <TableHead className="text-end">سجل الدخول</TableHead>
              <TableHead className="text-end">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => {
              const role = roles.find((r) => r.key === u.roleKey);
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {u.nameAr.replace(/^[أم]\.\s*/, "").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{u.nameAr}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{role?.nameAr ?? "—"}</TableCell>
                  <TableCell className="text-sm">{u.department}</TableCell>
                  <TableCell>
                    {u.active ? (
                      <Badge className="bg-success/15 text-success border border-success/30 hover:bg-success/15">نشط</Badge>
                    ) : (
                      <Badge variant="secondary">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.events === 0 ? (
                      <span className="text-sm text-muted-foreground">0</span>
                    ) : (
                      <Badge className="bg-warning/15 text-warning-foreground border border-warning/30 hover:bg-warning/15 gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {u.events}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setViewUser(u)}
                      className="text-sm text-primary hover:underline"
                    >
                      عرض
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewUser(u)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditUser(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDelUser(u)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <UserFormDialog open={!!editUser} onOpenChange={(v) => !v && setEditUser(null)} user={editUser} />
      <UserDetailSheet user={viewUser} open={!!viewUser} onOpenChange={(v) => !v && setViewUser(null)} />
      <ConfirmDialog
        open={!!delUser}
        onOpenChange={(v) => !v && setDelUser(null)}
        title="تأكيد الحذف"
        description={delUser ? `هل أنت متأكد من حذف المستخدم "${delUser.nameAr}"؟ لا يمكن التراجع.` : ""}
        confirmText="حذف"
        onConfirm={() => delUser && handleDelete(delUser)}
      />
    </div>
  );
}
