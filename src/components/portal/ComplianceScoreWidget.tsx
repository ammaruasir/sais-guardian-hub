import { ComplianceGauge } from "@/components/companies/ComplianceGauge";

export function ComplianceScoreWidget() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
      <h2 className="self-start text-base font-semibold">نسبة الامتثال الكلية</h2>
      <ComplianceGauge score={85} size={160} />
      <div className="text-xs text-muted-foreground">عبر جميع المنشآت</div>
    </div>
  );
}
