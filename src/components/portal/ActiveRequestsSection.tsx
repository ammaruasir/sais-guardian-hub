import { Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileStack, Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { requestStatusLabel, requestTypeLabel } from "@/data/requests";
import { useT } from "@/hooks/useT";

export function ActiveRequestsSection() {
  const allRequests = useAppStore((s) => s.requests);
  const requests = allRequests.filter(
    (r) => r.companyId === "aramco" && r.status !== "approved" && r.status !== "rejected",
  );
  const departments = useAppStore((s) => s.departments);
  const { t, isAr, name } = useT();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FileStack className="h-5 w-5 text-primary" />
          {t("active_requests")}
        </h2>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link to="/portal/requests">{t("view_all")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/portal/requests/new"><Plus className="h-3 w-3 me-1" /> {t("new_request")}</Link>
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          {isAr ? "لا توجد طلبات نشطة. ابدأ بتقديم طلب جديد." : "No active requests. Start by submitting a new one."}
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("col_reference")}</TableHead>
                <TableHead>{t("col_title")}</TableHead>
                <TableHead>{t("col_type")}</TableHead>
                <TableHead>{t("col_status")}</TableHead>
                <TableHead>{t("col_department")}</TableHead>
                <TableHead>{isAr ? "آخر تحديث" : "Last update"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.slice(0, 8).map((r) => {
                const st = requestStatusLabel[r.status];
                const tp = requestTypeLabel[r.type];
                const dept = departments.find((d) => d.key === r.currentDepartment);
                return (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-accent/40 relative">
                    <TableCell className="font-mono text-xs">
                      <Link
                        to="/portal/requests/$id"
                        params={{ id: r.id }}
                        className="absolute inset-0"
                        aria-label={r.titleAr}
                      />
                      {r.ref}
                    </TableCell>
                    <TableCell className="font-medium max-w-[280px] truncate">{r.titleAr}</TableCell>
                    <TableCell><Badge variant="outline">{isAr ? tp.ar : tp.en}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-${st.tone}/40 text-${st.tone}`}>
                        {isAr ? st.ar : st.en}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{name(dept ?? null)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground num">{r.lastUpdate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
