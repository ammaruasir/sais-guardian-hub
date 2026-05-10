import { createFileRoute, Link } from "@tanstack/react-router";
import { RequirementsWizard } from "@/components/portal/requirements/RequirementsWizard";
import { RequirementsTree } from "@/components/portal/requirements/RequirementsTree";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useT } from "@/hooks/useT";
import { usePageTitle } from "@/hooks/usePageTitle";

export const Route = createFileRoute("/portal/requirements")({
  component: RequirementsPage,
});

function RequirementsPage() {
  const { t, isAr } = useT();
  usePageTitle(t("requirements") + " — " + t("company_portal"));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isAr ? "مستكشف المتطلبات" : "Requirements Explorer"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAr
            ? "حدد نوع المنشأة والمشروع لاستعراض المتطلبات المطلوبة عبر المراحل الأربع"
            : "Select facility and project type to explore requirements across the four stages"}
        </p>
      </div>
      <RequirementsWizard />
      <RequirementsTree />
      <Card className="p-5 flex items-center justify-between gap-3 flex-wrap border-primary/30 bg-primary/5">
        <div>
          <div className="font-bold text-sm">{t("ready_submit")}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr
              ? "بعد مراجعة المتطلبات، يمكنك تقديم طلب جديد للهيئة مباشرة."
              : "Once you've reviewed the requirements, you can submit a new request directly."}
          </p>
        </div>
        <Button asChild>
          <Link to="/portal/requests/new"><Plus className="h-4 w-4 me-1" /> {t("new_request")}</Link>
        </Button>
      </Card>
    </div>
  );
}
