import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sectorLabel, type Sector } from "@/data";

const projectTypes = [
  { v: "new", ar: "إنشاء جديد" },
  { v: "expansion", ar: "توسعة" },
  { v: "upgrade", ar: "تطوير" },
  { v: "recommissioning", ar: "إعادة تشغيل" },
];

const classes = [
  { v: "critical", ar: "حرجة" },
  { v: "high", ar: "عالية" },
  { v: "medium", ar: "متوسطة" },
  { v: "low", ar: "منخفضة" },
];

export function RequirementsWizard() {
  const [sector, setSector] = useState<Sector>("petroleum");
  const [type, setType] = useState("expansion");
  const [cls, setCls] = useState("critical");

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Step n={1} label="نوع المنشأة / القطاع">
        <Select value={sector} onValueChange={(v) => setSector(v as Sector)}>
          <SelectTrigger className="w-full md:w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(sectorLabel) as Sector[]).map((s) => (
              <SelectItem key={s} value={s}>
                {sectorLabel[s].ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Step>

      <Step n={2} label="نوع المشروع">
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={(v) => v && setType(v)}
          className="flex-wrap justify-start"
        >
          {projectTypes.map((t) => (
            <ToggleGroupItem
              key={t.v}
              value={t.v}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {t.ar}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Step>

      <Step n={3} label="تصنيف المنشأة">
        <ToggleGroup
          type="single"
          value={cls}
          onValueChange={(v) => v && setCls(v)}
          className="flex-wrap justify-start"
        >
          {classes.map((c) => (
            <ToggleGroupItem
              key={c.v}
              value={c.v}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {c.ar}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Step>
    </div>
  );
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-2 md:w-56">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/15 text-secondary text-xs font-bold num">
          {n}
        </div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
