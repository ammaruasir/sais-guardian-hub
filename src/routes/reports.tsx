import { useRef, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRole } from "@/context/RoleContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";
import { Download, FileText, ClipboardList, Building2, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import saisEmblem from "@/assets/sais-emblem.png";
import {
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
  LineChart,
  Line,
  AreaChart,
  Area,
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
  { m: "نوفمبر", v: 3, requests: 12 },
  { m: "ديسمبر", v: 2, requests: 9 },
  { m: "يناير", v: 4, requests: 15 },
  { m: "فبراير", v: 2, requests: 11 },
  { m: "مارس", v: 5, requests: 18 },
  { m: "أبريل", v: 3, requests: 14 },
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

const requestsByStatus = [
  { name: "جديد", value: 6, color: "var(--chart-2)" },
  { name: "قيد المراجعة", value: 9, color: "var(--chart-1)" },
  { name: "بانتظار الرد", value: 4, color: "var(--chart-4)" },
  { name: "معتمد", value: 18, color: "var(--chart-3)" },
  { name: "مرفوض", value: 3, color: "var(--chart-5)" },
];

const departments = [
  { name: "إدارة الترخيص الصناعي", active: 12, completed: 38, avgDays: 5.2, sla: 92 },
  { name: "إدارة المراجعة الفنية", active: 9, completed: 27, avgDays: 6.8, sla: 87 },
  { name: "إدارة المواد الكيميائية", active: 7, completed: 19, avgDays: 7.4, sla: 81 },
  { name: "إدارة الوقاية من الحريق", active: 5, completed: 22, avgDays: 4.9, sla: 95 },
  { name: "إدارة الحراسات الأمنية", active: 4, completed: 14, avgDays: 5.5, sla: 89 },
];

const employees = [
  { name: "م. خالد الحربي", dept: "الترخيص الصناعي", active: 4, completed: 18, avgDays: 4.8, sla: 96 },
  { name: "م. فهد القحطاني", dept: "المراجعة الفنية", active: 3, completed: 14, avgDays: 6.1, sla: 90 },
  { name: "م. نورة الشمري", dept: "المواد الكيميائية", active: 2, completed: 11, avgDays: 7.0, sla: 84 },
  { name: "م. عبدالله الدوسري", dept: "الوقاية من الحريق", active: 2, completed: 9, avgDays: 5.0, sla: 92 },
  { name: "م. سارة العتيبي", dept: "الترخيص الصناعي", active: 3, completed: 15, avgDays: 5.4, sla: 88 },
  { name: "م. ماجد السبيعي", dept: "الحراسات الأمنية", active: 2, completed: 7, avgDays: 5.9, sla: 86 },
];

const projectsRows = [
  { id: "PRJ-2041", company: "أرامكو السعودية", sector: "بترول", stage: "المرحلة 3", status: "قيد المراجعة", days: 14 },
  { id: "PRJ-2055", company: "سابك", sector: "بتروكيماويات", stage: "المرحلة 2", status: "بانتظار الرد", days: 9 },
  { id: "PRJ-2067", company: "معادن", sector: "تعدين", stage: "المرحلة 4", status: "قيد المراجعة", days: 21 },
  { id: "PRJ-2082", company: "السعودية للكهرباء", sector: "كهرباء", stage: "المرحلة 1", status: "جديد", days: 3 },
  { id: "PRJ-2099", company: "ينساب", sector: "بتروكيماويات", stage: "المرحلة 3", status: "معتمد", days: 28 },
];

const requestsRows = [
  { id: "REQ-0712", company: "أرامكو السعودية", type: "ترخيص جديد", reviewer: "م. خالد الحربي", status: "قيد المراجعة", date: "2026-04-02" },
  { id: "REQ-0718", company: "سابك", type: "تجديد", reviewer: "م. فهد القحطاني", status: "بانتظار الرد", date: "2026-04-05" },
  { id: "REQ-0723", company: "معادن", type: "تعديل", reviewer: "م. نورة الشمري", status: "معتمد", date: "2026-04-08" },
  { id: "REQ-0731", company: "السعودية للكهرباء", type: "ترخيص جديد", reviewer: "م. عبدالله الدوسري", status: "جديد", date: "2026-04-11" },
  { id: "REQ-0739", company: "ينساب", type: "استشارة فنية", reviewer: "م. سارة العتيبي", status: "قيد المراجعة", date: "2026-04-13" },
];

function statusBadge(s: string) {
  const m: Record<string, string> = {
    "جديد": "bg-blue-100 text-blue-700 border-blue-200",
    "قيد المراجعة": "bg-amber-100 text-amber-700 border-amber-200",
    "بانتظار الرد": "bg-orange-100 text-orange-700 border-orange-200",
    "معتمد": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "مرفوض": "bg-rose-100 text-rose-700 border-rose-200",
  };
  return m[s] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

function ChartCard({
  title,
  en,
  children,
  height = 280,
}: {
  title: string;
  en: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{en}</p>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "secondary";
}) {
  const toneClass: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    secondary: "bg-secondary/10 text-secondary",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClass[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsContent() {
  const [range, setRange] = useState("6m");
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const factor = range === "30d" ? 0.85 : range === "3m" ? 0.92 : range === "1y" ? 1.15 : 1;
  const monthlyR = monthly.map((d) => ({
    ...d,
    v: Math.max(1, Math.round(d.v * factor)),
    requests: Math.max(1, Math.round(d.requests * factor)),
  }));
  const stagesR = stages.map((d) => ({ ...d, days: Number((d.days * factor).toFixed(1)) }));
  const reviewersR = reviewers.map((d) => ({
    ...d,
    count: Math.max(1, Math.round(d.count * factor)),
  }));
  const maxReviewer = Math.max(...reviewersR.map((r) => r.count));

  const totalRequests = requestsByStatus.reduce((a, b) => a + b.value, 0);
  const totalActive = departments.reduce((a, b) => a + b.active, 0);
  const totalCompleted = departments.reduce((a, b) => a + b.completed, 0);
  const avgSla = Math.round(departments.reduce((a, b) => a + b.sla, 0) / departments.length);

  const exportPdf = async () => {
    setExporting(true);
    toast.info("جاري إنشاء التقرير...");
    let host: HTMLDivElement | null = null;
    try {
      const [{ default: jsPDF }, html2canvasMod] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);
      const html2canvas = (html2canvasMod as any).default ?? html2canvasMod;

      // 1) Snapshot existing on-page chart cards as images (so charts keep colors/RTL)
      const chartImages: string[] = [];
      if (reportRef.current) {
        const chartNodes = reportRef.current.querySelectorAll<HTMLElement>("[data-chart-card]");
        for (const node of Array.from(chartNodes)) {
          const c = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
          chartImages.push(c.toDataURL("image/png"));
        }
      }

      // 2) Build offscreen multi-page A4 template (RTL)
      const A4_W = 794; // px @96dpi
      const A4_H = 1123;
      const periodLabel = range === "30d" ? "آخر 30 يوم" : range === "3m" ? "آخر 3 أشهر" : range === "1y" ? "سنة كاملة" : "آخر 6 أشهر";
      const issueDate = new Date().toLocaleDateString("ar-SA");
      const refNo = `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      const esc = (s: any) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
      const slaCell = (n: number) => {
        const color = n >= 90 ? "#15803d" : n >= 85 ? "#b45309" : "#be123c";
        const bg = n >= 90 ? "#dcfce7" : n >= 85 ? "#fef3c7" : "#ffe4e6";
        return `<span style="display:inline-block;padding:2px 8px;border-radius:6px;background:${bg};color:${color};font-weight:600">${n}%</span>`;
      };

      const headerHtml = `
        <div style="display:flex;align-items:center;gap:16px;padding-bottom:12px;border-bottom:2px solid #0E5A3A">
          <div style="flex:1;text-align:right;color:#0E5A3A">
            <div style="font-size:13px;font-weight:700">المملكة العربية السعودية</div>
            <div style="font-size:11px">الهيئة العليا للأمن الصناعي</div>
          </div>
          <div style="flex:0 0 auto"><img src="${saisEmblem}" style="height:80px;width:auto" crossorigin="anonymous"/></div>
          <div style="flex:1;text-align:left;font-size:11px;line-height:1.7">
            <div><span style="color:#64748b">الرقم: </span><span style="font-family:monospace">${refNo}</span></div>
            <div><span style="color:#64748b">التاريخ: </span><span dir="ltr">${issueDate}</span></div>
            <div><span style="color:#64748b">الفترة: </span>${periodLabel}</div>
          </div>
        </div>`;

      const titleBar = `
        <div style="background:#0E5A3A;color:#fff;padding:8px 16px;border-radius:6px;text-align:center;margin-top:14px">
          <div style="font-size:16px;font-weight:700">تقرير الأداء التحليلي</div>
          <div style="font-size:10px;opacity:.9">Analytical Performance Report</div>
        </div>`;

      const footerHtml = (n: number, total: number) => `
        <div style="position:absolute;bottom:24px;inset-inline:24px;border-top:2px solid #0E5A3A;padding-top:8px;display:flex;justify-content:space-between;font-size:10px;color:#0E5A3A">
          <span>الرياض — المملكة العربية السعودية | sais.gov.sa</span>
          <span dir="ltr">${n} / ${total}</span>
        </div>`;

      const sectionTitle = (ar: string, en: string) => `
        <div style="margin-top:18px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #d1d5db">
          <div style="font-size:14px;font-weight:700;color:#0E5A3A">${ar}</div>
          <div style="font-size:10px;color:#64748b">${en}</div>
        </div>`;

      const tableStyle = `width:100%;border-collapse:collapse;font-size:11px;direction:rtl`;
      const thStyle = `background:#0E5A3A;color:#fff;padding:8px;text-align:right;font-weight:600;border:1px solid #0E5A3A`;
      const tdStyle = `padding:7px 8px;border:1px solid #e5e7eb;text-align:right`;

      const kpiCard = (label: string, value: string | number, hint: string) => `
        <div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#f8fafc">
          <div style="font-size:10px;color:#64748b;margin-bottom:4px">${label}</div>
          <div style="font-size:22px;font-weight:700;color:#0E5A3A">${value}</div>
          <div style="font-size:10px;color:#64748b;margin-top:4px">${hint}</div>
        </div>`;

      const pages: string[] = [];

      // Page 1 — Cover + KPIs
      pages.push(`
        ${headerHtml}
        ${titleBar}
        <div style="margin-top:24px;text-align:center">
          <div style="font-size:13px;color:#64748b">الفترة المختارة</div>
          <div style="font-size:18px;font-weight:700;margin-top:4px">${periodLabel}</div>
          <div style="font-size:11px;color:#64748b;margin-top:6px">تاريخ الإصدار: <span dir="ltr">${issueDate}</span></div>
        </div>
        ${sectionTitle("المؤشرات الرئيسية", "Key Performance Indicators")}
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          ${kpiCard("إجمالي الطلبات", totalRequests, "ضمن الفترة المختارة")}
          ${kpiCard("مشاريع نشطة", totalActive, `${totalCompleted} مكتمل`)}
          ${kpiCard("متوسط زمن المراجعة", `${stagesR[2].days} يوم`, "عبر جميع المراحل")}
          ${kpiCard("نسبة التزام SLA", `${avgSla}%`, "متوسط جميع الإدارات")}
        </div>
      `);

      // Page 2 — Requests table
      pages.push(`
        ${headerHtml}
        ${sectionTitle("أحدث الطلبات", "Latest Requests")}
        <table style="${tableStyle}">
          <thead><tr>
            <th style="${thStyle}">الرقم</th>
            <th style="${thStyle}">المنشأة</th>
            <th style="${thStyle}">النوع</th>
            <th style="${thStyle}">المراجع</th>
            <th style="${thStyle}">الحالة</th>
            <th style="${thStyle}">التاريخ</th>
          </tr></thead>
          <tbody>
            ${requestsRows.map((r) => `<tr>
              <td style="${tdStyle};font-family:monospace" dir="ltr">${esc(r.id)}</td>
              <td style="${tdStyle};font-weight:600">${esc(r.company)}</td>
              <td style="${tdStyle};color:#64748b">${esc(r.type)}</td>
              <td style="${tdStyle}">${esc(r.reviewer)}</td>
              <td style="${tdStyle}">${esc(r.status)}</td>
              <td style="${tdStyle};color:#64748b" dir="ltr">${esc(r.date)}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      `);

      // Page 3 — Projects table
      pages.push(`
        ${headerHtml}
        ${sectionTitle("المشاريع النشطة", "Active Projects")}
        <table style="${tableStyle}">
          <thead><tr>
            <th style="${thStyle}">الرقم</th>
            <th style="${thStyle}">المنشأة</th>
            <th style="${thStyle}">القطاع</th>
            <th style="${thStyle}">المرحلة</th>
            <th style="${thStyle}">الحالة</th>
            <th style="${thStyle}">عدد الأيام</th>
          </tr></thead>
          <tbody>
            ${projectsRows.map((p) => `<tr>
              <td style="${tdStyle};font-family:monospace" dir="ltr">${esc(p.id)}</td>
              <td style="${tdStyle};font-weight:600">${esc(p.company)}</td>
              <td style="${tdStyle};color:#64748b">${esc(p.sector)}</td>
              <td style="${tdStyle}">${esc(p.stage)}</td>
              <td style="${tdStyle}">${esc(p.status)}</td>
              <td style="${tdStyle};text-align:center">${p.days}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      `);

      // Page 4 — Departments
      pages.push(`
        ${headerHtml}
        ${sectionTitle("أداء الإدارات", "Department Performance")}
        <table style="${tableStyle}">
          <thead><tr>
            <th style="${thStyle}">الإدارة</th>
            <th style="${thStyle}">نشطة</th>
            <th style="${thStyle}">مكتملة</th>
            <th style="${thStyle}">متوسط الأيام</th>
            <th style="${thStyle}">التزام SLA</th>
          </tr></thead>
          <tbody>
            ${departments.map((d) => `<tr>
              <td style="${tdStyle};font-weight:600">${esc(d.name)}</td>
              <td style="${tdStyle};text-align:center">${d.active}</td>
              <td style="${tdStyle};text-align:center">${d.completed}</td>
              <td style="${tdStyle};text-align:center">${d.avgDays}</td>
              <td style="${tdStyle};text-align:center">${slaCell(d.sla)}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      `);

      // Page 5 — Employees
      pages.push(`
        ${headerHtml}
        ${sectionTitle("أداء الموظفين", "Employee Performance")}
        <table style="${tableStyle}">
          <thead><tr>
            <th style="${thStyle}">الموظف</th>
            <th style="${thStyle}">الإدارة</th>
            <th style="${thStyle}">نشطة</th>
            <th style="${thStyle}">مكتملة</th>
            <th style="${thStyle}">متوسط الأيام</th>
            <th style="${thStyle}">SLA</th>
          </tr></thead>
          <tbody>
            ${employees.map((e) => `<tr>
              <td style="${tdStyle};font-weight:600">${esc(e.name)}</td>
              <td style="${tdStyle};color:#64748b">${esc(e.dept)}</td>
              <td style="${tdStyle};text-align:center">${e.active}</td>
              <td style="${tdStyle};text-align:center">${e.completed}</td>
              <td style="${tdStyle};text-align:center">${e.avgDays}</td>
              <td style="${tdStyle};text-align:center">${slaCell(e.sla)}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      `);

      // Pages for charts (2 charts per page)
      for (let i = 0; i < chartImages.length; i += 2) {
        const pair = chartImages.slice(i, i + 2);
        pages.push(`
          ${headerHtml}
          ${sectionTitle("الرسوم البيانية", "Visual Analytics")}
          <div style="display:flex;flex-direction:column;gap:14px">
            ${pair.map((src) => `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:8px;background:#fff"><img src="${src}" style="width:100%;height:auto;display:block"/></div>`).join("")}
          </div>
        `);
      }

      const totalPages = pages.length;
      host = document.createElement("div");
      host.style.cssText = `position:fixed;left:-99999px;top:0;width:${A4_W}px;background:#fff;font-family:"IBM Plex Sans Arabic","Tajawal",system-ui,sans-serif`;
      host.dir = "rtl";
      host.innerHTML = pages.map((body, idx) => `
        <div data-pdf-page style="position:relative;width:${A4_W}px;height:${A4_H}px;padding:24px;box-sizing:border-box;background:#fff;border:2px solid #0E5A3A;overflow:hidden">
          ${body}
          ${footerHtml(idx + 1, totalPages)}
        </div>
      `).join("");
      document.body.appendChild(host);

      // Wait for images (logo + chart snapshots) to load
      await Promise.all(
        Array.from(host.querySelectorAll("img")).map(
          (img) => (img as HTMLImageElement).complete
            ? Promise.resolve()
            : new Promise((res) => { img.addEventListener("load", () => res(null)); img.addEventListener("error", () => res(null)); })
        )
      );

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();
      const pageEls = host.querySelectorAll<HTMLElement>("[data-pdf-page]");
      for (let i = 0; i < pageEls.length; i++) {
        const c = await html2canvas(pageEls[i], {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          windowWidth: A4_W,
        });
        const data = c.toDataURL("image/jpeg", 0.94);
        if (i > 0) pdf.addPage();
        pdf.addImage(data, "JPEG", 0, 0, pageWidthMm, pageHeightMm);
      }

      const stamp = new Date().toISOString().slice(0, 10);
      pdf.save(`SAIS-Report-${stamp}.pdf`);
      toast.success("تم تنزيل التقرير بنجاح ✓");
    } catch (e: any) {
      console.error("PDF export failed:", e);
      toast.error(`تعذّر إنشاء التقرير: ${e?.message ?? "خطأ غير معروف"}`);
    } finally {
      if (host && host.parentNode) host.parentNode.removeChild(host);
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التقارير والإحصائيات</h1>
          <p className="text-sm text-muted-foreground">نظرة تحليلية شاملة على أداء المراجعات، المشاريع، الإدارات والموظفين</p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button onClick={exportPdf} disabled={exporting} className="gap-2">
            <Download className="h-4 w-4" />
            {exporting ? "جاري التصدير..." : "استخراج PDF"}
          </Button>
        </div>
      </div>

      {/* Report area (kept for on-screen viewing only) */}
      <div ref={reportRef} className="space-y-6">
        {/* Cover (on-screen) */}
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-l from-primary/5 to-secondary/5 p-6">
            <div>
              <div className="text-xs text-muted-foreground">الهيئة العليا للأمن الصناعي</div>
              <h2 className="mt-1 text-xl font-bold">تقرير الأداء التحليلي</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                الفترة: {range === "30d" ? "آخر 30 يوم" : range === "3m" ? "آخر 3 أشهر" : range === "1y" ? "سنة كاملة" : "آخر 6 أشهر"}
                {" — "}
                تاريخ الإصدار: {new Date().toLocaleDateString("ar-SA")}
              </p>
            </div>
            <FileText className="h-10 w-10 text-primary/60" />
          </div>
        </Card>

        {/* KPI tiles */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiTile icon={ClipboardList} label="إجمالي الطلبات" value={totalRequests} hint="ضمن الفترة المختارة" tone="primary" />
          <KpiTile icon={Building2} label="مشاريع نشطة" value={totalActive} hint={`${totalCompleted} مكتمل`} tone="secondary" />
          <KpiTile icon={Clock} label="متوسط زمن المراجعة" value={`${stagesR[2].days} يوم`} hint="عبر جميع المراحل" tone="warning" />
          <KpiTile icon={CheckCircle2} label="نسبة التزام SLA" value={`${avgSla}%`} hint="متوسط جميع الإدارات" tone="success" />
        </div>

        {/* Charts grid */}
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

          <ChartCard title="الطلبات الواردة شهرياً" en="Incoming Requests per Month">
            <AreaChart data={monthlyR}>
              <defs>
                <linearGradient id="reqArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="requests" stroke="var(--secondary)" fill="url(#reqArea)" name="طلبات" />
            </AreaChart>
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

          <ChartCard title="الطلبات حسب الحالة" en="Requests by Status">
            <PieChart>
              <Pie data={requestsByStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {requestsByStatus.map((s, i) => (
                  <Cell key={i} fill={s.color} stroke="var(--card)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ChartCard>

          <ChartCard title="التقديمات حسب القطاع" en="Submissions by Sector">
            <PieChart>
              <Pie data={sectors} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
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
                  <Cell key={i} fill={r.count === maxReviewer ? "var(--warning)" : "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </div>

        {/* Department performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              أداء الإدارات
            </CardTitle>
            <p className="text-xs text-muted-foreground">Department Performance</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الإدارة</TableHead>
                  <TableHead className="text-center">نشطة</TableHead>
                  <TableHead className="text-center">مكتملة</TableHead>
                  <TableHead className="text-center">متوسط الأيام</TableHead>
                  <TableHead>التزام SLA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-center">{d.active}</TableCell>
                    <TableCell className="text-center">{d.completed}</TableCell>
                    <TableCell className="text-center">{d.avgDays}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={d.sla} className="h-2 flex-1" />
                        <span className="w-10 text-xs text-muted-foreground">{d.sla}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Employee performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              أداء الموظفين
            </CardTitle>
            <p className="text-xs text-muted-foreground">Employee Performance</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>الإدارة</TableHead>
                  <TableHead className="text-center">طلبات نشطة</TableHead>
                  <TableHead className="text-center">مكتملة</TableHead>
                  <TableHead className="text-center">متوسط الأيام</TableHead>
                  <TableHead>SLA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                    <TableCell className="text-center">{e.active}</TableCell>
                    <TableCell className="text-center">{e.completed}</TableCell>
                    <TableCell className="text-center">{e.avgDays}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={e.sla >= 90 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : e.sla >= 85 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-rose-200 bg-rose-50 text-rose-700"}>
                        {e.sla}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              المشاريع النشطة
            </CardTitle>
            <p className="text-xs text-muted-foreground">Active Projects</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>المنشأة</TableHead>
                  <TableHead>القطاع</TableHead>
                  <TableHead>المرحلة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">عدد الأيام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsRows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.company}</TableCell>
                    <TableCell className="text-muted-foreground">{p.sector}</TableCell>
                    <TableCell>{p.stage}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(p.status)}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{p.days}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-primary" />
              أحدث الطلبات
            </CardTitle>
            <p className="text-xs text-muted-foreground">Latest Requests</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>المنشأة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المراجع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestsRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.company}</TableCell>
                    <TableCell className="text-muted-foreground">{r.type}</TableCell>
                    <TableCell>{r.reviewer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(r.status)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground" dir="ltr">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Trend line */}
        <ChartCard title="اتجاه الطلبات والمشاريع" en="Requests & Projects Trend" height={260}>
          <LineChart data={monthlyR}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="m" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="requests" stroke="var(--secondary)" strokeWidth={2} name="طلبات" />
            <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} name="مشاريع مكتملة" />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}
