import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { reviewers, sectorLabel, stageLabel, statusLabel, type ProjectStatus, type Sector, type Stage } from "@/data";
import { useAppStore } from "@/store/appStore";

export type ProjectFilters = {
  q: string;
  sector: Sector | "all";
  stage: Stage | "all";
  status: ProjectStatus | "all";
  company: string;
  reviewer: string;
};

export const defaultFilters: ProjectFilters = {
  q: "",
  sector: "all",
  stage: "all",
  status: "all",
  company: "all",
  reviewer: "all",
};

export function ProjectsFilters({
  value,
  onChange,
}: {
  value: ProjectFilters;
  onChange: (f: ProjectFilters) => void;
}) {
  const set = <K extends keyof ProjectFilters>(k: K, v: ProjectFilters[K]) => onChange({ ...value, [k]: v });
  const companies = useAppStore((s) => s.companies);
  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card p-3 md:grid-cols-3 lg:grid-cols-7">
      <div className="relative lg:col-span-2">
        <Search className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="ابحث باسم المشروع..."
          className="pe-8"
        />
      </div>
      <Select value={value.sector} onValueChange={(v) => set("sector", v as any)}>
        <SelectTrigger><SelectValue placeholder="القطاع" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل القطاعات</SelectItem>
          {Object.entries(sectorLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v.ar}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={String(value.stage)} onValueChange={(v) => set("stage", v === "all" ? "all" : (Number(v) as Stage))}>
        <SelectTrigger><SelectValue placeholder="المرحلة" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل المراحل</SelectItem>
          {([1, 2, 3, 4] as Stage[]).map((s) => <SelectItem key={s} value={String(s)}>{stageLabel[s].ar}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.status} onValueChange={(v) => set("status", v as any)}>
        <SelectTrigger><SelectValue placeholder="الحالة" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الحالات</SelectItem>
          {Object.entries(statusLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v.ar}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.company} onValueChange={(v) => set("company", v)}>
        <SelectTrigger><SelectValue placeholder="المنشأة" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل المنشآت</SelectItem>
          {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.reviewer} onValueChange={(v) => set("reviewer", v)}>
        <SelectTrigger><SelectValue placeholder="المراجع" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل المراجعين</SelectItem>
          {reviewers.map((r) => <SelectItem key={r.id} value={r.id}>{r.nameAr}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)} className="gap-1 lg:col-span-7 lg:justify-self-start">
        <X className="h-4 w-4" /> إعادة ضبط
      </Button>
    </div>
  );
}

export function applyFilters<T extends { nameAr: string; nameEn: string; sector: Sector; stage: Stage; status: ProjectStatus; companyId: string; reviewerId: string }>(
  rows: T[],
  f: ProjectFilters,
): T[] {
  return rows.filter((p) => {
    if (f.q && !`${p.nameAr} ${p.nameEn}`.toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.sector !== "all" && p.sector !== f.sector) return false;
    if (f.stage !== "all" && p.stage !== f.stage) return false;
    if (f.status !== "all" && p.status !== f.status) return false;
    if (f.company !== "all" && p.companyId !== f.company) return false;
    if (f.reviewer !== "all" && p.reviewerId !== f.reviewer) return false;
    return true;
  });
}
