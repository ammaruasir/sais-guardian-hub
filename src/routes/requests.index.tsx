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

export const Route = createFileRoute("/requests/")({
  component: RequestsInboxPage,
});

function RequestsInboxPage() {
  const requests = useAppStore((s) => s.requests);
  const companies = useAppStore((s) => s.companies);
  const departments = useAppStore((s) => s.departments);
  const { t, lang, name, isAr } = useT();
  const [tab, setTab] = useState<"inbox" | "all" | "mine">("inbox");
  const [q, setQ] = useState("");
  const Chevron = isAr ? ChevronLeft : ChevronRight;

  const filtered = useMemo(() => {
    let list = requests;
    if (tab === "inbox") list = list.filter((r) => !["approved", "rejected"].includes(r.status));
    if (tab === "mine") list = list.filter((r) => r.currentDepartment === "compliance");
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.ref.toLowerCase().includes(s) || r.titleAr.includes(q));
    }
    return list;
  }, [requests, tab, q]);

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

        <Card className="p-0 overflow-hidden">
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
        </Card>
      </div>
    </AppShell>
  );
}
