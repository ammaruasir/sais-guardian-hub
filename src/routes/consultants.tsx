import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { consultants, consultantStatusLabel, specializationLabel, type Consultant, type ConsultantStatus, type Specialization } from "@/data/consultants";
import { ConsultantDetailDialog } from "@/components/consultants/ConsultantDetailDialog";

export const Route = createFileRoute("/consultants")({
  component: ConsultantsPage,
});

function ConsultantsPage() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [active, setActive] = useState<Consultant | null>(null);

  const rows = useMemo(() => {
    return consultants.filter((c) => {
      if (spec !== "all" && !c.specializations.includes(spec as Specialization)) return false;
      if (status !== "all" && c.status !== status) return false;
      if (q && !`${c.nameAr} ${c.nameEn}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, spec, status]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الاستشاريون المعتمدون</h1>
          <p className="text-sm text-muted-foreground">قائمة شركات الاستشارات الأمنية المعتمدة من الهيئة</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الشركة" className="max-w-xs" />
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger className="w-44"><SelectValue placeholder="التخصص" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التخصصات</SelectItem>
              {(Object.keys(specializationLabel) as Specialization[]).map((s) => (
                <SelectItem key={s} value={s}>{specializationLabel[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {(Object.keys(consultantStatusLabel) as ConsultantStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{consultantStatusLabel[s].ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الشركة</TableHead>
                <TableHead className="text-right">رقم الترخيص</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">المشاريع النشطة</TableHead>
                <TableHead className="text-right">انتهاء الترخيص</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => {
                const st = consultantStatusLabel[c.status];
                return (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setActive(c)}>
                    <TableCell>
                      <div className="font-semibold">{c.nameAr}</div>
                      <div className="text-xs text-muted-foreground">{c.nameEn}</div>
                    </TableCell>
                    <TableCell className="num">{c.licenseNo}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.specializations.map((s) => (
                          <Badge key={s} variant="outline" className="bg-accent/40">{specializationLabel[s]}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="num">{c.activeProjects}</TableCell>
                    <TableCell className="num">{c.licenseExpiry}</TableCell>
                    <TableCell><Badge variant="outline" className={st.cls}>{st.ar}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <ConsultantDetailDialog consultant={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
      </div>
    </AppShell>
  );
}
