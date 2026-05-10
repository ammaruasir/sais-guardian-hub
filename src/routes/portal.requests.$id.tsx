import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { AssignmentChain } from "@/components/requests/AssignmentChain";
import { LetterTemplate } from "@/components/letters/LetterTemplate";
import { LetterReplyDialog } from "@/components/letters/LetterReplyDialog";
import { requestStatusLabel, requestTypeLabel, priorityLabel } from "@/data/requests";
import { letterTypeLabel, type Letter } from "@/data/letters";
import { FileWarning, Mail, Eye, Printer, Reply, FileText, MessageSquare, CheckCircle2, XCircle, Info, ChevronLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/requests/$id")({
  component: PortalRequestDetail,
});

function PortalRequestDetail() {
  const { id } = Route.useParams();
  const request = useAppStore((s) => s.requests.find((r) => r.id === id));
  const departments = useAppStore((s) => s.departments);
  const companies = useAppStore((s) => s.companies);
  const allLetters = useAppStore((s) => s.letters);
  const [viewLetterId, setViewLetterId] = useState<string | undefined>();
  const [replyLetter, setReplyLetter] = useState<Letter | undefined>();

  if (!request) throw notFound();

  const dept = departments.find((d) => d.key === request.currentDepartment);
  const company = companies.find((c) => c.id === request.companyId);
  const t = requestTypeLabel[request.type];
  const st = requestStatusLabel[request.status];
  const p = priorityLabel[request.priority];

  const externalComments = request.comments.filter((c) => c.visibility === "external");
  const sentLetters = allLetters.filter((l) => l.requestId === request.id && l.status === "sent");
  const viewedLetter = viewLetterId ? allLetters.find((l) => l.id === viewLetterId) : undefined;
  const pendingActionLetter = sentLetters.find(
    (l) => l.type === "additional_docs" && request.status === "additional_docs",
  );

  const printLetter = () => {
    document.body.classList.add("print-letter-mode");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-letter-mode");
    }, 50);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
          <Link to="/portal" className="hover:text-foreground">الرئيسية</Link>
          <ChevronLeft className="h-3 w-3" />
          <Link to="/portal/requests" className="hover:text-foreground">طلباتي</Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="text-foreground font-mono">{request.ref}</span>
        </nav>
        <div>
          <Link to="/portal/requests" className="text-xs text-muted-foreground hover:text-primary">
            ← العودة لقائمة الطلبات
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

        <StatusBanner
          status={request.status}
          requestId={request.id}
        />

        {pendingActionLetter && (
          <Card className="border-warning/40 bg-warning/5 p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <FileWarning className="h-6 w-6 text-warning mt-0.5" />
                <div>
                  <h2 className="font-bold text-sm">إجراء مطلوب — خطاب رسمي بانتظار الرد</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    خطاب رقم <span className="num font-bold">{pendingActionLetter.ref}</span> —{" "}
                    {pendingActionLetter.subjectAr}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setViewLetterId(pendingActionLetter.id)}>
                  <Eye className="h-3 w-3 me-1" /> عرض الخطاب
                </Button>
                <Button size="sm" onClick={() => setReplyLetter(pendingActionLetter)}>
                  <Reply className="h-3 w-3 me-1" /> تسلّم والرد
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h2 className="text-sm font-bold mb-3">مسار الطلب</h2>
          <AssignmentChain chain={request.chain} />
        </Card>

        <Tabs defaultValue="letters">
          <TabsList>
            <TabsTrigger value="letters">
              <Mail className="h-4 w-4 me-1" /> الخطابات الرسمية{" "}
              {sentLetters.length > 0 && (
                <Badge variant="secondary" className="ms-2 num">{sentLetters.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 me-1" /> المستندات
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 me-1" /> الرسائل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="letters">
            <Card className="p-0 overflow-hidden">
              <div className="space-y-0">
                {sentLetters.map((l) => {
                  const lt = letterTypeLabel[l.type];
                  const needsReply =
                    l.type === "additional_docs" && request.status === "additional_docs";
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between gap-3 border-b border-border p-4 last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`border-${lt.tone}/40 text-${lt.tone}`}>
                            {lt.ar}
                          </Badge>
                          <span className="num text-xs text-muted-foreground">{l.ref}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="num text-xs text-muted-foreground">{l.gregorianDate}</span>
                          {needsReply && (
                            <Badge variant="outline" className="border-warning/40 text-warning">
                              بحاجة للرد
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium">{l.subjectAr}</div>
                        <div className="text-xs text-muted-foreground">من: {l.signatoryAr} — {l.signatoryTitleAr}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => setViewLetterId(l.id)}>
                          <Eye className="h-3 w-3 me-1" /> عرض
                        </Button>
                        {needsReply && (
                          <Button size="sm" onClick={() => setReplyLetter(l)}>
                            <Reply className="h-3 w-3 me-1" /> تسلّم والرد
                          </Button>
                        )}
                        {!needsReply && (
                          <Button size="sm" variant="ghost" onClick={() => setReplyLetter(l)}>
                            <Reply className="h-3 w-3 me-1" /> تأكيد التسلّم
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {sentLetters.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-10">
                    لا توجد خطابات رسمية لهذا الطلب بعد
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-4">
              <div className="space-y-2">
                {request.documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-sm border-b border-border py-2 last:border-b-0">
                    <span>{d.nameAr}</span>
                    <span className="text-xs text-muted-foreground num">{d.ts} • {d.sizeKb} KB</span>
                  </div>
                ))}
                {request.documents.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6">لا توجد مستندات</div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="p-4">
              <div className="space-y-2">
                {externalComments.map((c) => (
                  <div key={c.id} className="rounded border border-border bg-muted/30 p-3 text-sm whitespace-pre-line">
                    <div className="text-xs font-medium mb-1">{c.authorAr}</div>
                    {c.body}
                    <div className="text-[11px] text-muted-foreground mt-2 num">{c.ts}</div>
                  </div>
                ))}
                {externalComments.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6">لا توجد رسائل</div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!viewLetterId} onOpenChange={(v) => !v && setViewLetterId(undefined)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewedLetter?.subjectAr}</DialogTitle>
          </DialogHeader>
          {viewedLetter && (
            <div className="overflow-auto rounded border bg-muted/40 p-4">
              <LetterTemplate letter={viewedLetter} />
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={printLetter}>
              <Printer className="h-4 w-4 me-1" /> طباعة
            </Button>
            {viewedLetter && (
              <Button onClick={() => { const l = viewedLetter; setViewLetterId(undefined); setReplyLetter(l); }}>
                <Reply className="h-4 w-4 me-1" /> تسلّم والرد
              </Button>
            )}
          </DialogFooter>
          {viewedLetter && (
            <div className="print-only-letter">
              <LetterTemplate letter={viewedLetter} idForPrint="letter-print-area" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {replyLetter && (
        <LetterReplyDialog
          open={!!replyLetter}
          onOpenChange={(v) => !v && setReplyLetter(undefined)}
          letter={replyLetter}
          recipientName={company?.nameAr ?? "المنشأة"}
        />
      )}
    </AppShell>
  );
}

function StatusBanner({ status, requestId }: { status: string; requestId: string }) {
  const respond = useAppStore((s) => s.respondToAdditionalDocs);
  const addDoc = useAppStore((s) => s.addRequestDocument);
  const [files, setFiles] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (status === "submitted" || status === "in_review" || status === "escalated") {
    return (
      <Card className="border-secondary/40 bg-secondary/5 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-secondary mt-0.5" />
          <div>
            <h2 className="font-bold text-sm">التقديم قيد المراجعة لدى الهيئة</h2>
            <p className="text-xs text-muted-foreground mt-1">
              سيتم إشعاركم عند صدور أي تحديث على الطلب.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "additional_docs" || status === "returned") {
    const send = () => {
      if (files.length === 0) return toast.error("أرفق مستنداً واحداً على الأقل");
      const today = new Date().toISOString().slice(0, 10);
      for (const f of files) {
        addDoc(requestId, { nameAr: f, uploadedBy: "المنشأة", sizeKb: 1024 });
      }
      respond(requestId, note || `تم إرفاق ${files.length} مستند`);
      setFiles([]); setNote("");
      toast.success("تم إرسال الرد بنجاح");
    };
    return (
      <Card className="border-warning/40 bg-warning/5 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <FileWarning className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h2 className="font-bold text-sm">إجراء مطلوب — إرفاق المستندات والرد</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {status === "returned" ? "تم إرجاع الطلب لاستكمال البيانات." : "بانتظار رد المنشأة على ملاحظات الهيئة."}
            </p>
          </div>
        </div>
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-warning bg-card"
          onClick={() => setFiles((f) => [...f, `مستند-رد-${f.length + 1}.pdf`])}
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
          <p className="text-sm mt-2">اضغط لإرفاق المستندات المطلوبة</p>
        </div>
        {files.length > 0 && (
          <ul className="text-xs space-y-1">
            {files.map((f, i) => <li key={i} className="rounded bg-card border border-border px-2 py-1">{f}</li>)}
          </ul>
        )}
        <textarea
          className="w-full rounded border border-border bg-card p-2 text-sm"
          placeholder="ملاحظة (اختياري)"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button onClick={send}><Reply className="h-4 w-4 me-1" /> إرسال الرد</Button>
      </Card>
    );
  }

  if (status === "approved") {
    return (
      <Card className="border-success/40 bg-success/5 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
          <div>
            <h2 className="font-bold text-sm">تم اعتماد الطلب ✓</h2>
            <p className="text-xs text-muted-foreground mt-1">
              يمكنكم الاطلاع على خطاب الموافقة من تبويب الخطابات الرسمية أدناه.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "rejected") {
    return (
      <Card className="border-destructive/40 bg-destructive/5 p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h2 className="font-bold text-sm">تم رفض الطلب</h2>
              <p className="text-xs text-muted-foreground mt-1">
                راجعوا خطاب الرفض من تبويب الخطابات للاطلاع على الأسباب.
              </p>
            </div>
          </div>
          <Button asChild size="sm">
            <Link to="/portal/requests/new">تقديم طلب جديد</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
