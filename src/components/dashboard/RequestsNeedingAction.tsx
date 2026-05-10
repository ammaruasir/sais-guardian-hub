import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { requestTypeLabel, priorityLabel } from "@/data/requests";
import { ArrowLeft, ArrowRight, Inbox } from "lucide-react";
import { useT } from "@/hooks/useT";

export function RequestsNeedingAction() {
  const requests = useAppStore((s) => s.requests.filter((r) => r.status === "submitted"));
  const companies = useAppStore((s) => s.companies);
  const { t, lang, name, isAr } = useT();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Inbox className="h-4 w-4 text-warning" />
          {t("needs_action")}
          {requests.length > 0 && (
            <Badge variant="outline" className="border-warning/40 text-warning num">
              {requests.length}
            </Badge>
          )}
        </h2>
        <Button asChild size="sm" variant="ghost">
          <Link to="/requests">{t("view_all")}</Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-6">
          {isAr ? "لا توجد طلبات بانتظار الإسناد ✓" : "No requests awaiting assignment ✓"}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {requests.map((r) => {
            const ty = requestTypeLabel[r.type];
            const p = priorityLabel[r.priority];
            const company = companies.find((c) => c.id === r.companyId);
            const title = lang === "ar" ? r.titleAr : r.titleEn ?? r.titleAr;
            return (
              <div
                key={r.id}
                className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] text-muted-foreground">{r.ref}</div>
                    <div className="text-sm font-semibold mt-0.5 line-clamp-2">{title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {name(company)} · {r.receivedAt}
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-${p.tone}/40 text-${p.tone} shrink-0`}>
                    {p[lang]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{ty[lang]}</Badge>
                  <Button asChild size="sm">
                    <Link to="/requests/$id" params={{ id: r.id }}>
                      {t("assign")} <Arrow className="h-3 w-3 ms-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
