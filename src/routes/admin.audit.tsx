import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  ShieldAlert, Shield, AlertTriangle, Eye, RefreshCw, ChevronDown, Info,
  User, Activity, Globe, Clock, Trash2, Search,
} from "lucide-react";
import { auditCountBaseline, type AuditEvent } from "@/data/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

const levelMeta: Record<string, { ar: string; cls: string }> = {
  info: { ar: "معلومات", cls: "bg-secondary/15 text-secondary border-secondary/30" },
  warning: { ar: "تحذير", cls: "bg-warning/20 text-warning-foreground border-warning/30" },
  critical: { ar: "حرج", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

function formatTs(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function AuditPage() {
  const audit = useAppStore((s) => s.audit);
  const users = useAppStore((s) => s.users);
  const deleteAudit = useAppStore((s) => s.deleteAudit);

  const [q, setQ] = useState("");
  const [user, setUser] = useState("all");
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);
  const [, setBump] = useState(0);
  const [toDelete, setToDelete] = useState<AuditEvent | null>(null);

  const types = useMemo(() => Array.from(new Set(audit.map((e) => e.type))), [audit]);

  const filtered = useMemo(() => {
    return audit.filter((e) => {
      if (q && !`${e.user} ${e.description} ${e.type}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (user !== "all" && e.user !== user) return false;
      if (type !== "all" && e.type !== type) return false;
      if (level !== "all" && e.level !== level) return false;
      return true;
    });
  }, [audit, q, user, type, level]);

  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  const counts = useMemo(() => {
    const c = { total: audit.length, critical: 0, warning: 0, info: 0 };
    for (const e of audit) {
      if (e.level === "critical") c.critical++;
      else if (e.level === "warning") c.warning++;
      else c.info++;
    }
    // Add inflated baseline so KPIs read realistically for demo
    return {
      total: c.total + auditCountBaseline.total,
      critical: c.critical + auditCountBaseline.critical,
      warning: c.warning + auditCountBaseline.warnings,
      info: c.info + auditCountBaseline.info,
    };
  }, [audit]);

  return (
    <div className="space-y-6" dir="rtl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الأحداث الأمنية</h1>
            <p className="text-sm text-muted-foreground">مراقبة وتتبع الأنشطة المشبوهة المسجلة في النظام</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setBump((x) => x + 1); toast.success("تم تحديث السجل"); }}
        >
          <RefreshCw className="ms-1 h-4 w-4" />
          تحديث
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { icon: Shield, label: "إجمالي الأحداث", value: counts.total, cls: "bg-secondary/15 text-secondary" },
          { icon: AlertTriangle, label: "أحداث حرجة", value: counts.critical, cls: "bg-destructive/15 text-destructive" },
          { icon: AlertTriangle, label: "تحذيرات", value: counts.warning, cls: "bg-warning/20 text-warning-foreground" },
          { icon: Eye, label: "معلومات", value: counts.info, cls: "bg-muted text-muted-foreground" },
        ].map((k) => (
          <Card key={k.label} className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${k.cls}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="num text-xl font-bold">{k.value.toLocaleString("en-US")}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Guide */}
      <Collapsible>
        <Card className="p-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 text-right">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Info className="h-4 w-4 text-secondary" />
              دليل الأحداث الأمنية والمستويات
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2">
              <Badge variant="outline" className={levelMeta.info.cls}>معلومات</Badge>
              <span className="text-muted-foreground">أنشطة عادية مثل تسجيل الدخول والتعديلات.</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={levelMeta.warning.cls}>تحذيرات</Badge>
              <span className="text-muted-foreground">أنشطة مشبوهة مثل محاولات الدخول الفاشلة وتغيير الصلاحيات.</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={levelMeta.critical.cls}>حرج</Badge>
              <span className="text-muted-foreground">أحداث خطيرة مثل محاولات الوصول غير المصرح بها وقفل الحسابات.</span>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="بحث في الأحداث..." className="pe-8" />
        </div>
        <Select value={user} onValueChange={(v) => { setUser(v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستخدمين</SelectItem>
            {users.map((u) => <SelectItem key={u.id} value={u.nameAr}>{u.nameAr}</SelectItem>)}
            <SelectItem value="Admin User">Admin User</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            <SelectItem value="info">معلومات</SelectItem>
            <SelectItem value="warning">تحذير</SelectItem>
            <SelectItem value="critical">حرج</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">الحدث</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">الصفحة</TableHead>
              <TableHead className="text-right">المستوى</TableHead>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  لا توجد نتائج مطابقة
                </TableCell>
              </TableRow>
            ) : paged.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />{e.user}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-muted-foreground" />{e.type}</div>
                </TableCell>
                <TableCell className="max-w-[260px] truncate text-muted-foreground">{e.description}</TableCell>
                <TableCell>
                  <div className="num flex items-center gap-1.5 text-xs text-muted-foreground"><Globe className="h-3.5 w-3.5" />{e.page}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={levelMeta[e.level].cls}>{levelMeta[e.level].ar}</Badge>
                </TableCell>
                <TableCell>
                  <div className="num flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatTs(e.ts)}</div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setToDelete(e)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="num text-muted-foreground">
          عرض {filtered.length === 0 ? 0 : start + 1}-{Math.min(start + perPage, filtered.length)} من {filtered.length}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
          <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي</Button>
        </div>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="حذف حدث أمني"
        description="هل أنت متأكد من حذف هذا الحدث من السجل؟"
        confirmText="حذف"
        onConfirm={() => {
          if (toDelete) {
            deleteAudit(toDelete.id);
            toast.success("تم حذف الحدث");
          }
        }}
      />
    </div>
  );
}
