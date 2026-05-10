import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";
import { requestStatusLabel, requestTypeLabel, priorityLabel } from "@/data/requests";
import { useT } from "@/hooks/useT";
import { usePageTitle } from "@/hooks/usePageTitle";

type RequestsSearch = { filter?: "active" | "new" | "in_review" | "waiting" | "approved" };

export const Route = createFileRoute("/requests/")({
  component: RequestsInboxPage,
  validateSearch: (s: Record<string, unknown>): RequestsSearch => {
    const f = s.filter;
    if (f === "active" || f === "new" || f === "in_review" || f === "waiting" || f === "approved") {
      return { filter: f };
    }
    return {};
  },
});

const filterMeta: Record<NonNullable<RequestsSearch["filter"]>, { ar: string; en: string }> = {
  active: { ar: "الطلبات النشطة", en: "Active Requests" },
  new: { ar: "طلبات جديدة", en: "New Requests" },
  in_review: { ar: "قيد المراجعة", en: "Under Review" },
  waiting: { ar: "بانتظار الرد", en: "Awaiting Reply" },
  approved: { ar: "معتمدة", en: "Approved" },
};

function RequestsInboxPage() {
  const requests = useAppStore((s) => s.requests);
  const companies = useAppStore((s) => s.companies);
  const departments = useAppStore((s) => s.departments);
  const { t, lang, name, isAr } = useT();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  usePageTitle(t("incoming_requests") + " — SAIS");
  const [tab, setTab] = useState<"inbox" | "all" | "mine">("inbox");
  const [q, setQ] = useState("");
  const Chevron = isAr ? ChevronLeft : ChevronRight;

  const filtered = useMemo(() => {
    let list = requests;
    if (search.filter === "active") list = list.filter((r) => !["approved", "rejected"].includes(r.status));
    else if (search.filter === "new") list = list.filter((r) => r.status === "submitted");
    else if (search.filter === "in_review") list = list.filter((r) => r.status === "in_review" || r.status === "escalated");
    else if (search.filter === "waiting") list = list.filter((r) => r.status === "additional_docs");
    else if (search.filter === "approved") list = list.filter((r) => r.status === "approved");
    else if (tab === "inbox") list = list.filter((r) => !["approved", "rejected"].includes(r.status));
    else if (tab === "mine") list = list.filter((r) => r.currentDepartment === "compliance");
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.ref.toLowerCase().includes(s) || r.titleAr.includes(q));
    }
    return list;
  }, [requests, tab, q, search.filter]);

  const clearFilter = () => navigate({ search: {} });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Inbox className="h-6 w-6 text-primary" />
              {t("incoming_requests")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isAr
                ? "إدارة الطلبات الواردة وتوجيهها بين الإدارات"
                : "Manage incoming requests and route them between departments"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute end-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? "بحث برقم الطلب أو العنوان" : "Search by reference or title"}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-72 pe-8"
              />
            </div>
          </div>
        </div>

        {search.filter && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{isAr ? "تم الفلترة من اللوحة:" : "Filtered from dashboard:"}</span>
            <Badge variant="secondary">{filterMeta[search.filter][lang]}</Badge>
            <span className="text-muted-foreground">· {filtered.length}</span>
            <Button size="sm" variant="ghost" className="ms-auto h-7" onClick={clearFilter}>
              {isAr ? "مسح الفلتر" : "Clear filter"}
            </Button>
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="inbox">
              {t("tab_inbox")} ({requests.filter((r) => !["approved", "rejected"].includes(r.status)).length})
            </TabsTrigger>
            <TabsTrigger value="all">
              {t("tab_all")} ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="mine">{t("tab_assigned_me")}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-0 overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("col_reference")}</TableHead>
                  <TableHead>{t("col_title")}</TableHead>
                  <TableHead>{t("col_type")}</TableHead>
                  <TableHead>{t("col_company")}</TableHead>
                  <TableHead>{t("col_department")}</TableHead>
                  <TableHead>{t("col_priority")}</TableHead>
                  <TableHead>{t("col_status")}</TableHead>
                  <TableHead>{t("col_received")}</TableHead>
                  <TableHead className="text-end">{t("col_action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const ty = requestTypeLabel[r.type];
                  const st = requestStatusLabel[r.status];
                  const p = priorityLabel[r.priority];
                  const company = companies.find((c) => c.id === r.companyId);
                  const dept = departments.find((d) => d.key === r.currentDepartment);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                      <TableCell className="font-medium max-w-[280px] truncate">{r.titleAr}</TableCell>
                      <TableCell><Badge variant="outline">{ty[lang]}</Badge></TableCell>
                      <TableCell className="text-sm">{name(company)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{name(dept)}</TableCell>
                      <TableCell><Badge variant="outline" className={`border-${p.tone}/40 text-${p.tone}`}>{p[lang]}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{st[lang]}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.receivedAt}</TableCell>
                      <TableCell className="text-end">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/requests/$id" params={{ id: r.id }}>
                            {isAr ? "فتح" : "Open"} <Chevron className="ms-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                      {isAr ? "لا توجد طلبات مطابقة" : "No matching requests"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {filtered.map((r) => {
            const ty = requestTypeLabel[r.type];
            const st = requestStatusLabel[r.status];
            const p = priorityLabel[r.priority];
            const company = companies.find((c) => c.id === r.companyId);
            const dept = departments.find((d) => d.key === r.currentDepartment);
            return (
              <Card key={r.id} className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mono text-[11px] text-muted-foreground">{r.ref}</div>
                  <Badge variant="secondary" className="text-[10px]">{st[lang]}</Badge>
                </div>
                <div className="font-medium text-sm">{r.titleAr}</div>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{ty[lang]}</Badge>
                  <Badge variant="outline" className={`text-[10px] border-${p.tone}/40 text-${p.tone}`}>{p[lang]}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{name(company)} · {name(dept)}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{r.receivedAt}</span>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/requests/$id" params={{ id: r.id }}>
                      {isAr ? "فتح" : "Open"} <Chevron className="ms-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10">{isAr ? "لا توجد طلبات مطابقة" : "No matching requests"}</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
