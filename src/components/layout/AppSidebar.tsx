import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Building2,
  UserCheck,
  BarChart3,
  Bell,
  FileText,
  HelpCircle,
  PlusSquare,
  Users,
  Shield,
  ShieldAlert,
  Settings,
  Inbox,
  FileStack,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useRole } from "@/context/RoleContext";
import { useT } from "@/hooks/useT";
import type { TKey } from "@/i18n/translations";
import logoUrl from "@/assets/logo.svg";
import saisLogo from "@/assets/sais-logo.png";

const saisNav: { to: string; icon: typeof LayoutDashboard; key: TKey }[] = [
  { to: "/", icon: LayoutDashboard, key: "dashboard" },
  { to: "/requests", icon: Inbox, key: "incoming_requests" },
  { to: "/projects", icon: FolderKanban, key: "projects" },
  { to: "/tasks", icon: ListTodo, key: "tasks" },
  { to: "/companies", icon: Building2, key: "companies" },
  { to: "/consultants", icon: UserCheck, key: "consultants" },
  { to: "/reports", icon: BarChart3, key: "reports" },
  { to: "/notifications", icon: Bell, key: "notifications" },
];

const adminNav: { to: string; icon: typeof LayoutDashboard; key: TKey }[] = [
  { to: "/admin/users", icon: Users, key: "users_mgmt" },
  { to: "/admin/roles", icon: Shield, key: "roles_permissions" },
  { to: "/admin/audit", icon: ShieldAlert, key: "security_events" },
  { to: "/admin/settings", icon: Settings, key: "settings" },
];

const companyNav: { to: string; icon: typeof LayoutDashboard; key: TKey }[] = [
  { to: "/portal", icon: LayoutDashboard, key: "dashboard" },
  { to: "/portal/requests", icon: FileStack, key: "my_requests" },
  { to: "/portal/requirements", icon: FileText, key: "requirements" },
  { to: "/portal/notifications", icon: Bell, key: "notifications" },
  { to: "/portal/help", icon: HelpCircle, key: "help" },
];

export function AppSidebar() {
  const { role } = useRole();
  const { t, isAr } = useT();
  const items = role === "sais" ? saisNav : companyNav;
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        {role === "sais" ? (
          <>
            <div className="flex w-full items-center justify-center rounded-lg bg-white p-2 group-data-[collapsible=icon]:hidden">
              <img
                src={saisLogo}
                alt={t("sais_name")}
                className="h-12 w-full object-contain"
              />
            </div>
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1 group-data-[collapsible=icon]:flex">
              <img src={logoUrl} alt="SAIS" className="h-full w-full object-contain" />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-bold text-sidebar-foreground">
                {isAr ? "أرامكو السعودية" : "Saudi Aramco"}
              </div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">
                {t("company_portal")}
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "sais" ? t("sais_hub") : t("company_portal")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isHome = item.to === "/" || item.to === "/portal";
                const active = isHome
                  ? path === item.to
                  : path === item.to || path.startsWith(item.to + "/");
                const label = t(item.key);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={label}>
                      <Link to={item.to} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {role === "sais" && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("administration")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => {
                  const active = path === item.to || path.startsWith(item.to + "/");
                  const label = t(item.key);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={label}>
                        <Link to={item.to} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 text-[11px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
        © 2026 SAIS
      </SidebarFooter>
    </Sidebar>
  );
}
