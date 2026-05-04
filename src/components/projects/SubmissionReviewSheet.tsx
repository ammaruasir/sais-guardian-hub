import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Eye, Download, CheckCircle2, AlertTriangle, XCircle, UserCog } from "lucide-react";
import type { Submission, ChecklistResult } from "@/data/submissions";
import { stageLabel, reviewers } from "@/data";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";

export function SubmissionReviewSheet({
  submission,
  history,
  open,
  onOpenChange,
}: {
  submission: Submission | null;
  history: Submission[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [checks, setChecks] = useState<Record<string, ChecklistResult>>({});
  const [comment, setComment] = useState("");
  const updateSubmissionDecision = useAppStore((s) => s.updateSubmissionDecision);
  const addNotification = useAppStore((s) => s.addNotification);
  const addActivity = useAppStore((s) => s.addActivity);
  const projects = useAppStore((s) => s.projects);

  useEffect(() => {
    if (submission?.checklist) {
      const seed: Record<string, ChecklistResult> = {};
      submission.checklist.forEach((c) => (seed[c.code] = c.result));
      setChecks(seed);
    }
    setComment(submission?.comments ?? "");
  }, [submission]);

  if (!submission) return null;
  const reviewer = reviewers.find((r) => r.id === submission.reviewerId);
  const project = projects.find((p) => p.id === submission.projectId);

  function decide(label: string, decision?: "approved" | "additional_docs" | "rejected") {
    if (decision && submission) {
      updateSubmissionDecision(submission.id, decision, comment);
      addNotification({
        type: decision === "approved" ? "approval" : decision === "rejected" ? "rejection" : "request",
        titleAr: `${label} — ${project?.nameAr ?? ""}`,
        descriptionAr: comment || `تم تسجيل قرار المراجعة: ${label}`,
        ts: "الآن",
        linkTo: `/portal/projects/${submission.projectId}`,
        forRole: "company",
      });
      addActivity({
        ts: "الآن",
        who: reviewer?.nameAr ?? "مراجع",
        ar: `${label} للمرحلة ${submission.stage} — ${project?.nameAr ?? ""}`,
        type: decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "requested",
      });
    }
    toast.success(`تم تسجيل القرار: ${label}`);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl" dir="rtl">
        <SheetHeader className="border-b border-border p-5 text-end">
          <SheetTitle>مراجعة التقديم — المرحلة {submission.stage}</SheetTitle>
          <SheetDescription>
            {stageLabel[submission.stage].ar} • قُدّم في <span className="num">{submission.submittedAt}</span>
            {reviewer ? <> • المراجع: {reviewer.nameAr}</> : null}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section>
            <h4 className="mb-2 text-sm font-semibold">المستندات</h4>
            <div className="space-y-1.5">
              {submission.documents.map((d) => (
                <div key={d.name} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate text-sm">{d.name}</span>
                  <span className="num text-[10px] text-muted-foreground">{d.size}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">قائمة الامتثال</h4>
            <div className="space-y-2">
              {submission.checklist?.map((c) => (
                <div key={c.code} className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2">
                  <span className="num rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{c.code}</span>
                  <span className="flex-1 text-sm">{c.labelAr}</span>
                  <ToggleGroup
                    type="single"
                    size="sm"
                    value={checks[c.code]}
                    onValueChange={(v) => v && setChecks({ ...checks, [c.code]: v as ChecklistResult })}
                  >
                    <ToggleGroupItem value="pass" className="data-[state=on]:bg-success data-[state=on]:text-success-foreground">✓</ToggleGroupItem>
                    <ToggleGroupItem value="fail" className="data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground">✕</ToggleGroupItem>
                    <ToggleGroupItem value="na" className="text-xs">—</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">ملاحظات المراجع</h4>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="أضف ملاحظاتك على التقديم..." />
          </section>

          {history.length > 0 && (
            <section>
              <h4 className="mb-2 text-sm font-semibold">المراجعات السابقة</h4>
              <Accordion type="single" collapsible>
                {history.map((h) => (
                  <AccordionItem key={h.id} value={h.id}>
                    <AccordionTrigger className="text-sm">
                      المرحلة {h.stage} — {h.decision === "approved" ? "معتمد" : h.decision ?? "—"} <span className="num me-2 text-xs text-muted-foreground">{h.reviewedAt}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {h.comments ?? "لا توجد ملاحظات."}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-border bg-muted/40 p-4 sm:grid-cols-4">
          <Button onClick={() => decide("اعتماد", "approved")} className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle2 className="h-4 w-4" /> اعتماد
          </Button>
          <Button onClick={() => decide("طلب مستندات إضافية", "additional_docs")} className="bg-warning text-warning-foreground hover:bg-warning/90">
            <AlertTriangle className="h-4 w-4" /> مستندات إضافية
          </Button>
          <Button onClick={() => decide("رفض", "rejected")} variant="destructive">
            <XCircle className="h-4 w-4" /> رفض
          </Button>
          <Button onClick={() => decide("إعادة تعيين")} variant="secondary">
            <UserCog className="h-4 w-4" /> إعادة تعيين
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
