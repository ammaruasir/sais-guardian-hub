export type LetterType = "additional_docs" | "approval" | "rejection" | "comments";
export type LetterStatus = "draft" | "sent";

export const letterTypeLabel: Record<LetterType, { ar: string; tone: string }> = {
  additional_docs: { ar: "طلب مستندات إضافية", tone: "warning" },
  approval: { ar: "قرار اعتماد", tone: "success" },
  rejection: { ar: "قرار رفض", tone: "destructive" },
  comments: { ar: "خطاب ملاحظات", tone: "primary" },
};

export const letterStatusLabel: Record<LetterStatus, { ar: string; tone: string }> = {
  draft: { ar: "مسودة", tone: "muted" },
  sent: { ar: "مُرسل", tone: "success" },
};

export type LetterCommentRow = { doc: string; comment: string; status: string };

export type Letter = {
  id: string;
  ref: string; // SAIS/2026/0001
  requestId: string;
  type: LetterType;
  status: LetterStatus;
  subjectAr: string;
  addresseeAr: string;
  referenceAr?: string;
  bodyIntroAr: string;
  items: string[];
  commentsTable?: LetterCommentRow[];
  closingAr: string;
  signatoryAr: string;
  signatoryTitleAr: string;
  hijriDate: string;
  gregorianDate: string;
  attachmentsCount: number;
  classified: boolean;
  createdAt: string;
  sentAt?: string;
};

export function toHijri(d: Date | string): string {
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    const fmt = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(date).replace(" هـ", "") + " هـ";
  } catch {
    return "";
  }
}

export const letters: Letter[] = [
  {
    id: "L-0001",
    ref: "SAIS/2026/0001",
    requestId: "r2",
    type: "additional_docs",
    status: "sent",
    subjectAr: "طلب استكمال مستندات — REQ-0002",
    addresseeAr: "شركة سابك",
    bodyIntroAr:
      "بالإشارة إلى طلبكم رقم REQ-0002 المتعلق بتعديل تصميم منشأة الجبيل، نفيدكم بأنه يلزم استكمال المستندات التالية لاستكمال الإجراءات النظامية:",
    items: [
      "مخطط محدّث لمسارات الإخلاء معتمد من استشاري السلامة.",
      "تقرير حسابات أنظمة كشف الحريق وفق الكود السعودي SBC 801.",
      "شهادة معايرة سارية لأنظمة الإنذار.",
    ],
    closingAr:
      "نأمل تزويدنا بالمستندات أعلاه خلال مدة أقصاها ثلاثون (30) يومًا من تاريخ هذا الخطاب، وفي حال عدم الاستجابة سيتم إغلاق الطلب وفق الإجراءات المعتمدة.",
    signatoryAr: "م. فهد القحطاني",
    signatoryTitleAr: "مدير إدارة السلامة والحريق",
    hijriDate: toHijri("2026-04-26"),
    gregorianDate: "2026-04-26",
    attachmentsCount: 0,
    classified: false,
    createdAt: "2026-04-26",
    sentAt: "2026-04-26",
  },
  {
    id: "L-0002",
    ref: "SAIS/2026/0002",
    requestId: "r5",
    type: "approval",
    status: "sent",
    subjectAr: "قرار اعتماد محطة الرياض الغربية — REQ-0005",
    addresseeAr: "الشركة السعودية للكهرباء",
    bodyIntroAr:
      "إلحاقًا بطلبكم رقم REQ-0005 الخاص باعتماد محطة الرياض الغربية، يسرّنا إفادتكم بصدور القرار النهائي بالموافقة على المشروع المذكور وفق الشروط التالية:",
    items: [
      "الالتزام بمتطلبات الأمن والسلامة الواردة في حزمة الاعتماد.",
      "إخطار الهيئة قبل بدء التشغيل بمدة لا تقل عن 14 يومًا.",
      "تمكين فرق التفتيش من الزيارة الدورية للمنشأة.",
    ],
    closingAr:
      "وعليه يحق لكم المباشرة بأعمال التنفيذ والتشغيل وفقًا للضوابط المعتمدة. ولكم تحياتنا.",
    signatoryAr: "م. نورة الشمري",
    signatoryTitleAr: "مدير إدارة الامتثال",
    hijriDate: toHijri("2026-05-01"),
    gregorianDate: "2026-05-01",
    attachmentsCount: 1,
    classified: false,
    createdAt: "2026-05-01",
    sentAt: "2026-05-01",
  },
  {
    id: "L-0003",
    ref: "SAIS/2026/0003",
    requestId: "r1",
    type: "comments",
    status: "draft",
    subjectAr: "ملاحظات على حزمة التصميم — REQ-0001",
    addresseeAr: "أرامكو السعودية",
    bodyIntroAr:
      "بالإشارة إلى الطلب رقم REQ-0001 المتعلق بمشروع توسعة رأس تنورة، نرفق لكم ملاحظات الفريق الفني على المستندات المقدّمة:",
    items: [],
    commentsTable: [
      { doc: "ملف التصميم التفصيلي.pdf", comment: "تحديث مخطط الحماية المحيطية للقطاع الشمالي.", status: "تعديل مطلوب" },
      { doc: "تقرير المخاطر الأمنية.pdf", comment: "إضافة سيناريوهات الطوارئ المتعلقة بالمواد الخطرة.", status: "إضافة" },
    ],
    closingAr:
      "نأمل معالجة الملاحظات أعلاه وإعادة تقديم النسخة المحدّثة في أقرب وقت.",
    signatoryAr: "م. عبدالعزيز السبيعي",
    signatoryTitleAr: "مدير الإدارة الهندسية",
    hijriDate: toHijri(new Date()),
    gregorianDate: new Date().toISOString().slice(0, 10),
    attachmentsCount: 0,
    classified: true,
    createdAt: new Date().toISOString().slice(0, 10),
  },
];
