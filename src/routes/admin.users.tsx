import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { useRole } from "@/context/RoleContext";
import { NoAccess } from "@/components/common/NoAccess";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { hasPermission } = useRole();
  const { t, isAr } = useT();
  if (!hasPermission("users.view")) return <NoAccess />;
  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <header>
        <h1 className="text-2xl font-bold">{t("users_mgmt")}</h1>
        <p className="text-sm text-muted-foreground">
          {isAr ? "إدارة حسابات المستخدمين وصلاحياتهم" : "Manage user accounts and permissions"}
        </p>
      </header>
      <UsersTable />
    </div>
  );
}
