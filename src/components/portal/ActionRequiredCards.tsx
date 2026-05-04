import { Link } from "@tanstack/react-router";
import { FileWarning, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  {
    icon: FileWarning,
    title: "مطلوب مستندات إضافية",
    body: "مشروع توسعة رأس تنورة — المرحلة 3",
    cta: "عرض التفاصيل",
    to: "/portal/projects" as const,
  },
  {
    icon: Clock,
    title: "اقتراب موعد التقديم",
    body: "خط أنابيب الشرقية — المرحلة 3 — متبقي 3 أيام",
    cta: "بدء التقديم",
    to: "/portal/submissions/new" as const,
  },
];

export function ActionRequiredCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.title}
          className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm border-r-4"
          style={{ borderRightColor: "var(--warning)" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{it.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{it.body}</div>
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
