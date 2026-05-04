import { useMemo, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
import { SectorBadge } from "@/components/projects/Badges";
import { sectorLabel, type Sector, type Company } from "@/data";
import { facilities, companyComplianceScore } from "@/data/facilities";
import { complianceBadgeFor } from "@/components/companies/ComplianceGauge";
import { CompanyFormDialog } from "@/components/companies/CompanyFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAppStore } from "@/store/appStore";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/companies")({
  component: GuardedCompanies,
});

function GuardedCompanies() {
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return <CompaniesPage />;
}

function CompaniesPage() {
  const { currentUser } = useRole();
  const companies = useAppStore((s) => s.companies);
  const projects = useAppStore((s) => s.projects);
  const deleteCompany = useAppStore((s) => s.deleteCompany);
  const addAudit = useAppStore((s) => s.addAudit);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");
  const [editing, setEditing] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Company | null>(null);

  const rows = useMemo(() => {
    return companies.filter((c) => {
      if (sector !== "all" && c.sector !== sector) return false;
      if (q && !`${c.nameAr} ${c.nameEn}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, sector, companies]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">سجل المنشآت</h1>
            <p className="text-sm text-muted-foreground">قائمة المنشآت المسجلة لدى الهيئة</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="ms-1 h-4 w-4" />
            إضافة منشأة
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم المنشأة"
            className="max-w-xs"
          />
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="القطاع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل القطاعات</SelectItem>
              {(Object.keys(sectorLabel) as Sector[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {sectorLabel[s].ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-end">اسم المنشأة</TableHead>
                <TableHead className="text-end">القطاع</TableHead>
                <TableHead className="text-end">المنشآت</TableHead>
                <TableHead className="text-end">المشاريع النشطة</TableHead>
                <TableHead className="text-end">حالة الامتثال</TableHead>
                <TableHead className="text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    لا توجد نتائج مطابقة
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((c) => {
                  const facCount =
                    facilities.filter((f) => f.companyId === c.id).length || c.facilitiesCount;
                  const activeCount = projects.filter(
                    (p) =>
                      p.companyId === c.id && p.status !== "approved" && p.status !== "rejected",
                  ).length;
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
                      <TableCell>
                        <SectorBadge s={c.sector} />
                      </TableCell>
                      <TableCell className="num">{facCount}</TableCell>
                      <TableCell className="num">{activeCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{ color: band.color, borderColor: band.color }}
                        >
                          {band.ar}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditing(c);
                              setDialogOpen(true);
                            }}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setToDelete(c)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CompanyFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="حذف منشأة"
        description={`هل أنت متأكد من حذف "${toDelete?.nameAr}"؟`}
        confirmText="حذف"
        onConfirm={() => {
          if (toDelete) {
            deleteCompany(toDelete.id);
            addAudit({
              user: currentUser.name,
              type: "حذف منشأة",
              description: `حذف ${toDelete.nameAr}`,
              page: "companies/",
              level: "warning",
            });
            toast.success("تم حذف المنشأة");
          }
        }}
      />
      <Toaster position="top-center" />
    </AppShell>
  );
}
