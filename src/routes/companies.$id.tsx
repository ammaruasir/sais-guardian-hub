import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClassificationBadge, SectorBadge, StatusChip } from "@/components/projects/Badges";
import { ComplianceGauge, complianceBadgeFor } from "@/components/companies/ComplianceGauge";
import { FacilityCard } from "@/components/companies/FacilityCard";
import { stageLabel } from "@/data";
import { facilities, companyComplianceScore, companyAssignedConsultant } from "@/data/facilities";
import { useAppStore } from "@/store/appStore";
import { departments, requestStatusLabel, requestTypeLabel } from "@/data/requests";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/companies/$id")({
  component: CompanyDetailPage,
});

function CompanyDetailPage() {
  const { id } = Route.useParams();
  const companies = useAppStore((s) => s.companies);
  const projects = useAppStore((s) => s.projects);
  const consultants = useAppStore((s) => s.consultants);
  const company = companies.find((c) => c.id === id);
  if (!company) {
    return (
      <AppShell>
        <div className="rounded-lg border bg-card p-6">المنشأة غير موجودة</div>
      </AppShell>
    );
  }
  const score = companyComplianceScore[company.id] ?? 70;
  const band = complianceBadgeFor(score);
  const facs = facilities.filter((f) => f.companyId === company.id);
  const projs = projects.filter((p) => p.companyId === company.id);
  const consultant = consultants.find((c) => c.id === companyAssignedConsultant[company.id]);

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{company.nameAr}</h1>
              <p className="text-sm text-muted-foreground">{company.nameEn}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <SectorBadge s={company.sector} />
                <Badge variant="outline" style={{ color: band.color, borderColor: band.color }}>
                  {band.ar}
                </Badge>
              </div>
            </div>
            <ComplianceGauge score={score} />
          </div>
        </Card>

        {consultant && (
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              الاستشاري المعتمد من الهيئة
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">{consultant.nameAr}</div>
                <div className="text-xs text-muted-foreground">{consultant.nameEn}</div>
              </div>
              <div className="num text-xs text-muted-foreground">
                رقم الترخيص: {consultant.licenseNo}
              </div>
            </div>
          </Card>
        )}

        <section>
          <h2 className="mb-3 text-lg font-bold">المنشآت ({facs.length})</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facs.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">المشاريع النشطة ({projs.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {projs.map((p) => (
              <Link key={p.id} to="/projects/$id" params={{ id: p.id }}>
                <Card className="p-4 transition hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold">{p.nameAr}</div>
                      <div className="text-xs text-muted-foreground">{p.nameEn}</div>
                    </div>
                    <ClassificationBadge c={p.classification} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 w-10 rounded-full ${s < p.stage ? "bg-success" : s === p.stage ? "bg-primary" : "bg-muted"}`}
                          title={stageLabel[s as 1 | 2 | 3 | 4].ar}
                        />
                      ))}
                    </div>
                    <StatusChip s={p.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
