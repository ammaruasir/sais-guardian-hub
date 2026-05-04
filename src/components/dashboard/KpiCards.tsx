import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle2, FileSearch } from "lucide-react";
import { kpis } from "@/data";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trend.dir === "up" ? "text-success" : "text-destructive")}>
              {trend.dir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Kpi icon={FileSearch} label="المشاريع النشطة" sub="Active Projects" value={String(kpis.activeProjects)} tone="primary" trend={{ dir: "up", text: "+2" }} />
      <Kpi icon={Clock} label="قيد المراجعة" sub="Pending Reviews" value={String(kpis.pendingReviews)} tone="secondary" />
      <Kpi icon={AlertTriangle} label="متأخرة" sub="Overdue" value={String(kpis.overdue)} tone="destructive" trend={{ dir: "down", text: "-1" }} />
      <Kpi icon={CheckCircle2} label="نسبة الاعتماد" sub="Approval Rate" value={`${kpis.approvalRate}%`} tone="success" trend={{ dir: "up", text: "+4%" }} />
      <Kpi icon={Clock} label="متوسط وقت المراجعة" sub="Avg Review (days)" value={`${kpis.avgReviewDays}`} tone="warning" />
    </div>
  );
}
