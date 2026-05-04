import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { RoleCard } from "@/components/admin/roles/RoleCard";
import { RoleFormDialog } from "@/components/admin/roles/RoleFormDialog";
import { PermissionsMatrix } from "@/components/admin/roles/PermissionsMatrix";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { Role } from "@/data/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRolesPage,
});

function AdminRolesPage() {
  const roles = useAppStore((s) => s.roles);
  const deleteRole = useAppStore((s) => s.deleteRole);
  const addAudit = useAppStore((s) => s.addAudit);
  const [tab, setTab] = useState("matrix");
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [delRole, setDelRole] = useState<Role | null>(null);

  const handleDelete = (r: Role) => {
    deleteRole(r.key);
    addAudit({ user: "Admin User", type: "حذف دور", description: `حذف الدور ${r.nameAr}`, page: "admin/roles", level: "warning" });
    toast.success("تم الحذف بنجاح ✓");
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <header>
        <h1 className="text-2xl font-bold">الصلاحيات والأدوار</h1>
        <p className="text-sm text-muted-foreground">إدارة مصفوفة الصلاحيات للأدوار المختلفة في النظام</p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="matrix">مصفوفة الصلاحيات</TabsTrigger>
          <TabsTrigger value="roles">الأدوار</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">مصفوفة الصلاحيات</h2>
            <p className="text-sm text-muted-foreground">حدد الصلاحيات المتاحة لكل دور وظيفي</p>
          </div>
          <PermissionsMatrix />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">إدارة الأدوار</h2>
              <p className="text-sm text-muted-foreground">إنشاء وتعديل أدوار المستخدمين</p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة دور
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((r) => (
              <RoleCard
                key={r.key}
                role={r}
                highlight={r.key === "super_admin"}
                onShowPermissions={() => setTab("matrix")}
                onEdit={() => setEditRole(r)}
                onDelete={() => setDelRole(r)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <RoleFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <RoleFormDialog open={!!editRole} onOpenChange={(v) => !v && setEditRole(null)} role={editRole} />
      <ConfirmDialog
        open={!!delRole}
        onOpenChange={(v) => !v && setDelRole(null)}
        title="تأكيد حذف الدور"
        description={delRole ? `سيتم حذف الدور "${delRole.nameAr}" وإزالة عموده من مصفوفة الصلاحيات.` : ""}
        confirmText="حذف"
        onConfirm={() => delRole && handleDelete(delRole)}
      />
    </div>
  );
}
