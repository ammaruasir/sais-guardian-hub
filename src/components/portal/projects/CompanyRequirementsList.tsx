import { CheckCircle2, Circle, XCircle, Upload, Lock } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portalStages, type PortalRequirement } from "@/data/portalRequirements";
import type { Project, Stage } from "@/data";
import type { Submission } from "@/data/submissions";

export function CompanyRequirementsList({
  project,
  submissions,
}: {
  project: Project;
  submissions: Submission[];
}) {
  return (
    <Accordion type="multiple" defaultValue={[`stage-${project.stage}`]} className="space-y-3">
      {portalStages.map((s) => {
        const sub = submissions.find((x) => x.stage === s.stage);
        const isPast = s.stage < project.stage;
        const isCurrent = s.stage === project.stage;
        const isFuture = s.stage > project.stage;
        return (
          <AccordionItem
            key={s.stage}
            value={`stage-${s.stage}`}
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 items-center gap-3 text-end">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    isPast
                      ? "bg-success text-success-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="num">{s.stage}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{s.titleAr}</div>
                  <div className="text-xs text-muted-foreground">{s.titleEn}</div>
                </div>
                <div className="text-xs text-muted-foreground num">{s.items.length} متطلبات</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pb-2">
                {s.items.map((it, idx) => (
                  <RequirementRow
                    key={it.id}
                    req={it}
                    state={
                      isFuture
                        ? "future"
                        : isPast
                          ? "attached"
                          : computeCurrentState(idx, sub, project)
                    }
                    fileName={sub?.documents[idx]?.name}
                    fileSize={sub?.documents[idx]?.size}
                    rejectionNote={
                      isCurrent && project.status === "additional_docs" && idx === 0
                        ? "يرجى تحديث القسم 4.2 من تقرير المخاطر."
                        : undefined
                    }
                    uploadedAt={isPast ? sub?.reviewedAt : sub?.submittedAt}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function computeCurrentState(idx: number, sub: Submission | undefined, project: Project): RowState {
  if (!sub) return "missing";
  if (project.status === "additional_docs" && idx === 0) return "rejected";
  if (idx < sub.documents.length) return "attached";
  return "missing";
}

type RowState = "attached" | "missing" | "rejected" | "future";

function RequirementRow({
  req,
  state,
  fileName,
  fileSize,
  uploadedAt,
  rejectionNote,
}: {
  req: PortalRequirement;
  state: RowState;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  rejectionNote?: string;
}) {
  const tone =
    state === "attached"
      ? "border-success/30 bg-success/5"
      : state === "rejected"
        ? "border-destructive/30 bg-destructive/5"
        : state === "future"
          ? "border-border bg-muted/40 opacity-60"
          : "border-border bg-background/40";
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${tone}`}>
      {state === "attached" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
      {state === "rejected" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
      {state === "missing" && <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />}
      {state === "future" && <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold">{req.nameAr}</div>
          <Badge variant="outline" className="num text-[10px] bg-accent/30 border-accent">
            {req.directive}
          </Badge>
          {req.required ? (
            <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
              مطلوب
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">اختياري</Badge>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground">{req.nameEn}</div>

        {state === "attached" && fileName && (
          <div className="mt-1.5 text-xs text-success-foreground/80">
            <span className="font-medium">{fileName}</span>
            {fileSize && <span className="num text-muted-foreground"> · {fileSize}</span>}
            {uploadedAt && <span className="num text-muted-foreground"> · {uploadedAt}</span>}
          </div>
        )}
        {state === "rejected" && (
          <div className="mt-1.5 text-xs text-destructive">
            ملاحظة الهيئة: {rejectionNote ?? "يرجى إعادة الرفع."}
          </div>
        )}
        {state === "future" && (
          <div className="mt-1.5 text-[11px] text-muted-foreground">غير متاح بعد</div>
        )}
      </div>

      {(state === "missing" || state === "rejected") && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.success(state === "rejected" ? "تم فتح إعادة الرفع" : "تم فتح نافذة الرفع")}
        >
          <Upload className="ms-1 h-3.5 w-3.5" /> {state === "rejected" ? "إعادة الرفع" : "رفع"}
        </Button>
      )}
    </div>
  );
}
