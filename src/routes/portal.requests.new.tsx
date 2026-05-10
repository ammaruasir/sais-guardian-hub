import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { useAppStore } from "@/store/appStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";
import {
  requestTypeLabel, priorityLabel,
  type RequestType, type Priority,
} from "@/data/requests";

export const Route = createFileRoute("/portal/requests/new")({
  component: NewRequestWizard,
});

function NewRequestWizard() {
  const { t } = useT();
  usePageTitle(t("new_request") + " — " + t("company_portal"));
  const createRequest = useAppStore((s) => s.createRequest);
  const [step, setStep] = useState(1);
  const [type, setType] = useState<RequestType>("new_project");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [files, setFiles] = useState<string[]>([]);
  const [created, setCreated] = useState<{ id: string; ref: string } | null>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    const result = createRequest({
      titleAr, descriptionAr, type, priority, companyId: "aramco",
      receivedAt: new Date().toISOString().slice(0, 10),
    });
    setCreated(result);
    setStep(5);
  };

  if (step === 5 && created) {
    return (
      <>
        <div className="max-w-xl mx-auto py-12 text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">تم تقديم طلبك بنجاح</h1>
          <p className="text-muted-foreground">رقم الطلب المرجعي:</p>
          <div className="text-3xl font-mono font-bold text-primary">{created.ref}</div>
          <p className="text-sm text-muted-foreground">يمكنك متابعة حالة الطلب أو العودة للوحة الرئيسية.</p>
          <div className="flex gap-2 justify-center pt-4">
            <Button asChild>
              <Link to="/portal/requests/$id" params={{ id: created.id }}>متابعة الطلب</Link>
            </Button>
            <Button asChild variant="outline"><Link to="/portal">العودة للرئيسية</Link></Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link to="/portal/requests" className="text-xs text-muted-foreground hover:text-primary">
            ← طلباتي
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-2">طلب جديد</h1>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex-1">
              <div className={`h-2 rounded-full ${n <= step ? "bg-primary" : "bg-muted"}`} />
              <div className="text-[11px] mt-1 text-center text-muted-foreground">
                {["النوع", "التفاصيل", "المستندات", "المراجعة"][n - 1]}
              </div>
            </div>
          ))}
        </div>

        <Card className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">نوع الطلب</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {(Object.keys(requestTypeLabel) as RequestType[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setType(k)}
                    className={`text-start rounded-lg border p-4 transition ${type === k ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="font-semibold text-sm">{requestTypeLabel[k].ar}</div>
                    <div className="text-xs text-muted-foreground mt-1">{requestTypeLabel[k].en}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">تفاصيل الطلب</h2>
              <div className="space-y-2">
                <Label>عنوان الطلب</Label>
                <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: طلب اعتماد توسعة منشأة..." />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea rows={5} value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} placeholder="اشرح طبيعة الطلب والمتطلبات الأساسية..." />
              </div>
              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="w-60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(priorityLabel) as Priority[]).map((k) => (
                      <SelectItem key={k} value={k}>{priorityLabel[k].ar}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">المستندات الداعمة</h2>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                onClick={() => setFiles((f) => [...f, `مستند-${f.length + 1}.pdf`])}
              >
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm mt-2">اضغط لإضافة مستند (محاكاة)</p>
              </div>
              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded border border-border bg-card px-3 py-2 text-sm">
                      {f}
                      <button className="text-xs text-destructive" onClick={() => setFiles((arr) => arr.filter((_, idx) => idx !== i))}>إزالة</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">مراجعة وتأكيد</h2>
              <Row k="النوع" v={requestTypeLabel[type].ar} />
              <Row k="العنوان" v={titleAr || "—"} />
              <Row k="الوصف" v={descriptionAr || "—"} />
              <Row k="الأولوية" v={priorityLabel[priority].ar} />
              <Row k="المستندات" v={`${files.length} ملف`} />
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={back} disabled={step === 1}>
            <ChevronRight className="h-4 w-4 me-1" /> السابق
          </Button>
          {step < 4 ? (
            <Button onClick={next} disabled={step === 2 && !titleAr.trim()}>
              التالي <ChevronLeft className="h-4 w-4 ms-1" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={!titleAr.trim()}>
              <CheckCircle2 className="h-4 w-4 me-1" /> تقديم الطلب
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-2 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-end">{v}</span>
    </div>
  );
}
