export type DepartmentKey =
  | "reception"
  | "security_review"
  | "fire_safety"
  | "engineering"
  | "compliance"
  | "field_inspection"
  | "executive";

export type Department = {
  key: DepartmentKey;
  nameAr: string;
  nameEn: string;
  canFinalApprove: boolean;
};

export const departments: Department[] = [
  { key: "reception", nameAr: "إدارة الاستقبال", nameEn: "Reception", canFinalApprove: false },
  { key: "security_review", nameAr: "المراجعة الأمنية", nameEn: "Security Review", canFinalApprove: false },
  { key: "fire_safety", nameAr: "السلامة والحريق", nameEn: "Fire & Safety", canFinalApprove: false },
  { key: "engineering", nameAr: "الإدارة الهندسية", nameEn: "Engineering", canFinalApprove: false },
  { key: "compliance", nameAr: "الامتثال", nameEn: "Compliance", canFinalApprove: true },
  { key: "field_inspection", nameAr: "التفتيش الميداني", nameEn: "Field Inspection", canFinalApprove: false },
  { key: "executive", nameAr: "المكتب التنفيذي", nameEn: "Executive Office", canFinalApprove: true },
];

export type RequestType =
  | "new_project"
  | "modification"
  | "inspection"
  | "consultation"
  | "complaint"
  | "other";

export const requestTypeLabel: Record<RequestType, { ar: string; en: string; tone: string }> = {
  new_project: { ar: "مشروع جديد", en: "New Project", tone: "primary" },
  modification: { ar: "تعديل", en: "Modification", tone: "secondary" },
  inspection: { ar: "تفتيش", en: "Inspection", tone: "warning" },
  consultation: { ar: "استشارة", en: "Consultation", tone: "muted" },
  complaint: { ar: "شكوى", en: "Complaint", tone: "destructive" },
  other: { ar: "أخرى", en: "Other", tone: "muted" },
};

export type RequestStatus =
  | "submitted"
  | "in_review"
  | "additional_docs"
  | "escalated"
  | "approved"
  | "rejected"
  | "returned";

export const requestStatusLabel: Record<RequestStatus, { ar: string; en: string; tone: string }> = {
  submitted: { ar: "مقدم", en: "Submitted", tone: "secondary" },
  in_review: { ar: "قيد المراجعة", en: "In Review", tone: "primary" },
  additional_docs: { ar: "مستندات إضافية", en: "Additional Docs", tone: "warning" },
  escalated: { ar: "مرفوع", en: "Escalated", tone: "warning" },
  approved: { ar: "معتمد", en: "Approved", tone: "success" },
  rejected: { ar: "مرفوض", en: "Rejected", tone: "destructive" },
  returned: { ar: "مُعاد", en: "Returned", tone: "muted" },
};

export type Priority = "urgent" | "high" | "normal" | "low";
export const priorityLabel: Record<Priority, { ar: string; en: string; tone: string }> = {
  urgent: { ar: "عاجل", en: "Urgent", tone: "destructive" },
  high: { ar: "عالية", en: "High", tone: "warning" },
  normal: { ar: "عادية", en: "Normal", tone: "secondary" },
  low: { ar: "منخفضة", en: "Low", tone: "muted" },
};

export type AssignmentAction =
  | "submitted"
  | "assigned"
  | "reviewed"
  | "additional_docs"
  | "escalated"
  | "returned"
  | "approved"
  | "rejected"
  | "commented";

export type AssignmentEntry = {
  id: string;
  department: DepartmentKey;
  assigneeAr: string;
  action: AssignmentAction;
  noteAr?: string;
  startedAt: string;
  endedAt?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
};

export type RequestComment = {
  id: string;
  authorAr: string;
  visibility: "internal" | "external";
  body: string;
  ts: string;
};

export type RequestDocument = {
  id: string;
  nameAr: string;
  uploadedBy: string;
  ts: string;
  sizeKb: number;
};

export type SaisRequest = {
  id: string;
  ref: string;
  titleAr: string;
  type: RequestType;
  companyId: string;
  priority: Priority;
  status: RequestStatus;
  currentDepartment: DepartmentKey;
  receivedAt: string;
  lastUpdate: string;
  descriptionAr: string;
  chain: AssignmentEntry[];
  comments: RequestComment[];
  documents: RequestDocument[];
  relatedProjectId?: string;
  letterRefs?: string[];
};

export const requests: SaisRequest[] = [
  {
    id: "r1",
    ref: "REQ-0001",
    titleAr: "طلب اعتماد مشروع توسعة رأس تنورة",
    type: "new_project",
    companyId: "aramco",
    priority: "urgent",
    status: "in_review",
    currentDepartment: "engineering",
    receivedAt: "2026-04-22",
    lastUpdate: "2026-05-06",
    descriptionAr: "طلب اعتماد التصميم التفصيلي لمشروع توسعة مصفاة رأس تنورة بسعة إنتاجية إضافية.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-04-22", endedAt: "2026-04-22" },
      { id: "c2", department: "security_review", assigneeAr: "م. خالد الحربي", action: "reviewed", noteAr: "تم استكمال المراجعة الأمنية الأولية", startedAt: "2026-04-23", endedAt: "2026-04-28" },
      { id: "c3", department: "engineering", assigneeAr: "م. عبدالعزيز السبيعي", action: "assigned", startedAt: "2026-04-28" },
    ],
    comments: [
      { id: "cm1", authorAr: "م. خالد الحربي", visibility: "internal", body: "يلزم التحقق من حسابات الحماية المحيطية قبل التحويل للامتثال.", ts: "2026-04-27" },
    ],
    documents: [
      { id: "d1", nameAr: "ملف التصميم التفصيلي.pdf", uploadedBy: "أرامكو", ts: "2026-04-22", sizeKb: 8420 },
      { id: "d2", nameAr: "تقرير المخاطر الأمنية.pdf", uploadedBy: "أرامكو", ts: "2026-04-22", sizeKb: 1245 },
    ],
    relatedProjectId: "p1",
  },
  {
    id: "r2",
    ref: "REQ-0002",
    titleAr: "طلب تعديل تصميم منشأة الجبيل",
    type: "modification",
    companyId: "sabic",
    priority: "high",
    status: "additional_docs",
    currentDepartment: "fire_safety",
    receivedAt: "2026-04-25",
    lastUpdate: "2026-05-04",
    descriptionAr: "طلب تعديل في توزيع كاميرات المراقبة وأنظمة الإنذار بمجمع الجبيل.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-04-25", endedAt: "2026-04-25" },
      { id: "c2", department: "fire_safety", assigneeAr: "م. فهد القحطاني", action: "additional_docs", noteAr: "مطلوب مخطط محدّث لمسارات الإخلاء", startedAt: "2026-04-26" },
    ],
    comments: [],
    documents: [
      { id: "d1", nameAr: "طلب التعديل.pdf", uploadedBy: "سابك", ts: "2026-04-25", sizeKb: 542 },
    ],
    relatedProjectId: "p2",
  },
  {
    id: "r3",
    ref: "REQ-0003",
    titleAr: "طلب تفتيش دوري — وعد الشمال",
    type: "inspection",
    companyId: "maaden",
    priority: "normal",
    status: "in_review",
    currentDepartment: "field_inspection",
    receivedAt: "2026-04-28",
    lastUpdate: "2026-05-05",
    descriptionAr: "طلب جدولة زيارة تفتيش دورية لمجمع وعد الشمال للفوسفات.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-04-28", endedAt: "2026-04-28" },
      { id: "c2", department: "field_inspection", assigneeAr: "م. عبدالله الدوسري", action: "assigned", startedAt: "2026-04-29" },
    ],
    comments: [],
    documents: [],
    relatedProjectId: "p3",
  },
  {
    id: "r4",
    ref: "REQ-0004",
    titleAr: "استشارة فنية — منشأة المراعي",
    type: "consultation",
    companyId: "almarai",
    priority: "low",
    status: "submitted",
    currentDepartment: "reception",
    receivedAt: "2026-05-02",
    lastUpdate: "2026-05-02",
    descriptionAr: "طلب استشارة حول متطلبات نظام التحكم بالدخول الجديد.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-05-02" },
    ],
    comments: [],
    documents: [],
  },
  {
    id: "r5",
    ref: "REQ-0005",
    titleAr: "اعتماد محطة الرياض الغربية",
    type: "new_project",
    companyId: "sec",
    priority: "high",
    status: "approved",
    currentDepartment: "compliance",
    receivedAt: "2026-04-15",
    lastUpdate: "2026-05-01",
    descriptionAr: "طلب الاعتماد النهائي لمحطة تحويل الرياض الغربية بعد إكمال جميع المراحل.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-04-15", endedAt: "2026-04-15" },
      { id: "c2", department: "security_review", assigneeAr: "م. خالد الحربي", action: "reviewed", startedAt: "2026-04-16", endedAt: "2026-04-22" },
      { id: "c3", department: "compliance", assigneeAr: "م. نورة الشمري", action: "approved", noteAr: "تم الاعتماد النهائي", startedAt: "2026-04-23", endedAt: "2026-05-01" },
    ],
    comments: [
      { id: "cm1", authorAr: "م. نورة الشمري", visibility: "external", body: "تم اعتماد المشروع. يمكن المباشرة بالتنفيذ.", ts: "2026-05-01" },
    ],
    documents: [
      { id: "d1", nameAr: "حزمة الاعتماد النهائي.pdf", uploadedBy: "شركة الكهرباء", ts: "2026-04-15", sizeKb: 12450 },
    ],
    relatedProjectId: "p4",
  },
  {
    id: "r6",
    ref: "REQ-0006",
    titleAr: "شكوى تأخر إصدار شهادة",
    type: "complaint",
    companyId: "almarai",
    priority: "urgent",
    status: "escalated",
    currentDepartment: "executive",
    receivedAt: "2026-05-03",
    lastUpdate: "2026-05-06",
    descriptionAr: "شكوى بشأن تأخر إصدار شهادة معايرة أنظمة السلامة لأكثر من ٣٠ يومًا.",
    chain: [
      { id: "c1", department: "reception", assigneeAr: "م. سارة العتيبي", action: "submitted", startedAt: "2026-05-03", endedAt: "2026-05-03" },
      { id: "c2", department: "compliance", assigneeAr: "م. نورة الشمري", action: "escalated", noteAr: "رفعت للمكتب التنفيذي للأهمية", startedAt: "2026-05-04", endedAt: "2026-05-06" },
      { id: "c3", department: "executive", assigneeAr: "أ. ماجد الزهراني", action: "assigned", startedAt: "2026-05-06" },
    ],
    comments: [
      { id: "cm1", authorAr: "م. نورة الشمري", visibility: "internal", body: "حالة حساسة — يلزم رد رسمي خلال ٤٨ ساعة.", ts: "2026-05-04" },
    ],
    documents: [],
  },
];
