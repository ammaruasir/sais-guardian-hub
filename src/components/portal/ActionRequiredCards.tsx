import { Link } from "@tanstack/react-router";
import { FileWarning, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";

export function ActionRequiredCards() {
  const projects = useAppStore((s) => s.projects);
  const aramco = projects.filter((p) => p.companyId === "aramco");
  const needsDocs = aramco.filter((p) => p.status === "additional_docs");
  const awaiting = aramco.filter((p) => p.status === "awaiting_submission");

  const items = [
    ...needsDocs.map((p) => ({
      key: `nd-${p.id}`,
      icon: FileWarning,
      title: "مطلوب مستندات إضافية",
      sub: `${p.nameAr} — المرحلة ${p.stage}`,
      to: `/portal/projects/${p.id}`,
      cta: "عرض التفاصيل",
      borderVar: "var(--warning)",
    })),
    ...awaiting.map((p) => ({
      key: `aw-${p.id}`,
      icon: Clock,
      title: "بانتظار تقديم",
      sub: `${p.nameAr} — المرحلة ${p.stage}`,
      to: `/portal/submissions/new?project=${p.id}&stage=${p.stage}`,
      cta: "بدء التقديم",
      borderVar: "var(--warning)",
    })),
  ].slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success" />
        لا توجد إجراءات مطلوبة حالياً — جميع المشاريع في المسار.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.key}
          className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm border-r-4"
          style={{ borderRightColor: it.borderVar }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{it.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to={it.to}>{it.cta}</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
