import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileSearch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

function Kpi({
  icon: Icon,
  label,
  sub,
  value,
  trend,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  value: string;
  trend?: { dir: "up" | "down"; text: string };
  tone?: "primary" | "secondary" | "warning" | "destructive" | "success";
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}
          >
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.dir === "up" ? "text-success" : "text-destructive",
              )}
            >
              {trend.dir === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.text}
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="num text-3xl font-bold tracking-tight text-foreground">{value}</div>
          <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCards() {
  const projects = useAppStore((s) => s.projects);
  const submissions = useAppStore((s) => s.submissions);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const activeProjects = projects.length;
  const pendingReviews = projects.filter((p) => p.status === "under_review").length;
  const overdue = projects.filter((p) => p.overdue).length;
  const decided = submissions.filter((s) => !!s.decision);
  const approvalRate = decided.length
    ? Math.round((decided.filter((s) => s.decision === "approved").length / decided.length) * 100)
    : 0;
  const reviewing = projects.filter((p) => p.status === "under_review");
  const avgReviewDays = reviewing.length
    ? (reviewing.reduce((a, p) => a + p.daysInStage, 0) / reviewing.length).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
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
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Kpi
        icon={FileSearch}
        label="المشاريع النشطة"
        sub="Active Projects"
        value={String(activeProjects)}
        tone="primary"
      />
      <Kpi
        icon={Clock}
        label="قيد المراجعة"
        sub="Pending Reviews"
        value={String(pendingReviews)}
        tone="secondary"
      />
      <Kpi
        icon={AlertTriangle}
        label="متأخرة"
        sub="Overdue"
        value={String(overdue)}
        tone="destructive"
      />
      <Kpi
        icon={CheckCircle2}
        label="نسبة الاعتماد"
        sub="Approval Rate"
        value={`${approvalRate}%`}
        tone="success"
      />
      <Kpi
        icon={Clock}
        label="متوسط وقت المراجعة"
        sub="Avg Review (days)"
        value={`${avgReviewDays}`}
        tone="warning"
      />
    </div>
  );
}
