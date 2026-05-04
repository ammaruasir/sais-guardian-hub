import { Link } from "@tanstack/react-router";
import { FileWarning, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActionRequiredCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm border-r-4"
        style={{ borderRightColor: "var(--warning)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
            <FileWarning className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">مطلوب مستندات إضافية</div>
            <div className="mt-1 text-xs text-muted-foreground">مشروع توسعة رأس تنورة — المرحلة 3</div>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/portal/projects/$id" params={{ id: "p1" }}>عرض التفاصيل</Link>
        </Button>
      </div>

      <div
        className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm border-r-4"
        style={{ borderRightColor: "var(--warning)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">اقتراب موعد التقديم</div>
            <div className="mt-1 text-xs text-muted-foreground">خط أنابيب الشرقية — المرحلة 3 — متبقي 3 أيام</div>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/portal/submissions/new" search={{ project: "p6", stage: 3 } as never}>بدء التقديم</Link>
        </Button>
      </div>
    </div>
  );
}
