import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Consultant, specializationLabel, consultantStatusLabel } from "@/data/consultants";
import { useAppStore } from "@/store/appStore";
import { companyAssignedConsultant } from "@/data/facilities";
import { Mail, Phone } from "lucide-react";

export function ConsultantDetailDialog({ consultant, open, onOpenChange }: { consultant: Consultant | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const projects = useAppStore((s) => s.projects);
  const companies = useAppStore((s) => s.companies);
  if (!consultant) return null;
  const assignedCompanyIds = Object.entries(companyAssignedConsultant)
    .filter(([, cid]) => cid === consultant.id)
    .map(([compId]) => compId);
  const linkedProjects = projects.filter((p) => assignedCompanyIds.includes(p.companyId));
  const status = consultantStatusLabel[consultant.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-end">
            <div>{consultant.nameAr}</div>
            <div className="text-xs font-normal text-muted-foreground">{consultant.nameEn}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {consultant.specializations.map((s) => (
              <Badge key={s} variant="outline" className="bg-accent/40">{specializationLabel[s]}</Badge>
            ))}
            <Badge variant="outline" className={status.cls}>{status.ar}</Badge>
          </div>
          <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">رقم الترخيص</span>
              <span className="num font-medium">{consultant.licenseNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">انتهاء الترخيص</span>
              <span className="num font-medium">{consultant.licenseExpiry}</span>
            </div>
            {consultant.phone && (
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span className="num">{consultant.phone}</span></div>
            )}
            {consultant.email && (
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{consultant.email}</span></div>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">المشاريع المرتبطة</h4>
            <div className="space-y-1 text-sm">
              {linkedProjects.length === 0 && <div className="text-xs text-muted-foreground">لا مشاريع</div>}
              {linkedProjects.map((p) => {
                const c = companies.find((x) => x.id === p.companyId);
                return (
                  <div key={p.id} className="flex items-center justify-between rounded-md border p-2">
                    <span>{p.nameAr}</span>
                    <span className="text-xs text-muted-foreground">{c?.nameAr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
