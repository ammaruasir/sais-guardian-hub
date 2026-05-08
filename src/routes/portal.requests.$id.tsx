import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { AssignmentChain } from "@/components/requests/AssignmentChain";
import { LetterTemplate } from "@/components/letters/LetterTemplate";
import { requestStatusLabel, requestTypeLabel, priorityLabel } from "@/data/requests";
import { letterTypeLabel } from "@/data/letters";
import { FileWarning, Upload, Mail, Eye, Printer, Reply } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/requests/$id")({
  component: PortalRequestDetail,
});

function PortalRequestDetail() {
  const { id } = Route.useParams();
  const request = useAppStore((s) => s.requests.find((r) => r.id === id));
  const departments = useAppStore((s) => s.departments);
  const addRequestDocument = useAppStore((s) => s.addRequestDocument);
  const addRequestComment = useAppStore((s) => s.addRequestComment);
  const allLetters = useAppStore((s) => s.letters);
  const updateRequestStatus = useAppStore((s) => s.requests);
  const setRequests = useAppStore.setState;
  const [response, setResponse] = useState("");
  const [viewLetterId, setViewLetterId] = useState<string | undefined>();

  if (!request) throw notFound();

  const dept = departments.find((d) => d.key === request.currentDepartment);
  const t = requestTypeLabel[request.type];
  const st = requestStatusLabel[request.status];
  const p = priorityLabel[request.priority];

  const externalComments = request.comments.filter((c) => c.visibility === "external");
  const sentLetters = allLetters.filter((l) => l.requestId === request.id && l.status === "sent");
  const viewedLetter = viewLetterId ? allLetters.find((l) => l.id === viewLetterId) : undefined;
  const additionalDocsLetter = sentLetters.find((l) => l.type === "additional_docs");

  const submitResponse = (linkedLetterRef?: string) => {
    if (!response.trim() && !linkedLetterRef) return;
    addRequestDocument(request.id, { nameAr: "رد المنشأة على طلب المستندات.pdf", uploadedBy: request.companyId, sizeKb: 850 });
    addRequestComment(request.id, {
      authorAr: "المنشأة",
      visibility: "external",
      body: linkedLetterRef ? `تم الرد على الخطاب رقم ${linkedLetterRef}. ${response}` : response,
    });
    // flip request back to in_review
    setRequests((s) => ({
      requests: s.requests.map((r) =>
        r.id === request.id ? { ...r, status: "in_review", lastUpdate: new Date().toISOString().slice(0, 10) } : r,
      ),
    }));
    setResponse("");
    toast.success("تم إرسال الرد والمستندات");
  };

  const printLetter = () => {
    document.body.classList.add("print-letter-mode");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-letter-mode");
    }, 50);
  };

  // suppress unused warn
  void updateRequestStatus;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link to="/portal/requests" className="text-xs text-muted-foreground hover:text-primary">
            ← طلباتي
          </Link>
          <div className="mt-2 flex items-end justify-between gap-3 flex-wrap">
            <div>
              <div className="font-mono text-xs text-muted-foreground">{request.ref}</div>
              <h1 className="text-2xl font-bold tracking-tight">{request.titleAr}</h1>
              <p className="text-sm text-muted-foreground mt-1">{request.descriptionAr}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{t.ar}</Badge>
              <Badge variant="outline" className={`border-${p.tone}/40 text-${p.tone}`}>{p.ar}</Badge>
              <Badge variant="secondary">{st.ar}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">الإدارة الحالية</div>
            <div className="text-sm font-medium mt-1">{dept?.nameAr}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">تاريخ التقديم</div>
            <div className="text-sm font-medium mt-1">{request.receivedAt}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">آخر تحديث</div>
            <div className="text-sm font-medium mt-1">{request.lastUpdate}</div>
          </Card>
        </div>

        {request.status === "additional_docs" && (
          <Card className="p-4 border-warning/40 bg-warning/5">
            <div className="flex items-center gap-2 mb-2">
              <FileWarning className="h-5 w-5 text-warning" />
              <h2 className="font-bold text-sm">مطلوب مستندات إضافية</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {request.chain[request.chain.length - 1]?.noteAr ?? "يرجى إرفاق المستندات الإضافية المطلوبة."}
            </p>
            <Textarea placeholder="اكتب ملاحظتك مع الرد..." value={response} onChange={(e) => setResponse(e.target.value)} rows={3} />
            <Button size="sm" className="mt-2" onClick={submitResponse}>
              <Upload className="h-3 w-3 me-1" /> إرفاق مستندات وإرسال الرد
            </Button>
          </Card>
        )}

        <Card className="p-4">
          <h2 className="text-sm font-bold mb-3">مسار الطلب</h2>
          <AssignmentChain chain={request.chain} />
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-sm font-bold mb-3">المستندات</h3>
            <div className="space-y-2">
              {request.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm border-b border-border py-2">
                  <span>{d.nameAr}</span>
                  <span className="text-xs text-muted-foreground">{d.ts}</span>
                </div>
              ))}
              {request.documents.length === 0 && <div className="text-sm text-muted-foreground">لا توجد مستندات</div>}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold mb-3">رسائل من الهيئة</h3>
            <div className="space-y-2">
              {externalComments.map((c) => (
                <div key={c.id} className="rounded border border-border bg-muted/30 p-2 text-sm">
                  <div className="text-xs font-medium mb-1">{c.authorAr}</div>
                  {c.body}
                  <div className="text-[11px] text-muted-foreground mt-1">{c.ts}</div>
                </div>
              ))}
              {externalComments.length === 0 && <div className="text-sm text-muted-foreground">لا توجد رسائل</div>}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
