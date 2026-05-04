import { createFileRoute } from "@tanstack/react-router";
import { RequirementsWizard } from "@/components/portal/requirements/RequirementsWizard";
import { RequirementsTree } from "@/components/portal/requirements/RequirementsTree";

export const Route = createFileRoute("/portal/requirements")({
  component: RequirementsPage,
});

function RequirementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">مستكشف المتطلبات</h1>
        <p className="text-sm text-muted-foreground">حدد نوع المنشأة والمشروع لاستعراض المتطلبات المطلوبة عبر المراحل الأربع</p>
      </div>
      <RequirementsWizard />
      <RequirementsTree />
    </div>
  );
}
