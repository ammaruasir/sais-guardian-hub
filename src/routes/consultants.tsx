import { useMemo, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
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
import {
  consultantStatusLabel,
  specializationLabel,
  type Consultant,
  type ConsultantStatus,
  type Specialization,
} from "@/data/consultants";
import { ConsultantDetailDialog } from "@/components/consultants/ConsultantDetailDialog";
import { ConsultantFormDialog } from "@/components/consultants/ConsultantFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAppStore } from "@/store/appStore";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/consultants")({
  component: GuardedConsultants,
});

function GuardedConsultants() {
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return <ConsultantsPage />;
}

function ConsultantsPage() {
  const { currentUser } = useRole();
  const consultants = useAppStore((s) => s.consultants);
  const deleteConsultant = useAppStore((s) => s.deleteConsultant);
  const addAudit = useAppStore((s) => s.addAudit);
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [active, setActive] = useState<Consultant | null>(null);
  const [editing, setEditing] = useState<Consultant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Consultant | null>(null);

  const rows = useMemo(() => {
    return consultants.filter((c) => {
      if (spec !== "all" && !c.specializations.includes(spec as Specialization)) return false;
      if (status !== "all" && c.status !== status) return false;
      if (q && !`${c.nameAr} ${c.nameEn}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, spec, status, consultants]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">الاستشاريون المعتمدون</h1>
            <p className="text-sm text-muted-foreground">
              قائمة شركات الاستشارات الأمنية المعتمدة من الهيئة
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="ms-1 h-4 w-4" />
            إضافة استشاري
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم الشركة"
            className="max-w-xs"
          />
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="التخصص" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التخصصات</SelectItem>
              {(Object.keys(specializationLabel) as Specialization[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {specializationLabel[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {(Object.keys(consultantStatusLabel) as ConsultantStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {consultantStatusLabel[s].ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-end">اسم الشركة</TableHead>
                <TableHead className="text-end">رقم الترخيص</TableHead>
                <TableHead className="text-end">التخصص</TableHead>
                <TableHead className="text-end">المشاريع النشطة</TableHead>
                <TableHead className="text-end">انتهاء الترخيص</TableHead>
                <TableHead className="text-end">الحالة</TableHead>
                <TableHead className="text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    لا توجد نتائج مطابقة
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((c) => {
                  const st = consultantStatusLabel[c.status];
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="cursor-pointer" onClick={() => setActive(c)}>
                        <div className="font-semibold">{c.nameAr}</div>
                        <div className="text-xs text-muted-foreground">{c.nameEn}</div>
                      </TableCell>
                      <TableCell className="num">{c.licenseNo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.specializations.map((s) => (
                            <Badge key={s} variant="outline" className="bg-accent/40">
                              {specializationLabel[s]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="num">{c.activeProjects}</TableCell>
                      <TableCell className="num">{c.licenseExpiry}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={st.cls}>
                          {st.ar}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(c);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
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

        <ConsultantDetailDialog
          consultant={active}
          open={!!active}
          onOpenChange={(o) => !o && setActive(null)}
        />
        <ConsultantFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} />
        <ConfirmDialog
          open={!!toDelete}
          onOpenChange={(v) => !v && setToDelete(null)}
          title="حذف استشاري"
          description={`هل أنت متأكد من حذف "${toDelete?.nameAr}"؟`}
          confirmText="حذف"
          onConfirm={() => {
            if (toDelete) {
              deleteConsultant(toDelete.id);
              addAudit({
                user: currentUser.name,
                type: "حذف استشاري",
                description: `حذف ${toDelete.nameAr}`,
                page: "consultants/",
                level: "warning",
              });
              toast.success("تم حذف الاستشاري");
            }
          }}
        />
      </div>
      <Toaster position="top-center" />
    </AppShell>
  );
}
