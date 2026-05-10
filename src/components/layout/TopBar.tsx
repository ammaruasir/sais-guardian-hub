import { Bell, ChevronLeft, Shield, Building2, LogOut, Moon, Sun, Languages, Search, User, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/hooks/useT";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import { useState } from "react";
import type { TKey } from "@/i18n/translations";
import { useCommandPalette } from "@/components/common/CommandPalette";

function RoleSwitcher() {
  const { role, setRole } = useRole();
  const { t } = useT();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
      <button
        onClick={() => setRole("sais")}
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4",
          role === "sais"
            ? "bg-primary text-primary-foreground shadow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">{t("sais_hub")}</span>
      </button>
      <button
        onClick={() => setRole("company")}
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4",
          role === "company"
            ? "bg-secondary text-secondary-foreground shadow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("company_portal")}</span>
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
    "/portal/settings": "account_settings",
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
      <Link to="/" className="hover:text-foreground">{t("home")}</Link>
      {label && (
        <>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">{label}</span>
        </>
      )}
    </div>
  );
}

function ProfileSheetContent({ role, email }: { role: "sais" | "company"; email: string | undefined }) {
  const { t, isAr } = useT();
  const name = role === "sais" ? (isAr ? "م. خالد الحربي" : "Eng. Khalid Al-Harbi") : (isAr ? "أرامكو السعودية" : "Saudi Aramco");
  const sub = role === "sais" ? (isAr ? "مراجع أمني أول" : "Senior Security Reviewer") : (isAr ? "مدير الامتثال" : "Compliance Manager");
  const dept = role === "sais" ? (isAr ? "إدارة المراجعات" : "Reviews Department") : (isAr ? "إدارة الامتثال" : "Compliance");
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-muted-foreground">{sub}</div>
        </div>
      </div>
      <div className="grid gap-3 text-sm">
        <Row label={t("email_label")} value={email ?? "user@example.com"} />
        <Row label={t("role_label")} value={sub} />
        <Row label={t("col_dept")} value={dept} />
        <Row label={t("last_login")} value="2026-05-10 09:42" />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ProfileMenu() {
  const { role } = useRole();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { t, isAr } = useT();
  const logoutMock = useAppStore((s) => s.logoutMock);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const language = useAppStore((s) => s.settings.language ?? "ar");
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    logoutMock();
    toast.success(t("toast_logout"));
    navigate({ to: "/login" });
  };

  const headName = role === "sais" ? (isAr ? "م. خالد الحربي" : "Eng. Khalid Al-Harbi") : (isAr ? "أرامكو السعودية" : "Saudi Aramco");
  const headSub = role === "sais" ? (isAr ? "مراجع أمني أول" : "Senior Security Reviewer") : (isAr ? "مدير الامتثال" : "Compliance Manager");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {headName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-end md:block">
              <div className="text-xs font-semibold">{headName}</div>
              <div className="text-[11px] text-muted-foreground">{headSub}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="font-bold">{headName}</div>
            <div className="text-[11px] font-normal text-muted-foreground">{headSub}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role === "sais" ? (
            <>
              <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
                <User className="h-4 w-4 me-2" /> {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4 me-2" /> {t("settings")}
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/portal/settings">
                <Settings className="h-4 w-4 me-2" /> {t("account_settings")}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTheme(isDark ? "light" : "dark"); }}>
            {isDark ? <Sun className="h-4 w-4 me-2" /> : <Moon className="h-4 w-4 me-2" />}
            <span className="flex-1">{t("dark_mode")}</span>
            <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setLanguage(language === "ar" ? "en" : "ar"); }}>
            <Languages className="h-4 w-4 me-2" />
            <span className="flex-1">{language === "ar" ? t("english") : t("arabic")}</span>
            <Switch checked={language === "en"} onCheckedChange={(v) => setLanguage(v ? "en" : "ar")} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 me-2" /> {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("profile")}</SheetTitle>
            <SheetDescription>{t("account_settings")}</SheetDescription>
          </SheetHeader>
          <ProfileSheetContent role={role} email={user?.email} />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function TopBar() {
  const { role } = useRole();
  const { t } = useT();
  const unread = useAppStore(
    (s) =>
      s.notifications.filter((n) => !n.read && (n.forRole === role || n.forRole === "both")).length,
  );
  const openPalette = useCommandPalette((s) => s.open);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-3 backdrop-blur md:gap-4 md:px-6">
      <SidebarTrigger className="shrink-0" />
      <Breadcrumbs />
      <div className="ms-auto flex items-center gap-2 md:gap-3">
        <RoleSwitcher />
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => openPalette()} aria-label={t("search_btn")}>
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("search_btn")} (⌘K)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        <ProfileMenu />
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
