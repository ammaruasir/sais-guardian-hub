import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssignmentChain } from "@/components/requests/AssignmentChain";
import { LetterTemplate } from "@/components/letters/LetterTemplate";
import { LetterComposerDialog } from "@/components/letters/LetterComposerDialog";
import {
  requestStatusLabel, requestTypeLabel, priorityLabel,
  type DepartmentKey,
} from "@/data/requests";
import { letterTypeLabel, letterStatusLabel, type LetterType } from "@/data/letters";
import {
  ArrowRight, Send, FileText, MessageSquare, History, FileWarning,
  CheckCircle2, XCircle, RotateCcw, ArrowUpFromLine, Mail, Plus, Eye, Printer, Pencil,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/requests/$id")({
  component: RequestDetailPage,
});

function RequestDetailPage() {
  const { id } = Route.useParams();
  const request = useAppStore((s) => s.requests.find((r) => r.id === id));
  const companies = useAppStore((s) => s.companies);
  const departments = useAppStore((s) => s.departments);
  const assignRequest = useAppStore((s) => s.assignRequest);
  const escalateRequest = useAppStore((s) => s.escalateRequest);
  const returnRequest = useAppStore((s) => s.returnRequest);
  const approveRequest = useAppStore((s) => s.approveRequest);
  const rejectRequest = useAppStore((s) => s.rejectRequest);
  const requestAdditionalDocs = useAppStore((s) => s.requestAdditionalDocs);
  const addRequestComment = useAppStore((s) => s.addRequestComment);
  const allLetters = useAppStore((s) => s.letters);

  const [assignDept, setAssignDept] = useState<DepartmentKey | "">("");
  const [actionNote, setActionNote] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentVis, setCommentVis] = useState<"internal" | "external">("internal");
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<LetterType>("additional_docs");
  const [editLetterId, setEditLetterId] = useState<string | undefined>();
  const [viewLetterId, setViewLetterId] = useState<string | undefined>();

  if (!request) throw notFound();

  const company = companies.find((c) => c.id === request.companyId);
  const currentDept = departments.find((d) => d.key === request.currentDepartment);
  const t = requestTypeLabel[request.type];
  const st = requestStatusLabel[request.status];
  const p = priorityLabel[request.priority];

  const onAssign = () => {
    if (!assignDept) return toast.error("اختر إدارة");
    const dept = departments.find((d) => d.key === assignDept)!;
    assignRequest(request.id, assignDept as DepartmentKey, `مسؤول ${dept.nameAr}`, actionNote || undefined);
    setAssignDept(""); setActionNote("");
    toast.success(`تم التحويل إلى ${dept.nameAr}`);
  };

  const onEscalate = () => {
    escalateRequest(request.id, "executive", "أ. ماجد الزهراني", actionNote || "تم التصعيد");
    setActionNote(""); toast.success("تم التصعيد للمكتب التنفيذي");
  };

  const requestLetters = allLetters.filter((l) => l.requestId === request.id);
  const viewedLetter = viewLetterId ? allLetters.find((l) => l.id === viewLetterId) : undefined;

  const openComposer = (type: LetterType, letterId?: string) => {
    setComposerType(type);
    setEditLetterId(letterId);
    setComposerOpen(true);
  };

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
        <div>
          <Link to="/requests" className="text-xs text-muted-foreground hover:text-primary">
            ← العودة إلى الطلبات
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

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">المنشأة</div>
            <div className="text-sm font-medium mt-1">{company?.nameAr}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">الإدارة الحالية</div>
            <div className="text-sm font-medium mt-1">{currentDept?.nameAr}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">تاريخ الاستلام</div>
            <div className="text-sm font-medium mt-1">{request.receivedAt}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">آخر تحديث</div>
            <div className="text-sm font-medium mt-1">{request.lastUpdate}</div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">سلسلة التحويل</h2>
          </div>
          <AssignmentChain chain={request.chain} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTrigger value="documents"><FileText className="h-4 w-4 me-1" />المستندات</TabsTrigger>
                <TabsTrigger value="comments"><MessageSquare className="h-4 w-4 me-1" />التعليقات</TabsTrigger>
                <TabsTrigger value="log"><History className="h-4 w-4 me-1" />سجل التحويل</TabsTrigger>
                <TabsTrigger value="letters"><Mail className="h-4 w-4 me-1" />الخطابات</TabsTrigger>
              </TabsList>
              <TabsContent value="documents">
                <Card className="p-0 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المستند</TableHead>
                        <TableHead>المرفِق</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead className="text-end">الحجم</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {request.documents.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="text-sm">{d.nameAr}</TableCell>
                          <TableCell className="text-sm">{d.uploadedBy}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{d.ts}</TableCell>
                          <TableCell className="text-end text-xs">{d.sizeKb} KB</TableCell>
                        </TableRow>
                      ))}
                      {request.documents.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">لا توجد مستندات</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
              <TabsContent value="comments">
                <Card className="p-4 space-y-3">
                  {request.comments.map((c) => (
                    <div key={c.id} className={`rounded-lg border p-3 ${c.visibility === "internal" ? "bg-warning/5 border-warning/30" : "bg-card"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-medium">{c.authorAr}</div>
                        <Badge variant="outline" className="text-[10px]">
                          {c.visibility === "internal" ? "داخلي" : "خارجي"}
                        </Badge>
                      </div>
                      <div className="text-sm text-foreground">{c.body}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{c.ts}</div>
                    </div>
                  ))}
                  {request.comments.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-6">لا توجد تعليقات</div>
                  )}
                  <div className="border-t border-border pt-3 space-y-2">
                    <Select value={commentVis} onValueChange={(v) => setCommentVis(v as typeof commentVis)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">داخلي</SelectItem>
                        <SelectItem value="external">خارجي (للمنشأة)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="اكتب تعليقاً..." value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!commentBody.trim()) return;
                        addRequestComment(request.id, { authorAr: "م. نورة الشمري", visibility: commentVis, body: commentBody });
                        setCommentBody(""); toast.success("تمت إضافة التعليق");
                      }}
                    >
                      <Send className="h-3 w-3 me-1" /> إرسال
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="log">
                <Card className="p-0 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الإدارة</TableHead>
                        <TableHead>المسؤول</TableHead>
                        <TableHead>الإجراء</TableHead>
                        <TableHead>من</TableHead>
                        <TableHead>إلى</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {request.chain.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="text-sm">{departments.find((d) => d.key === e.department)?.nameAr}</TableCell>
                          <TableCell className="text-sm">{e.assigneeAr}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{e.action}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{e.startedAt}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{e.endedAt ?? "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
              <TabsContent value="letters">
                <Card className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 border-b border-border p-3">
                    <h3 className="text-sm font-bold">الخطابات الرسمية</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm"><Plus className="h-3 w-3 me-1" /> إنشاء خطاب</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openComposer("additional_docs")}>طلب مستندات إضافية</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openComposer("comments")}>خطاب ملاحظات</DropdownMenuItem>
                        {currentDept?.canFinalApprove && (
                          <DropdownMenuItem onClick={() => openComposer("approval")}>قرار اعتماد</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openComposer("rejection")}>قرار رفض</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الرقم</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الموضوع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead className="text-end">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestLetters.map((l) => {
                        const lt = letterTypeLabel[l.type];
                        const ls = letterStatusLabel[l.status];
                        return (
                          <TableRow key={l.id}>
                            <TableCell className="num text-xs">{l.ref}</TableCell>
                            <TableCell><Badge variant="outline" className={`border-${lt.tone}/40 text-${lt.tone}`}>{lt.ar}</Badge></TableCell>
                            <TableCell className="text-sm">{l.subjectAr}</TableCell>
                            <TableCell><Badge variant="outline" className={`border-${ls.tone}/40 text-${ls.tone}`}>{ls.ar}</Badge></TableCell>
                            <TableCell className="text-xs text-muted-foreground num">{l.gregorianDate}</TableCell>
                            <TableCell className="text-end">
                              <Button size="icon" variant="ghost" onClick={() => setViewLetterId(l.id)}><Eye className="h-4 w-4" /></Button>
                              {l.status === "draft" && (
                                <Button size="icon" variant="ghost" onClick={() => openComposer(l.type, l.id)}><Pencil className="h-4 w-4" /></Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {requestLetters.length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">لا توجد خطابات بعد</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="p-4 space-y-4 h-fit">
            <h3 className="text-sm font-bold">إجراءات</h3>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">تحويل إلى إدارة</label>
              <Select value={assignDept} onValueChange={(v) => setAssignDept(v as DepartmentKey)}>
                <SelectTrigger><SelectValue placeholder="اختر إدارة" /></SelectTrigger>
                <SelectContent>
                  {departments.filter((d) => d.key !== request.currentDepartment).map((d) => (
                    <SelectItem key={d.key} value={d.key}>{d.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="ملاحظة (اختياري)" value={actionNote} onChange={(e) => setActionNote(e.target.value)} rows={2} />
              <Button size="sm" className="w-full" onClick={onAssign}><ArrowRight className="h-3 w-3 me-1" /> تحويل</Button>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <Button size="sm" variant="outline" className="w-full" onClick={() => openComposer("additional_docs")}>
                <FileWarning className="h-3 w-3 me-1" /> خطاب مستندات إضافية
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => openComposer("comments")}>
                <Mail className="h-3 w-3 me-1" /> خطاب ملاحظات
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => {
                if (!actionNote.trim()) return toast.error("اكتب سبب الإرجاع");
                requestAdditionalDocs(request.id, actionNote);
                setActionNote(""); toast.success("تم طلب مستندات إضافية (بدون خطاب)");
              }}>
                <FileWarning className="h-3 w-3 me-1" /> طلب سريع بدون خطاب
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => {
                returnRequest(request.id, actionNote || undefined); setActionNote("");
                toast.success("تم إرجاع الطلب");
              }}>
                <RotateCcw className="h-3 w-3 me-1" /> إرجاع للمنشأة
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={onEscalate}>
                <ArrowUpFromLine className="h-3 w-3 me-1" /> تصعيد
              </Button>
              {currentDept?.canFinalApprove && (
                <Button size="sm" className="w-full bg-success text-success-foreground hover:bg-success/90" onClick={() => openComposer("approval")}>
                  <CheckCircle2 className="h-3 w-3 me-1" /> اعتماد نهائي بخطاب
                </Button>
              )}
              {currentDept?.canFinalApprove && (
                <Button size="sm" variant="ghost" className="w-full" onClick={() => {
                  approveRequest(request.id, actionNote || undefined); setActionNote("");
                  toast.success("تم الاعتماد النهائي");
                }}>
                  اعتماد سريع بدون خطاب
                </Button>
              )}
              <Button size="sm" variant="destructive" className="w-full" onClick={() => openComposer("rejection")}>
                <XCircle className="h-3 w-3 me-1" /> رفض بخطاب
              </Button>
              <Button size="sm" variant="ghost" className="w-full" onClick={() => {
                rejectRequest(request.id, actionNote || undefined); setActionNote("");
                toast.success("تم رفض الطلب");
              }}>
                رفض سريع بدون خطاب
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {composerOpen && (
        <LetterComposerDialog
          open={composerOpen}
          onOpenChange={setComposerOpen}
          requestId={request.id}
          type={composerType}
          addresseeAr={company?.nameAr ?? ""}
          requestRef={request.ref}
          existingLetterId={editLetterId}
        />
      )}

      <Dialog open={!!viewLetterId} onOpenChange={(v) => !v && setViewLetterId(undefined)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>معاينة خطاب — {viewedLetter?.ref}</DialogTitle>
          </DialogHeader>
          {viewedLetter && (
            <div className="overflow-auto rounded border bg-muted/40 p-4">
              <LetterTemplate letter={viewedLetter} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={printLetter}><Printer className="h-4 w-4 me-1" /> طباعة</Button>
          </DialogFooter>
          {viewedLetter && (
            <div className="print-only-letter">
              <LetterTemplate letter={viewedLetter} idForPrint="letter-print-area" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
