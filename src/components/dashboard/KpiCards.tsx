import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Inbox, FilePlus, Eye, FileWarning, CheckCircle2, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { useT } from "@/hooks/useT";

function Kpi({
  icon: Icon, label, sub, value, tone = "primary", highlight = false, to, search,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  value: string;
  tone?: "primary" | "secondary" | "warning" | "destructive" | "success";
  highlight?: boolean;
  to: string;
  search?: Record<string, string>;
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  };
  return (
    <Link
      to={to}
      search={search as never}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 cursor-pointer h-full",
          highlight && "ring-2 ring-warning/40",
        )}
      >
        <CardContent className="p-5">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <div className="num text-3xl font-bold tracking-tight text-foreground">{value}</div>
            <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function KpiCards() {
  const requests = useAppStore((s) => s.requests);
  const { t, isAr } = useT();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tm = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(tm);
  }, []);

  const active = requests.filter((r) => r.status !== "approved" && r.status !== "rejected").length;
  const newCnt = requests.filter((r) => r.status === "submitted").length;
  const inReview = requests.filter((r) => r.status === "in_review" || r.status === "escalated").length;
  const waiting = requests.filter((r) => r.status === "additional_docs").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const decided = requests.filter((r) => r.status === "approved" || r.status === "rejected").length;
  const completion = decided ? Math.round((approved / decided) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const sub = (ar: string, en: string) => (isAr ? en : ar);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <Kpi icon={Inbox} label={t("total_active")} sub={sub("Active Requests", "الطلبات النشطة")} value={String(active)} tone="primary" to="/requests" search={{ filter: "active" }} />
      <Kpi icon={FilePlus} label={t("new_requests_kpi")} sub={sub("New / Unassigned", "جديدة")} value={String(newCnt)} tone="warning" highlight={newCnt > 0} to="/requests" search={{ filter: "new" }} />
      <Kpi icon={Eye} label={t("under_review_kpi")} sub={sub("Under Review", "قيد المراجعة")} value={String(inReview)} tone="secondary" to="/requests" search={{ filter: "in_review" }} />
      <Kpi icon={FileWarning} label={t("waiting_company")} sub={sub("Awaiting Reply", "بانتظار الرد")} value={String(waiting)} tone="warning" to="/requests" search={{ filter: "waiting" }} />
      <Kpi icon={CheckCircle2} label={t("approved_kpi")} sub={sub("Approved", "معتمدة")} value={String(approved)} tone="success" to="/requests" search={{ filter: "approved" }} />
      <Kpi icon={BarChart3} label={t("completion_rate")} sub={sub("Completion Rate", "نسبة الإنجاز")} value={`${completion}%`} tone="success" to="/reports" />
    </div>
  );
}
