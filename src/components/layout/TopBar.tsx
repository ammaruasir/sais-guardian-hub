import { Bell, ChevronLeft, Shield, Building2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { unreadCountForRole } from "@/data/notifications";

function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
      <button
        onClick={() => setRole("sais")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          role === "sais" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Shield className="h-4 w-4" />
        <span>مركز الهيئة</span>
      </button>
      <button
        onClick={() => setRole("company")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          role === "company" ? "bg-secondary text-secondary-foreground shadow" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4" />
        <span>بوابة المنشآت</span>
      </button>
    </div>
  );
}

function Breadcrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const map: Record<string, string> = {
    "/": "لوحة المعلومات",
    "/projects": "المشاريع",
    "/tasks": "المهام",
    "/companies": "المنشآت",
    "/consultants": "الاستشاريون المعتمدون",
    "/reports": "التقارير",
    "/notifications": "الإشعارات",
    "/portal": "لوحة المنشأة",
    "/portal/projects": "مشاريعنا",
    "/portal/submissions/new": "تقديم جديد",
    "/portal/requirements": "المتطلبات",
    "/portal/notifications": "الإشعارات",
    "/portal/help": "المساعدة",
  };
  let label = map[path];
  if (!label) {
    const seg = "/" + path.split("/").filter(Boolean)[0];
    label = map[seg] ?? "";
  }
  return (
    <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
      <Link to="/" className="hover:text-foreground">الرئيسية</Link>
      {label && (
        <>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">{label}</span>
        </>
      )}
    </div>
  );
}

export function TopBar() {
  const { role } = useRole();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="shrink-0" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-3">
        <RoleSwitcher />
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to={role === "sais" ? "/notifications" : "/portal/notifications"}>
            <Bell className="h-5 w-5" />
            {unreadCountForRole(role) > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                {unreadCountForRole(role)}
              </Badge>
            )}
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {role === "sais" ? "خ" : "أ"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-right md:block">
            <div className="text-xs font-semibold">{role === "sais" ? "م. خالد الحربي" : "أرامكو السعودية"}</div>
            <div className="text-[11px] text-muted-foreground">{role === "sais" ? "مراجع أمني أول" : "مدير الامتثال"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
