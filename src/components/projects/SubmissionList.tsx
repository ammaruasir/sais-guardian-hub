import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { stageLabel, type Stage } from "@/data";
import type { Submission } from "@/data/submissions";

const statusToneAr: Record<Submission["status"], { ar: string; cls: string }> = {
  approved: { ar: "معتمد", cls: "bg-success/15 text-success border-success/30" },
  under_review: { ar: "قيد المراجعة", cls: "bg-secondary/15 text-secondary border-secondary/30" },
  additional_docs: { ar: "مستندات إضافية", cls: "bg-warning/20 text-warning-foreground border-warning/30" },
  rejected: { ar: "مرفوض", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  pending_final: { ar: "بانتظار الاعتماد", cls: "bg-warning/20 text-warning-foreground border-warning/30" },
};

function DocIcon({ type }: { type: string }) {
  if (type === "xlsx") return <FileSpreadsheet className="h-4 w-4 text-success" />;
  if (type === "dwg") return <FileImage className="h-4 w-4 text-secondary" />;
  return <FileText className="h-4 w-4 text-primary" />;
}

export function SubmissionList({
  items,
  onReview,
}: {
  items: Submission[];
  onReview: (s: Submission) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((s) => {
        const t = statusToneAr[s.status];
        return (
          <Card key={s.id} className="gap-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">المرحلة {s.stage} — {stageLabel[s.stage as Stage].ar}</span>
                  <Badge variant="outline" className={t.cls}>{t.ar}</Badge>
                </div>
                <p className="num mt-1 text-xs text-muted-foreground">قُدم في {s.submittedAt}</p>
              </div>
              <Button size="sm" onClick={() => onReview(s)}>مراجعة</Button>
            </div>
            <div className="grid gap-1.5 border-t border-border/60 pt-3 sm:grid-cols-2">
              {s.documents.map((d) => (
                <div key={d.name} className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5">
                  <DocIcon type={d.type} />
                  <span className="flex-1 truncate text-xs">{d.name}</span>
                  <span className="num text-[10px] text-muted-foreground">{d.size}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
