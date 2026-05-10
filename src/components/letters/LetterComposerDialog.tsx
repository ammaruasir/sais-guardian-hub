import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { type Letter, type LetterType, type LetterCommentRow, toHijri } from "@/data/letters";
import { LetterTemplate } from "./LetterTemplate";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requestId: string;
  type: LetterType;
  addresseeAr: string;
  requestRef: string;
  /** when set, opens the existing letter for editing/sending instead of creating new */
  existingLetterId?: string;
};

const defaults: Record<LetterType, Pick<Letter, "subjectAr" | "bodyIntroAr" | "items" | "closingAr" | "signatoryAr" | "signatoryTitleAr">> = {
  additional_docs: {
    subjectAr: "طلب استكمال مستندات",
    bodyIntroAr:
      "بالإشارة إلى طلبكم المذكور أعلاه، نفيدكم بأنه يلزم استكمال المستندات التالية لاستكمال الإجراءات النظامية:",
    items: ["المستند الأول المطلوب", "المستند الثاني المطلوب"],
    closingAr:
      "نأمل تزويدنا بالمستندات أعلاه خلال مدة أقصاها ثلاثون (30) يومًا من تاريخ هذا الخطاب.",
    signatoryAr: "م. نورة الشمري",
    signatoryTitleAr: "مدير إدارة الامتثال",
  },
  approval: {
    subjectAr: "قرار اعتماد",
    bodyIntroAr:
      "إلحاقًا بطلبكم، يسرّنا إفادتكم بصدور القرار النهائي بالموافقة وفق الشروط التالية:",
    items: ["الالتزام بمتطلبات الأمن والسلامة", "إخطار الهيئة قبل بدء التشغيل بـ 14 يومًا"],
    closingAr: "وعليه يحق لكم المباشرة بأعمال التنفيذ وفقًا للضوابط المعتمدة.",
    signatoryAr: "م. نورة الشمري",
    signatoryTitleAr: "مدير إدارة الامتثال",
  },
  rejection: {
    subjectAr: "قرار رفض",
    bodyIntroAr:
      "نأسف لإفادتكم بأنه تعذّر الموافقة على طلبكم المذكور أعلاه للأسباب التالية:",
    items: ["السبب الأول", "السبب الثاني"],
    closingAr:
      "يمكنكم إعادة تقديم الطلب بعد معالجة الملاحظات أعلاه. ولكم تحياتنا.",
    signatoryAr: "م. نورة الشمري",
    signatoryTitleAr: "مدير إدارة الامتثال",
  },
  comments: {
    subjectAr: "ملاحظات على المستندات المقدّمة",
    bodyIntroAr:
      "بالإشارة إلى الطلب المذكور أعلاه، نرفق لكم ملاحظات الفريق الفني على المستندات المقدّمة:",
    items: [],
    closingAr: "نأمل معالجة الملاحظات أعلاه وإعادة تقديم النسخة المحدّثة في أقرب وقت.",
    signatoryAr: "م. عبدالعزيز السبيعي",
    signatoryTitleAr: "مدير الإدارة الهندسية",
  },
};

export function LetterComposerDialog({
  open,
  onOpenChange,
  requestId,
  type,
  addresseeAr,
  requestRef,
  existingLetterId,
}: Props) {
  const letters = useAppStore((s) => s.letters);
  const createLetterDraft = useAppStore((s) => s.createLetterDraft);
  const updateLetter = useAppStore((s) => s.updateLetter);
  const sendLetter = useAppStore((s) => s.sendLetter);

  const existing = existingLetterId ? letters.find((l) => l.id === existingLetterId) : undefined;

  const init = (): Letter => {
    if (existing) return existing;
    const d = defaults[type];
    const today = new Date().toISOString().slice(0, 10);
    return {
      id: "",
      ref: "(يُنشأ تلقائيًا)",
      requestId,
      type,
      status: "draft",
      addresseeAr,
      referenceAr: "",
      subjectAr: `${d.subjectAr} — ${requestRef}`,
      bodyIntroAr: d.bodyIntroAr,
      items: [...d.items],
      commentsTable: type === "comments" ? [{ doc: "", comment: "", status: "تعديل مطلوب" }] : undefined,
      closingAr: d.closingAr,
      signatoryAr: d.signatoryAr,
      signatoryTitleAr: d.signatoryTitleAr,
      hijriDate: toHijri(today),
      gregorianDate: today,
      attachmentsCount: 0,
      classified: false,
      createdAt: today,
    };
  };

  const [draft, setDraft] = useState<Letter>(init);

  useEffect(() => {
    if (open) setDraft(init());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existingLetterId, type]);

  const set = <K extends keyof Letter>(k: K, v: Letter[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const reqClass = (v: string) =>
    !v || !v.trim() ? "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/60" : "";

  const addItem = () => set("items", [...draft.items, ""]);
  const updateItem = (i: number, v: string) =>
    set("items", draft.items.map((x, idx) => (idx === i ? v : x)));
  const removeItem = (i: number) => set("items", draft.items.filter((_, idx) => idx !== i));

  const addRow = () =>
    set("commentsTable", [...(draft.commentsTable ?? []), { doc: "", comment: "", status: "تعديل مطلوب" }]);
  const updateRow = (i: number, patch: Partial<LetterCommentRow>) =>
    set(
      "commentsTable",
      (draft.commentsTable ?? []).map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  const removeRow = (i: number) =>
    set("commentsTable", (draft.commentsTable ?? []).filter((_, idx) => idx !== i));

  const persist = (): string => {
    if (existing) {
      updateLetter(existing.id, draft);
      return existing.id;
    }
    const { id: _id, ref: _ref, status: _s, createdAt: _c, hijriDate: _h, gregorianDate: _g, ...payload } = draft;
    return createLetterDraft(payload);
  };

  const onSaveDraft = () => {
    persist();
    toast.success("تم حفظ المسودة");
    onOpenChange(false);
  };

  const onSend = () => {
    const id = persist();
    sendLetter(id);
    toast.success("تم إرسال الخطاب رسميًا");
    onOpenChange(false);
  };

  const onPrint = () => {
    document.body.classList.add("print-letter-mode");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-letter-mode");
    }, 50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existing ? "تعديل خطاب" : "إنشاء خطاب رسمي"} — {draft.subjectAr}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">تحرير</TabsTrigger>
            <TabsTrigger value="preview">معاينة</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <p className="text-xs text-muted-foreground">
              الحقول المعلّمة <span className="text-destructive font-bold">باللون الأحمر</span> مطلوبة قبل الإصدار.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>الموضوع <span className="text-destructive">*</span></Label>
                <Input
                  value={draft.subjectAr}
                  onChange={(e) => set("subjectAr", e.target.value)}
                  className={reqClass(draft.subjectAr)}
                />
              </div>
              <div>
                <Label>المُرسل إليه <span className="text-destructive">*</span></Label>
                <Input
                  value={draft.addresseeAr}
                  onChange={(e) => set("addresseeAr", e.target.value)}
                  className={reqClass(draft.addresseeAr)}
                />
              </div>
            </div>

            <div>
              <Label>الإشارة <span className="text-destructive">*</span></Label>
              <Textarea
                rows={2}
                placeholder="مثال: بالإشارة إلى الطلب رقم REQ-0001 المقدّم من ..."
                value={draft.referenceAr ?? ""}
                onChange={(e) => set("referenceAr", e.target.value)}
                className={reqClass(draft.referenceAr ?? "")}
              />
            </div>

            <div>
              <Label>مقدمة الخطاب (الإفادة) <span className="text-destructive">*</span></Label>
              <Textarea
                rows={3}
                value={draft.bodyIntroAr}
                onChange={(e) => set("bodyIntroAr", e.target.value)}
                className={reqClass(draft.bodyIntroAr)}
              />
            </div>

            {type !== "comments" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {type === "additional_docs"
                      ? "المستندات المطلوبة"
                      : type === "approval"
                        ? "الشروط"
                        : "الأسباب"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Button size="sm" variant="outline" onClick={addItem}>
                    <Plus className="h-3 w-3 me-1" /> إضافة بند
                  </Button>
                </div>
                {draft.items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={it}
                      onChange={(e) => updateItem(i, e.target.value)}
                      className={reqClass(it)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeItem(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {type === "comments" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>جدول الملاحظات</Label>
                  <Button size="sm" variant="outline" onClick={addRow}>
                    <Plus className="h-3 w-3 me-1" /> إضافة صف
                  </Button>
                </div>
                {(draft.commentsTable ?? []).map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <Input
                      className={`col-span-4 ${reqClass(row.doc)}`}
                      placeholder="المستند"
                      value={row.doc}
                      onChange={(e) => updateRow(i, { doc: e.target.value })}
                    />
                    <Input
                      className={`col-span-5 ${reqClass(row.comment)}`}
                      placeholder="التعليق"
                      value={row.comment}
                      onChange={(e) => updateRow(i, { comment: e.target.value })}
                    />
                    <Input
                      className={`col-span-2 ${reqClass(row.status)}`}
                      placeholder="الحالة"
                      value={row.status}
                      onChange={(e) => updateRow(i, { status: e.target.value })}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="col-span-1"
                      onClick={() => removeRow(i)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label>الخاتمة / المطلوب <span className="text-destructive">*</span></Label>
              <Textarea
                rows={2}
                value={draft.closingAr}
                onChange={(e) => set("closingAr", e.target.value)}
                className={reqClass(draft.closingAr)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>اسم الموقّع</Label>
                <Input
                  value={draft.signatoryAr}
                  onChange={(e) => set("signatoryAr", e.target.value)}
                />
              </div>
              <div>
                <Label>المسمى الوظيفي</Label>
                <Input
                  value={draft.signatoryTitleAr}
                  onChange={(e) => set("signatoryTitleAr", e.target.value)}
                />
              </div>
              <div>
                <Label>عدد المرفقات</Label>
                <Input
                  type="number"
                  value={draft.attachmentsCount}
                  onChange={(e) => set("attachmentsCount", Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={draft.classified}
                onCheckedChange={(v) => set("classified", Boolean(v))}
              />
              <Label>تصنيف "سري"</Label>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="overflow-auto rounded border bg-muted/40 p-4">
              <LetterTemplate letter={draft} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4 me-1" /> طباعة
          </Button>
          <Button variant="secondary" onClick={onSaveDraft}>
            <Save className="h-4 w-4 me-1" /> حفظ كمسودة
          </Button>
          <Button onClick={onSend}>
            <Send className="h-4 w-4 me-1" /> إرسال
          </Button>
        </DialogFooter>

        {/* hidden print area renders draft for printing */}
        <div className="print-only-letter">
          <LetterTemplate letter={draft} idForPrint="letter-print-area" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
