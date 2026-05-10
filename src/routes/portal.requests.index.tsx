import { createFileRoute, Link } from "@tanstack/react-router";

import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft } from "lucide-react";
import { requestStatusLabel, requestTypeLabel } from "@/data/requests";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/portal/requests/")({
  component: PortalRequestsList,
});

function PortalRequestsList() {
  const requests = useAppStore((s) => s.requests).filter((r) => r.companyId === "aramco");
  const departments = useAppStore((s) => s.departments);
  const { t, isAr, name } = useT();

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("my_requests")}</h1>
            <p className="text-sm text-muted-foreground">
              {isAr ? "جميع الطلبات المقدّمة للهيئة" : "All requests submitted to the Authority"}
            </p>
          </div>
          <Button asChild>
            <Link to="/portal/requests/new"><Plus className="h-4 w-4 me-1" /> {t("new_request_short")}</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => {
            const st = requestStatusLabel[r.status];
            const tp = requestTypeLabel[r.type];
            const dept = departments.find((d) => d.key === r.currentDepartment);
            return (
              <Card key={r.id} className="p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-mono text-[11px] text-muted-foreground">{r.ref}</div>
                  <Badge variant="outline">{isAr ? tp.ar : tp.en}</Badge>
                </div>
                <div className="font-semibold text-sm mb-2">{r.titleAr}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-3">{r.descriptionAr}</div>
                <div className="text-xs text-muted-foreground">
                  {isAr ? "لدى:" : "With:"} {name(dept ?? null)}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="secondary">{isAr ? st.ar : st.en}</Badge>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/portal/requests/$id" params={{ id: r.id }}>
                      {isAr ? "فتح" : "Open"} <ChevronLeft className="h-3 w-3 ms-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
