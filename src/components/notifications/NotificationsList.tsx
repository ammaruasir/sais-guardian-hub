import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CircleCheck,
  FileQuestion,
  XCircle,
  Clock,
  FileUp,
  MessageCircle,
  BellOff,
  CheckCheck,
  X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/data/notifications";
import { useAppStore } from "@/store/appStore";
import { useT } from "@/hooks/useT";

const typeMeta: Record<NotificationType, { icon: typeof CircleCheck; cls: string }> = {
  approval: { icon: CircleCheck, cls: "bg-success/15 text-success" },
  request: { icon: FileQuestion, cls: "bg-warning/20 text-warning-foreground" },
  rejection: { icon: XCircle, cls: "bg-destructive/15 text-destructive" },
  deadline: { icon: Clock, cls: "bg-warning/20 text-warning-foreground" },
  submission: { icon: FileUp, cls: "bg-secondary/15 text-secondary" },
  comment: { icon: MessageCircle, cls: "bg-muted text-muted-foreground" },
};

type Filter = "all" | "unread" | "approval" | "request" | "deadline";

const filterLabelsByLang: Record<"ar" | "en", Record<Filter, string>> = {
  ar: { all: "الكل", unread: "غير مقروءة", approval: "اعتمادات", request: "طلبات", deadline: "مواعيد" },
  en: { all: "All", unread: "Unread", approval: "Approvals", request: "Requests", deadline: "Deadlines" },
};

export function NotificationsList({ role }: { role: "sais" | "company" }) {
  const allNotifications = useAppStore((s) => s.notifications);
  const markAsRead = useAppStore((s) => s.markAsRead);
  const markAllAsRead = useAppStore((s) => s.markAllAsRead);
  const deleteNotification = useAppStore((s) => s.deleteNotification);
  const items = allNotifications.filter((n) => n.forRole === role || n.forRole === "both");
  const [filter, setFilter] = useState<Filter>("all");
  const { t, isAr, lang } = useT();
  const filterLabels = filterLabelsByLang[lang];

  const filtered = items.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAll = () => markAllAsRead(role);
  const markOne = (id: string) => markAsRead(id);

  const unreadTotal = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("notifications")}</h1>
          <p className="text-sm text-muted-foreground">
            {unreadTotal > 0
              ? isAr ? `لديك ${unreadTotal} إشعار غير مقروء` : `You have ${unreadTotal} unread notification(s)`
              : isAr ? "لا يوجد إشعارات غير مقروءة" : "No unread notifications"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAll} disabled={unreadTotal === 0}>
          <CheckCheck className="ms-1 h-4 w-4" />
          {t("mark_all_read")}
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          {(Object.keys(filterLabels) as Filter[]).map((f) => (
            <TabsTrigger key={f} value={f}>
              {filterLabels[f]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">{isAr ? "لا يوجد إشعارات" : "No notifications"}</div>
            <p className="text-xs text-muted-foreground">
              {isAr ? "لا توجد عناصر مطابقة للفلتر الحالي." : "No items match the current filter."}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            return (
              <div
                key={n.id}
                className="group relative flex items-center gap-4 p-4 transition-colors hover:bg-accent/40"
              >
                <Link
                  to={n.linkTo}
                  onClick={() => markOne(n.id)}
                  className="absolute inset-0"
                  aria-label={n.titleAr}
                />
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    meta.cls,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative z-10 min-w-0 flex-1 pointer-events-none">
                  <div
                    className={cn(
                      "truncate text-sm",
                      !n.read ? "font-bold text-foreground" : "font-medium text-foreground/90",
                    )}
                  >
                    {n.titleAr}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{n.descriptionAr}</div>
                </div>
                <div className="relative z-10 shrink-0 text-[11px] text-muted-foreground pointer-events-none">
                  {n.ts}
                </div>
                <div className="relative z-10 w-2 shrink-0">
                  {!n.read && <span className="block h-2 w-2 rounded-full bg-secondary" />}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="relative z-10 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={isAr ? "حذف" : "Delete"}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
