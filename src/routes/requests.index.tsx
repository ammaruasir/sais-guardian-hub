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
import { ChevronLeft, Search, Inbox } from "lucide-react";
import { requestStatusLabel, requestTypeLabel, priorityLabel } from "@/data/requests";

export const Route = createFileRoute("/requests/")({
  component: RequestsInboxPage,
});

function RequestsInboxPage() {
  const requests = useAppStore((s) => s.requests);
  const companies = useAppStore((s) => s.companies);
  const departments = useAppStore((s) => s.departments);
  const [tab, setTab] = useState<"inbox" | "all" | "mine">("inbox");
  const [q, setQ] = useState("");

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

  const companyName = (id: string) => companies.find((c) => c.id === id)?.nameAr ?? id;
  const deptName = (k: string) => departments.find((d) => d.key === k)?.nameAr ?? k;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Inbox className="h-6 w-6 text-primary" />
              الطلبات
            </h1>
            <p className="text-sm text-muted-foreground">إدارة الطلبات الواردة وتوجيهها بين الإدارات</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute end-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الطلب أو العنوان"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-72 pe-8"
              />
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="inbox">الوارد ({requests.filter((r) => !["approved", "rejected"].includes(r.status)).length})</TabsTrigger>
            <TabsTrigger value="all">الكل ({requests.length})</TabsTrigger>
            <TabsTrigger value="mine">المسندة لي</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المرجع</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المنشأة</TableHead>
                <TableHead>الإدارة الحالية</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الاستلام</TableHead>
                <TableHead className="text-end">إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const t = requestTypeLabel[r.type];
                const st = requestStatusLabel[r.status];
                const p = priorityLabel[r.priority];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                    <TableCell className="font-medium max-w-[280px] truncate">{r.titleAr}</TableCell>
                    <TableCell><Badge variant="outline">{t.ar}</Badge></TableCell>
                    <TableCell className="text-sm">{companyName(r.companyId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{deptName(r.currentDepartment)}</TableCell>
                    <TableCell><Badge variant="outline" className={`border-${p.tone}/40 text-${p.tone}`}>{p.ar}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{st.ar}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.receivedAt}</TableCell>
                    <TableCell className="text-end">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/requests/$id" params={{ id: r.id }}>
                          فتح <ChevronLeft className="ms-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                    لا توجد طلبات مطابقة
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
