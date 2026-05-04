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
import logoUrl from "@/assets/logo.svg";

const saisNav = [
  { to: "/", icon: LayoutDashboard, ar: "لوحة المعلومات", en: "Dashboard" },
  { to: "/projects", icon: FolderKanban, ar: "المشاريع", en: "Projects" },
  { to: "/tasks", icon: ListTodo, ar: "المهام", en: "Tasks" },
  { to: "/companies", icon: Building2, ar: "المنشآت", en: "Companies" },
  { to: "/consultants", icon: UserCheck, ar: "الاستشاريون المعتمدون", en: "Consultants" },
  { to: "/reports", icon: BarChart3, ar: "التقارير", en: "Reports" },
  { to: "/notifications", icon: Bell, ar: "الإشعارات", en: "Notifications" },
];

const adminNav = [
  { to: "/admin/users", icon: Users, ar: "المستخدمون", en: "Users" },
  { to: "/admin/roles", icon: Shield, ar: "الصلاحيات والأدوار", en: "Roles & Permissions" },
  { to: "/admin/audit", icon: ShieldAlert, ar: "الأحداث الأمنية", en: "Security Events" },
  { to: "/admin/settings", icon: Settings, ar: "الإعدادات", en: "Settings" },
];

const companyNav = [
  { to: "/portal", icon: LayoutDashboard, ar: "لوحة المعلومات", en: "Dashboard" },
  { to: "/portal/projects", icon: FolderKanban, ar: "مشاريعنا", en: "Our Projects" },
  { to: "/portal/submissions/new", icon: PlusSquare, ar: "تقديم جديد", en: "New Submission" },
  { to: "/portal/requirements", icon: FileText, ar: "المتطلبات", en: "Requirements" },
  { to: "/portal/notifications", icon: Bell, ar: "الإشعارات", en: "Notifications" },
  { to: "/portal/help", icon: HelpCircle, ar: "المساعدة", en: "Help" },
];

export function AppSidebar() {
  const { role } = useRole();
  const items = role === "sais" ? saisNav : companyNav;
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            {role === "sais" ? "SA" : <Building2 className="h-5 w-5" />}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-bold text-sidebar-foreground">
              {role === "sais" ? "الهيئة العليا للأمن الصناعي" : "أرامكو السعودية"}
            </div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">
              {role === "sais" ? "SAIS Platform" : "بوابة المنشآت"}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "sais" ? "مركز الهيئة" : "بوابة المنشآت"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isHome = item.to === "/" || item.to === "/portal";
                const active = isHome ? path === item.to : path === item.to || path.startsWith(item.to + "/");
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.ar}>
                      <Link to={item.to} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.ar}</span>
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
            <SidebarGroupLabel>الإدارة</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => {
                  const active = path === item.to || path.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.ar}>
                        <Link to={item.to} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.ar}</span>
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
