import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import type { Project } from "@/data";
import { companies, reviewers, stageLabel, sectorLabel } from "@/data";
import { ClassificationBadge, StatusChip } from "./Badges";

type SortKey = "nameAr" | "company" | "sector" | "stage" | "status" | "reviewer" | "submittedAt";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [asc, setAsc] = useState(false);

  const enrich = projects.map((p) => ({
    p,
    company: companies.find((c) => c.id === p.companyId)?.nameAr ?? "",
    reviewer: reviewers.find((r) => r.id === p.reviewerId),
  }));
  const sorted = [...enrich].sort((a, b) => {
    const av: string | number =
      sortKey === "company" ? a.company
      : sortKey === "reviewer" ? a.reviewer?.nameAr ?? ""
      : sortKey === "stage" ? a.p.stage
      : sortKey === "sector" ? sectorLabel[a.p.sector].ar
      : (a.p as any)[sortKey];
    const bv: string | number =
      sortKey === "company" ? b.company
      : sortKey === "reviewer" ? b.reviewer?.nameAr ?? ""
      : sortKey === "stage" ? b.p.stage
      : sortKey === "sector" ? sectorLabel[b.p.sector].ar
      : (b.p as any)[sortKey];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (asc ? 1 : -1);
  });

  function header(key: SortKey, label: string) {
    return (
      <TableHead className="text-right">
        <button
          className="inline-flex items-center gap-1 hover:text-foreground"
          onClick={() => {
            if (sortKey === key) setAsc(!asc);
            else { setSortKey(key); setAsc(true); }
          }}
        >
          {label}
          <ArrowUpDown className="h-3 w-3" />
        </button>
      </TableHead>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {header("nameAr", "اسم المشروع")}
            {header("company", "المنشأة")}
            {header("sector", "القطاع")}
            {header("stage", "المرحلة")}
            {header("status", "الحالة")}
            {header("reviewer", "المراجع")}
            {header("submittedAt", "تاريخ التقديم")}
            <TableHead className="text-right">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(({ p, company, reviewer }) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.nameAr}</TableCell>
              <TableCell className="text-muted-foreground">{company}</TableCell>
              <TableCell>{sectorLabel[p.sector].ar}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">المرحلة {p.stage}</span>
                  <span className="text-xs">{stageLabel[p.stage].ar}</span>
                </div>
              </TableCell>
              <TableCell><StatusChip s={p.status} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6"><AvatarFallback className="bg-primary text-[10px] text-primary-foreground">{reviewer?.initials}</AvatarFallback></Avatar>
                  <span className="text-xs">{reviewer?.nameAr}</span>
                </div>
              </TableCell>
              <TableCell className="num text-xs text-muted-foreground">{p.submittedAt}</TableCell>
              <TableCell>
                <Button asChild size="sm" variant="ghost" className="gap-1">
                  <Link to="/projects/$id" params={{ id: p.id }}>
                    فتح <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                لا توجد مشاريع مطابقة للفلاتر.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="hidden">
        <ClassificationBadge c="low" />
      </div>
    </div>
  );
}
