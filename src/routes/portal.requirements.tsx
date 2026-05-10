import { createFileRoute, Link } from "@tanstack/react-router";
import { RequirementsWizard } from "@/components/portal/requirements/RequirementsWizard";
import { RequirementsTree } from "@/components/portal/requirements/RequirementsTree";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/portal/requirements")({
  component: RequirementsPage,
});

function RequirementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">مستكشف المتطلبات</h1>
        <p className="text-sm text-muted-foreground">
          حدد نوع المنشأة والمشروع لاستعراض المتطلبات المطلوبة عبر المراحل الأربع
        </p>
      </div>
      <RequirementsWizard />
      <RequirementsTree />
      <Card className="p-5 flex items-center justify-between gap-3 flex-wrap border-primary/30 bg-primary/5">
        <div>
          <div className="font-bold text-sm">جاهز؟ قدّم طلبك الآن</div>
          <p className="text-xs text-muted-foreground mt-1">
            بعد مراجعة المتطلبات، يمكنك تقديم طلب جديد للهيئة مباشرة.
          </p>
        </div>
        <Button asChild>
          <Link to="/portal/requests/new"><Plus className="h-4 w-4 me-1" /> تقديم طلب جديد</Link>
        </Button>
      </Card>
    </div>
  );
}
