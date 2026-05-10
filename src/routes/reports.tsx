import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/context/RoleContext";
import {
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useT();
  usePageTitle(t("reports") + " — SAIS");
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return (
    <AppShell>
      <ReportsContent />
    </AppShell>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: 12,
};

const monthly = [
  { m: "نوفمبر", v: 3 },
  { m: "ديسمبر", v: 2 },
  { m: "يناير", v: 4 },
  { m: "فبراير", v: 2 },
  { m: "مارس", v: 5 },
  { m: "أبريل", v: 3 },
];

const stages = [
  { name: "المرحلة 1", days: 3.2 },
  { name: "المرحلة 2", days: 5.1 },
  { name: "المرحلة 3", days: 6.8 },
  { name: "المرحلة 4", days: 4.5 },
];

const sectors = [
  { name: "بترول", value: 35, color: "var(--chart-1)" },
  { name: "بتروكيماويات", value: 25, color: "var(--chart-2)" },
  { name: "تعدين", value: 15, color: "var(--chart-3)" },
  { name: "كهرباء", value: 15, color: "var(--chart-4)" },
  { name: "أخرى", value: 10, color: "var(--chart-5)" },
];

const reviewers = [
  { name: "م. خالد الحربي", count: 4 },
  { name: "م. فهد القحطاني", count: 3 },
  { name: "م. نورة الشمري", count: 2 },
  { name: "م. عبدالله الدوسري", count: 2 },
];

function ChartCard({
  title,
  en,
  children,
}: {
  title: string;
  en: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{en}</p>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsContent() {
  const [range, setRange] = useState("6m");
  const factor = range === "30d" ? 0.85 : range === "3m" ? 0.92 : range === "1y" ? 1.15 : 1;
  const monthlyR = monthly.map((d) => ({ ...d, v: Math.max(1, Math.round(d.v * factor)) }));
  const stagesR = stages.map((d) => ({ ...d, days: Number((d.days * factor).toFixed(1)) }));
  const reviewersR = reviewers.map((d) => ({
    ...d,
    count: Math.max(1, Math.round(d.count * factor)),
  }));
  const maxReviewer = Math.max(...reviewersR.map((r) => r.count));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التقارير والإحصائيات</h1>
          <p className="text-sm text-muted-foreground">نظرة تحليلية على أداء المراجعات والمشاريع</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">آخر 30 يوم</SelectItem>
            <SelectItem value="3m">آخر 3 أشهر</SelectItem>
            <SelectItem value="6m">آخر 6 أشهر</SelectItem>
            <SelectItem value="1y">سنة كاملة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="المشاريع المكتملة شهرياً" en="Projects Completed per Month">
          <BarChart data={monthlyR}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="m" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="v" fill="var(--primary)" radius={[6, 6, 0, 0]} name="مكتملة" />
          </BarChart>
        </ChartCard>

        <ChartCard title="متوسط وقت المراجعة حسب المرحلة" en="Avg Review Time by Stage">
          <BarChart data={stagesR} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} يوم`, "متوسط"]} />
            <Bar dataKey="days" fill="var(--secondary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="التقديمات حسب القطاع" en="Submissions by Sector">
          <PieChart>
            <Pie
              data={sectors}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={2}
            >
              {sectors.map((s, i) => (
                <Cell key={i} fill={s.color} stroke="var(--card)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "نسبة"]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="أعباء المراجعين" en="Reviewer Workload">
          <BarChart data={reviewersR} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} مهمة`, "نشط"]} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {reviewersR.map((r, i) => (
                <Cell
                  key={i}
                  fill={r.count === maxReviewer ? "var(--warning)" : "var(--primary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}
