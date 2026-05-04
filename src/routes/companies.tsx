import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SectorBadge } from "@/components/projects/Badges";
import { companies, projects, sectorLabel, type Sector } from "@/data";
import { facilities, companyComplianceScore } from "@/data/facilities";
import { complianceBadgeFor } from "@/components/companies/ComplianceGauge";

export const Route = createFileRoute("/companies")({
  component: CompaniesPage,
});

function CompaniesPage() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");

  const rows = useMemo(() => {
    return companies.filter((c) => {
      if (sector !== "all" && c.sector !== sector) return false;
      if (q && !`${c.nameAr} ${c.nameEn}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, sector]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">سجل المنشآت</h1>
          <p className="text-sm text-muted-foreground">قائمة المنشآت المسجلة لدى الهيئة</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم المنشأة" className="max-w-xs" />
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-44"><SelectValue placeholder="القطاع" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل القطاعات</SelectItem>
              {(Object.keys(sectorLabel) as Sector[]).map((s) => (
                <SelectItem key={s} value={s}>{sectorLabel[s].ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم المنشأة</TableHead>
                <TableHead className="text-right">القطاع</TableHead>
                <TableHead className="text-right">المنشآت</TableHead>
                <TableHead className="text-right">المشاريع النشطة</TableHead>
                <TableHead className="text-right">حالة الامتثال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => {
                const facCount = facilities.filter((f) => f.companyId === c.id).length;
                const activeCount = projects.filter((p) => p.companyId === c.id && p.status !== "approved" && p.status !== "rejected").length;
                const score = companyComplianceScore[c.id] ?? 70;
                const band = complianceBadgeFor(score);
                return (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <Link to="/companies/$id" params={{ id: c.id }} className="block">
                        <div className="font-semibold">{c.nameAr}</div>
                        <div className="text-xs text-muted-foreground">{c.nameEn}</div>
                      </Link>
                    </TableCell>
                    <TableCell><SectorBadge s={c.sector} /></TableCell>
                    <TableCell className="num">{facCount}</TableCell>
                    <TableCell className="num">{activeCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ color: band.color, borderColor: band.color }}>
                        {band.ar}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
