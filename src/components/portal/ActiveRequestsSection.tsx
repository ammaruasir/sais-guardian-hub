import { Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileStack, Plus } from "lucide-react";
import { requestStatusLabel } from "@/data/requests";

export function ActiveRequestsSection() {
  const requests = useAppStore((s) => s.requests).filter((r) => r.companyId === "aramco");
  const departments = useAppStore((s) => s.departments);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FileStack className="h-5 w-5 text-primary" />
          الطلبات النشطة
        </h2>
        <Button asChild size="sm" variant="outline">
          <Link to="/portal/requests/new"><Plus className="h-3 w-3 me-1" /> طلب جديد</Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          لا توجد طلبات نشطة. ابدأ بتقديم طلب جديد.
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {requests.slice(0, 4).map((r) => {
            const st = requestStatusLabel[r.status];
            const dept = departments.find((d) => d.key === r.currentDepartment);
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-mono text-[11px] text-muted-foreground">{r.ref}</div>
                    <div className="font-medium text-sm mt-1 line-clamp-2">{r.titleAr}</div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{st.ar}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  لدى: <span className="text-foreground">{dept?.nameAr}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">آخر تحديث: {r.lastUpdate}</div>
                <Button asChild size="sm" variant="ghost" className="mt-2 -ms-2">
                  <Link to="/portal/requests/$id" params={{ id: r.id }}>
                    تفاصيل <ChevronLeft className="h-3 w-3 ms-1" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
