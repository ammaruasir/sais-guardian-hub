import { Bell, ChevronLeft, Shield, Building2, LogOut, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/hooks/useT";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import type { TKey } from "@/i18n/translations";

function RoleSwitcher() {
  const { role, setRole } = useRole();
  const { t } = useT();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
      <button
        onClick={() => setRole("sais")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          role === "sais"
            ? "bg-primary text-primary-foreground shadow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Shield className="h-4 w-4" />
        <span>{t("sais_hub")}</span>
      </button>
      <button
        onClick={() => setRole("company")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          role === "company"
            ? "bg-secondary text-secondary-foreground shadow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Building2 className="h-4 w-4" />
        <span>{t("company_portal")}</span>
      </button>
    </div>
  );
}

function Breadcrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useT();
  const map: Record<string, TKey> = {
    "/": "dashboard",
    "/requests": "incoming_requests",
    "/projects": "projects",
    "/tasks": "tasks",
    "/companies": "companies",
    "/consultants": "consultants",
    "/reports": "reports",
    "/notifications": "notifications",
    "/portal": "dashboard",
    "/portal/requests": "my_requests",
    "/portal/requirements": "requirements",
    "/portal/notifications": "notifications",
    "/portal/help": "help",
    "/admin": "administration",
    "/admin/users": "users_mgmt",
    "/admin/roles": "roles_permissions",
    "/admin/audit": "security_events",
    "/admin/settings": "settings",
  };
  let key = map[path];
  if (!key) {
    const seg = "/" + path.split("/").filter(Boolean)[0];
    key = map[seg];
  }
  const label = key ? t(key) : "";
  return (
    <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
      <Link to="/" className="hover:text-foreground">
        {t("home")}
      </Link>
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
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useT();
  const unread = useAppStore(
    (s) =>
      s.notifications.filter((n) => !n.read && (n.forRole === role || n.forRole === "both")).length,
  );
  const logoutMock = useAppStore((s) => s.logoutMock);
  const handleSignOut = async () => {
    await signOut();
    logoutMock();
    toast.success(t("toast_logout"));
    navigate({ to: "/login" });
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="shrink-0" />
      <Breadcrumbs />
      <div className="ms-auto flex items-center gap-3">
        <RoleSwitcher />
        <LanguageToggleButton />
        <ThemeToggleButton />
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to={role === "sais" ? "/notifications" : "/portal/notifications"}>
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <Badge className="absolute -end-1 -top-1 h-5 min-w-5 rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                {unread}
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
          <div className="hidden text-end md:block">
            <div className="text-xs font-semibold">
              {role === "sais" ? "م. خالد الحربي" : "أرامكو السعودية"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {user?.email ?? (role === "sais" ? "مراجع أمني أول" : "مدير الامتثال")}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title={t("logout")}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { isAr } = useT();
  const label = isDark
    ? isAr ? "الوضع الفاتح" : "Light mode"
    : isAr ? "الوضع الداكن" : "Dark mode";
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={label}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function LanguageToggleButton() {
  const { isAr } = useT();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const target = isAr ? "en" : "ar";
  const label = isAr ? "English" : "عربي";
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(target)}
            aria-label={label}
            className="gap-1.5 px-2"
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{isAr ? "EN" : "عربي"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
