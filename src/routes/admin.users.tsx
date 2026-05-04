import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { useRole } from "@/context/RoleContext";
import { NoAccess } from "@/components/common/NoAccess";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { hasPermission } = useRole();
  if (!hasPermission("users.view")) return <NoAccess />;
  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <header>
        <h1 className="text-2xl font-bold">المستخدمون</h1>
        <p className="text-sm text-muted-foreground">إدارة حسابات المستخدمين وصلاحياتهم</p>
      </header>
      <UsersTable />
    </div>
  );
}
