import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Paperclip, Send, CheckCircle2, X, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { letterTypeLabel, type Letter } from "@/data/letters";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  letter: Letter;
  recipientName: string; // اسم المنشأة
};

type FileItem = { name: string; sizeKb: number };

export function LetterReplyDialog({ open, onOpenChange, letter, recipientName }: Props) {
  const addRequestDocument = useAppStore((s) => s.addRequestDocument);
  const addRequestComment = useAppStore((s) => s.addRequestComment);
  const setState = useAppStore.setState;

  const [acknowledged, setAcknowledged] = useState(false);
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [contactName, setContactName] = useState("م. أحمد الراشد");
  const [contactRole, setContactRole] = useState("مدير الشؤون التنظيمية");

  const lt = letterTypeLabel[letter.type];
  const isAdditionalDocs = letter.type === "additional_docs";
  const requireFiles = isAdditionalDocs;

  const onPickFile = () => {
    // mock file picker
    const mockNames = [
      "مخطط_مسارات_الإخلاء_v2.pdf",
      "تقرير_حسابات_الحريق.pdf",
      "شهادة_المعايرة_السارية.pdf",
      "ملحق_رد_رسمي.pdf",
    ];
    const next = mockNames[files.length % mockNames.length];
    setFiles((f) => [...f, { name: next, sizeKb: 600 + Math.floor(Math.random() * 1800) }]);
  };

  const removeFile = (i: number) => setFiles((f) => f.filter((_, idx) => idx !== i));

  const onSubmit = () => {
    if (!acknowledged) return toast.error("يرجى تأكيد التسلّم أولاً");
    if (requireFiles && files.length === 0) return toast.error("يرجى إرفاق المستندات المطلوبة");
    if (!reply.trim() && !requireFiles) return toast.error("اكتب نص الرد");

    const today = new Date().toISOString().slice(0, 10);

    // attach files
    files.forEach((f) =>
      addRequestDocument(letter.requestId, {
        nameAr: f.name,
        uploadedBy: recipientName,
        sizeKb: f.sizeKb,
      }),
    );

    // external comment with full traceability
    addRequestComment(letter.requestId, {
      authorAr: `${contactName} — ${recipientName}`,
      visibility: "external",
      body: `تم تسلّم الخطاب رقم ${letter.ref} بتاريخ ${today}.${reply ? `\n\n${reply}` : ""}${
        files.length > 0 ? `\n\nالمرفقات: ${files.map((f) => f.name).join("، ")}` : ""
      }`,
    });

    // إذا كان الخطاب طلب مستندات إضافية → نُرجع الطلب لقيد المراجعة
    if (isAdditionalDocs) {
      setState((s) => ({
        requests: s.requests.map((r) =>
          r.id === letter.requestId
            ? { ...r, status: "in_review", lastUpdate: today }
            : r,
        ),
      }));
    }

    // إشعار للهيئة
    useAppStore.getState().addNotification({
      forRole: "sais",
      type: "submission",
      titleAr: `رد المنشأة على الخطاب ${letter.ref}`,
      descriptionAr: `${recipientName} — ${letter.subjectAr}`,
      ts: today,
      linkTo: `/requests/${letter.requestId}`,
    });

    toast.success("تم إرسال الرد رسمياً إلى الهيئة");
    setAcknowledged(false);
    setReply("");
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <DialogTitle>تسلّم والرد على خطاب رسمي</DialogTitle>
          </div>
          <DialogDescription className="space-y-1 pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`border-${lt.tone}/40 text-${lt.tone}`}>
                {lt.ar}
              </Badge>
              <span className="num text-xs">{letter.ref}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="num text-xs text-muted-foreground">{letter.gregorianDate}</span>
            </div>
            <div className="text-sm text-foreground">{letter.subjectAr}</div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Acknowledgement */}
          <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/5 p-3">
            <Checkbox
              id="ack"
              checked={acknowledged}
              onCheckedChange={(v) => setAcknowledged(Boolean(v))}
              className="mt-0.5"
            />
            <Label htmlFor="ack" className="text-sm leading-relaxed cursor-pointer">
              أُقرّ بأن المنشأة تسلّمت الخطاب رقم{" "}
              <span className="num font-bold">{letter.ref}</span> الصادر من الهيئة، وأن المحتوى
              قُرئ وفُهم. (يُسجَّل في سجل التحويل ويُربط برقم الخطاب)
            </Label>
          </div>

          {/* Recipient */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">اسم المختص بالتسلّم</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">المسمى الوظيفي</Label>
              <Input value={contactRole} onChange={(e) => setContactRole(e.target.value)} />
            </div>
          </div>

          {/* Reply body */}
          <div>
            <Label className="text-xs">
              {isAdditionalDocs ? "ملاحظة الرد (اختياري)" : "نص الرد"}
            </Label>
            <Textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={
                isAdditionalDocs
                  ? "وصف موجز للمستندات المرفقة..."
                  : "اكتب رد المنشأة على الخطاب..."
              }
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">
                المرفقات {requireFiles && <span className="text-destructive">*</span>}
              </Label>
              <Button size="sm" variant="outline" onClick={onPickFile}>
                <Paperclip className="h-3 w-3 me-1" /> إرفاق ملف
              </Button>
            </div>
            {files.length === 0 ? (
              <div className="rounded border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                لم يُرفق أي ملف بعد
              </div>
            ) : (
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <span>{f.name}</span>
                      <span className="num text-xs text-muted-foreground">({f.sizeKb} KB)</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFile(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onSubmit}>
            {acknowledged ? <Send className="h-4 w-4 me-1" /> : <CheckCircle2 className="h-4 w-4 me-1" />}
            تأكيد التسلّم وإرسال الرد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
