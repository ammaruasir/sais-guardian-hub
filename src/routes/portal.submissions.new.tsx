import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, ChevronLeft, FileUp, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { stageLabel, type Stage } from "@/data";
import { portalStages } from "@/data/portalRequirements";
import { nextSubmissionRef } from "@/data/portalConversations";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

type WizardSearch = { project?: string; stage?: number };

export const Route = createFileRoute("/portal/submissions/new")({
  validateSearch: (s: Record<string, unknown>): WizardSearch => ({
    project: typeof s.project === "string" ? s.project : undefined,
    stage: typeof s.stage === "number" ? s.stage : s.stage ? Number(s.stage) : undefined,
  }),
  component: WizardPage,
});

const STEPS = [
  "اختيار المشروع",
  "تحديد المرحلة",
  "رفع المستندات",
  "إقرار الامتثال",
  "مراجعة وتقديم",
];

type FileEntry = { name: string; size: string };

function WizardPage() {
  const search = Route.useSearch();
  const projects = useAppStore((s) => s.projects);
  const consultants = useAppStore((s) => s.consultants);
  const addSubmission = useAppStore((s) => s.addSubmission);
  const addNotification = useAppStore((s) => s.addNotification);
  const addActivity = useAppStore((s) => s.addActivity);
  const aramcoProjects = projects.filter((p) => p.companyId === "aramco");
  const initialProject = (search.project as string | undefined) ?? "";
  const initialStage = (search.stage as number | undefined) ?? 0;

  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState<string>(initialProject);
  const [stage, setStage] = useState<Stage | 0>((initialStage as Stage) || 0);
  const [files, setFiles] = useState<Record<string, FileEntry>>({});
  const [consultantId, setConsultantId] = useState<string>("c1");
  const [signatory, setSignatory] = useState("م. أحمد الراشد — مدير الأمن الصناعي");
  const [agreed, setAgreed] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitted, setSubmitted] = useState(false);

  const project = aramcoProjects.find((p) => p.id === projectId);
  const stageItems = stage ? portalStages[stage - 1].items : [];
  const requiredItems = stageItems.filter((i) => i.required);
  const attachedRequired = requiredItems.filter((i) => files[i.id]).length;
  const attachedAll = stageItems.filter((i) => files[i.id]).length;

  const canNext =
    (step === 1 && !!projectId) ||
    (step === 2 && !!stage) ||
    step === 3 ||
    (step === 4 && agreed && !!consultantId) ||
    step === 5;

  function reset() {
    setStep(1);
    setProjectId("");
    setStage(0);
    setFiles({});
    setAgreed(false);
    setSubmitted(false);
  }

  if (submitted && project && stage) {
    const ref = nextSubmissionRef(project.id, stage);
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">تم التقديم بنجاح</h1>
          <div className="num mt-2 text-sm text-muted-foreground">رقم المرجع</div>
          <div className="num mt-1 text-lg font-semibold">{ref}</div>
          <div className="mt-5 space-y-1 text-sm text-muted-foreground">
            <p>سيتم مراجعة تقديمكم خلال 5-7 أيام عمل</p>
            <p>ستتلقون إشعاراً عند صدور القرار</p>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/portal/projects">العودة للمشاريع</Link>
            </Button>
            <Button onClick={reset}>تقديم آخر</Button>
          </div>
        </div>
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">تقديم جديد</h1>
        <p className="mt-1 text-sm text-muted-foreground">معالج تقديم المستندات للهيئة العليا للأمن الصناعي</p>
      </header>

      {/* Step indicator */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                      done && "border-success bg-success text-success-foreground",
                      active && "border-primary bg-primary text-primary-foreground shadow-md",
                      !done && !active && "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="num">{n}</span>}
                  </div>
                  <div className={cn("text-center text-[11px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                    {label}
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1 rounded", n < step ? "bg-success" : "bg-border")} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step body */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>اختر المشروع</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="— اختر مشروعاً —" /></SelectTrigger>
                <SelectContent>
                  {aramcoProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {project && (
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="font-semibold">{project.nameAr}</div>
                <div className="text-xs text-muted-foreground">{project.nameEn}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <Info label="المنشأة" value={project.facilityAr} />
                  <Info label="المرحلة الحالية" value={`${project.stage} — ${stageLabel[project.stage].ar}`} />
                  <Info label="التصنيف" value={project.classification} />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && project && (
          <div className="space-y-4">
            <Label>اختر المرحلة المراد تقديمها</Label>
            <RadioGroup
              value={String(stage || project.stage)}
              onValueChange={(v) => setStage(Number(v) as Stage)}
              className="grid gap-2"
            >
              {[1, 2, 3, 4].map((n) => {
                const completed = n < project.stage;
                return (
                  <label
                    key={n}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3",
                      completed ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50",
                      String(stage) === String(n) && "border-primary bg-primary/5",
                    )}
                  >
                    <RadioGroupItem value={String(n)} disabled={completed} />
                    <div className="flex-1">
                      <div className="font-medium">المرحلة {n} — {stageLabel[n as Stage].ar}</div>
                      <div className="text-xs text-muted-foreground">{stageLabel[n as Stage].en}</div>
                    </div>
                    {completed && <Badge variant="outline" className="bg-success/10 text-success border-success/30">معتمدة</Badge>}
                    {n === project.stage && <Badge variant="outline">المرحلة الحالية</Badge>}
                  </label>
                );
              })}
            </RadioGroup>
            {stage === project.stage && (
              <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-xs">
                ملاحظة: تقوم بإعادة تقديم المرحلة الحالية (بعد طلب مستندات إضافية).
              </div>
            )}
          </div>
        )}

        {step === 3 && stage > 0 && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">
                  <span className="num">{attachedAll}</span> من <span className="num">{stageItems.length}</span> مستندات مرفقة
                </span>
                <span className="num text-xs text-muted-foreground">المطلوب: {attachedRequired}/{requiredItems.length}</span>
              </div>
              <Progress value={(attachedAll / stageItems.length) * 100} />
            </div>
            <div className="space-y-3">
              {stageItems.map((it) => (
                <UploadRow
                  key={it.id}
                  reqId={it.id}
                  nameAr={it.nameAr}
                  nameEn={it.nameEn}
                  directive={it.directive}
                  required={it.required}
                  file={files[it.id]}
                  onChange={(f) => setFiles((prev) => ({ ...prev, [it.id]: f }))}
                  onRemove={() => setFiles((prev) => { const c = { ...prev }; delete c[it.id]; return c; })}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
              أقر أنا المُوقع أدناه بأن جميع المستندات المقدمة تتوافق مع متطلبات الهيئة العليا للأمن الصناعي
              وأن المعلومات الواردة فيها صحيحة ودقيقة.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>اسم المُوقّع</Label>
                <Input value={signatory} onChange={(e) => setSignatory(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>الاستشاري المعتمد</Label>
                <Select value={consultantId} onValueChange={setConsultantId}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {consultants.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>التاريخ</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 num" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} />
              <span>أوافق على الإقرار أعلاه</span>
            </label>
          </div>
        )}

        {step === 5 && project && stage > 0 && (
          <div className="space-y-4">
            <Info label="المشروع" value={`${project.nameAr} — ${project.facilityAr}`} />
            <Info label="المرحلة" value={`${stage} — ${stageLabel[stage as Stage].ar}`} />
            <Info label="الاستشاري" value={consultants.find((c) => c.id === consultantId)?.nameAr ?? "—"} />
            <Info label="المُوقّع" value={signatory} />
            <Info label="التاريخ" value={date} />
            <div>
              <div className="mb-2 text-sm font-semibold">المستندات المرفقة</div>
              <ul className="space-y-1.5 rounded-lg border border-border bg-background/40 p-3">
                {Object.entries(files).map(([k, f]) => (
                  <li key={k} className="flex items-center gap-2 text-xs">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{f.name}</span>
                    <span className="num text-muted-foreground">· {f.size}</span>
                  </li>
                ))}
                {Object.keys(files).length === 0 && (
                  <li className="text-xs text-muted-foreground">لا توجد مستندات مرفقة (للعرض التجريبي).</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          <ChevronRight className="ml-1 h-4 w-4" /> السابق
        </Button>
        {step < 5 ? (
          <div className="flex items-center gap-3">
            {step === 3 && attachedRequired < requiredItems.length && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => setStep(4)}
              >
                متابعة بدون اكتمال
              </button>
            )}
            <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              التالي <ChevronLeft className="mr-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={() => setSubmitted(true)}
          >
            <CheckCircle2 className="ml-1 h-5 w-5" /> تقديم
          </Button>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

function UploadRow({
  reqId, nameAr, nameEn, directive, required, file, onChange, onRemove,
}: {
  reqId: string;
  nameAr: string; nameEn: string; directive: string; required: boolean;
  file?: FileEntry;
  onChange: (f: FileEntry) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="font-semibold">{nameAr}</div>
        <Badge variant="outline" className="num text-[10px] bg-accent/30 border-accent">{directive}</Badge>
        {required ? (
          <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">مطلوب</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">اختياري</Badge>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground">{nameEn}</div>

      {file ? (
        <div className="mt-3 flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-success" />
            <span className="font-medium">{file.name}</span>
            <span className="num text-xs text-muted-foreground">{file.size}</span>
          </div>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive" aria-label="إزالة">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border bg-background/30 px-4 py-5 text-xs text-muted-foreground hover:border-primary hover:bg-primary/5 transition"
        >
          <FileUp className="h-5 w-5" />
          <span>اختر ملفاً أو اسحبه هنا</span>
          <span className="num text-[10px]">.pdf, .dwg, .xlsx, .doc</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.dwg,.xlsx,.doc,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            onChange({ name: f.name, size: prettyBytes(f.size) });
          } else if (!file) {
            // mock when filesystem cancelled — generate a mock entry for demo
            onChange({ name: `${reqId}.pdf`, size: "2.4 MB" });
          }
        }}
      />
    </div>
  );
}

function prettyBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
