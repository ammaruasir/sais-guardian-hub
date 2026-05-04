// Centralized mock data for the SAIS POC. All static, no backend.

export type Sector = "petroleum" | "petrochemicals" | "mining" | "power" | "industrial" | "water" | "other";
export type Classification = "critical" | "high" | "medium" | "low";
export type Stage = 1 | 2 | 3 | 4;
export type ProjectStatus =
  | "under_review"
  | "awaiting_submission"
  | "additional_docs"
  | "approved"
  | "rejected"
  | "pending_final";

export const sectorLabel: Record<Sector, { ar: string; en: string }> = {
  petroleum: { ar: "بترول", en: "Petroleum" },
  petrochemicals: { ar: "بتروكيماويات", en: "Petrochemicals" },
  mining: { ar: "تعدين", en: "Mining" },
  power: { ar: "كهرباء", en: "Power" },
  industrial: { ar: "صناعي", en: "Industrial" },
  water: { ar: "مياه", en: "Water" },
  other: { ar: "أخرى", en: "Other" },
};

export const classificationLabel: Record<Classification, { ar: string; en: string; tone: string }> = {
  critical: { ar: "حرجة", en: "Critical", tone: "destructive" },
  high: { ar: "عالية", en: "High", tone: "warning" },
  medium: { ar: "متوسطة", en: "Medium", tone: "secondary" },
  low: { ar: "منخفضة", en: "Low", tone: "muted" },
};

export const stageLabel: Record<Stage, { ar: string; en: string }> = {
  1: { ar: "تقييم المخاطر", en: "Risk Assessment" },
  2: { ar: "التصميم الأولي", en: "Preliminary Design" },
  3: { ar: "التصميم التفصيلي", en: "Detail Design" },
  4: { ar: "التشغيل", en: "Commissioning" },
};

export const statusLabel: Record<ProjectStatus, { ar: string; en: string; tone: string }> = {
  under_review: { ar: "قيد المراجعة", en: "Under Review", tone: "secondary" },
  awaiting_submission: { ar: "بانتظار التقديم", en: "Awaiting Submission", tone: "muted" },
  additional_docs: { ar: "مطلوب مستندات إضافية", en: "Additional Docs Required", tone: "warning" },
  approved: { ar: "معتمد", en: "Approved", tone: "success" },
  rejected: { ar: "مرفوض", en: "Rejected", tone: "destructive" },
  pending_final: { ar: "بانتظار الاعتماد النهائي", en: "Pending Final Approval", tone: "warning" },
};

export type Company = {
  id: string;
  nameAr: string;
  nameEn: string;
  sector: Sector;
  facilitiesCount: number;
  activeProjects: number;
  compliance: "compliant" | "review" | "non_compliant";
};

export const companies: Company[] = [
  { id: "aramco", nameAr: "أرامكو السعودية", nameEn: "Saudi Aramco", sector: "petroleum", facilitiesCount: 3, activeProjects: 2, compliance: "compliant" },
  { id: "sabic", nameAr: "سابك", nameEn: "SABIC", sector: "petrochemicals", facilitiesCount: 2, activeProjects: 1, compliance: "review" },
  { id: "maaden", nameAr: "معادن", nameEn: "Ma'aden", sector: "mining", facilitiesCount: 1, activeProjects: 1, compliance: "compliant" },
  { id: "almarai", nameAr: "المراعي", nameEn: "Almarai", sector: "industrial", facilitiesCount: 1, activeProjects: 1, compliance: "non_compliant" },
  { id: "sec", nameAr: "شركة الكهرباء السعودية", nameEn: "Saudi Electricity Co.", sector: "power", facilitiesCount: 2, activeProjects: 1, compliance: "compliant" },
];

export type Reviewer = {
  id: string;
  nameAr: string;
  role: string;
  active: number;
  initials: string;
};

export const reviewers: Reviewer[] = [
  { id: "khaled", nameAr: "م. خالد الحربي", role: "مراجع أمني أول", active: 4, initials: "خ" },
  { id: "fahad", nameAr: "م. فهد القحطاني", role: "مراجع السلامة والحريق", active: 3, initials: "ف" },
  { id: "noura", nameAr: "م. نورة الشمري", role: "مديرة الامتثال", active: 2, initials: "ن" },
  { id: "abdullah", nameAr: "م. عبدالله الدوسري", role: "مفتش ميداني", active: 2, initials: "ع" },
];

export type Project = {
  id: string;
  nameAr: string;
  nameEn: string;
  companyId: string;
  facilityAr: string;
  sector: Sector;
  classification: Classification;
  stage: Stage;
  status: ProjectStatus;
  reviewerId: string;
  daysInStage: number;
  submittedAt: string;
  overdue?: boolean;
  daysOverdue?: number;
};

export const projects: Project[] = [
  { id: "p1", nameAr: "توسعة رأس تنورة", nameEn: "Ras Tanura Expansion", companyId: "aramco", facilityAr: "مصفاة رأس تنورة", sector: "petroleum", classification: "critical", stage: 3, status: "under_review", reviewerId: "khaled", daysInStage: 6, submittedAt: "2026-04-22", overdue: true, daysOverdue: 3 },
  { id: "p2", nameAr: "مصنع الجبيل الجديد", nameEn: "Jubail New Plant", companyId: "sabic", facilityAr: "مجمع الجبيل البتروكيماوي", sector: "petrochemicals", classification: "high", stage: 1, status: "under_review", reviewerId: "fahad", daysInStage: 2, submittedAt: "2026-04-30" },
  { id: "p3", nameAr: "تطوير وعد الشمال", nameEn: "Wa'ad Al Shamal Upgrade", companyId: "maaden", facilityAr: "مجمع وعد الشمال للفوسفات", sector: "mining", classification: "high", stage: 4, status: "pending_final", reviewerId: "noura", daysInStage: 5, submittedAt: "2026-04-20" },
  { id: "p4", nameAr: "محطة الرياض الغربية", nameEn: "Riyadh West Substation", companyId: "sec", facilityAr: "محطة تحويل الرياض الغربية", sector: "power", classification: "medium", stage: 2, status: "approved", reviewerId: "khaled", daysInStage: 1, submittedAt: "2026-04-15" },
  { id: "p5", nameAr: "منشأة معالجة حائل", nameEn: "Hail Processing Facility", companyId: "almarai", facilityAr: "منشأة معالجة حائل", sector: "industrial", classification: "medium", stage: 1, status: "additional_docs", reviewerId: "fahad", daysInStage: 9, submittedAt: "2026-04-10", overdue: true, daysOverdue: 2 },
  { id: "p6", nameAr: "خط أنابيب الشرقية", nameEn: "Eastern Pipeline", companyId: "aramco", facilityAr: "خط أنابيب الشرقية", sector: "petroleum", classification: "critical", stage: 3, status: "under_review", reviewerId: "abdullah", daysInStage: 4, submittedAt: "2026-04-25" },
  { id: "p7", nameAr: "مجمع ينبع للأوليفينات", nameEn: "Yanbu Olefins Complex", companyId: "sabic", facilityAr: "مجمع ينبع", sector: "petrochemicals", classification: "high", stage: 2, status: "under_review", reviewerId: "khaled", daysInStage: 3, submittedAt: "2026-04-26" },
  { id: "p8", nameAr: "محطة القصيم الكهربائية", nameEn: "Qassim Power Plant", companyId: "sec", facilityAr: "محطة القصيم", sector: "power", classification: "high", stage: 3, status: "approved", reviewerId: "noura", daysInStage: 2, submittedAt: "2026-04-18" },
  { id: "p9", nameAr: "ميناء جدة الجنوبي", nameEn: "South Jeddah Port", companyId: "aramco", facilityAr: "ميناء جدة", sector: "other", classification: "high", stage: 4, status: "under_review", reviewerId: "abdullah", daysInStage: 3, submittedAt: "2026-04-23" },
  { id: "p10", nameAr: "مصنع الأسمنت الجنوبي", nameEn: "Southern Cement Plant", companyId: "almarai", facilityAr: "مصنع الجنوب", sector: "industrial", classification: "low", stage: 2, status: "awaiting_submission", reviewerId: "fahad", daysInStage: 0, submittedAt: "—" },
  { id: "p11", nameAr: "منجم الزبيرة", nameEn: "Az Zabirah Mine", companyId: "maaden", facilityAr: "منجم الزبيرة", sector: "mining", classification: "high", stage: 3, status: "under_review", reviewerId: "khaled", daysInStage: 4, submittedAt: "2026-04-24" },
  { id: "p12", nameAr: "مصفاة جازان", nameEn: "Jazan Refinery", companyId: "aramco", facilityAr: "مصفاة جازان", sector: "petroleum", classification: "critical", stage: 4, status: "approved", reviewerId: "noura", daysInStage: 1, submittedAt: "2026-04-12" },
];

export type ActivityItem = {
  id: string;
  ts: string;
  who: string;
  ar: string;
  type: "approved" | "submitted" | "requested" | "rejected" | "comment";
};

export const activity: ActivityItem[] = [
  { id: "a1", ts: "قبل 12 دقيقة", who: "م. خالد الحربي", ar: "اعتمد المرحلة 2 لمشروع محطة الرياض الغربية", type: "approved" },
  { id: "a2", ts: "قبل 45 دقيقة", who: "أرامكو السعودية", ar: "قدّمت تحديث المستندات لمشروع توسعة رأس تنورة", type: "submitted" },
  { id: "a3", ts: "قبل ساعة", who: "م. فهد القحطاني", ar: "طلب مستندات إضافية لمشروع منشأة معالجة حائل", type: "requested" },
  { id: "a4", ts: "قبل 3 ساعات", who: "سابك", ar: "قدّمت المرحلة 1 لمشروع مصنع الجبيل الجديد", type: "submitted" },
  { id: "a5", ts: "أمس", who: "م. نورة الشمري", ar: "أضافت تعليقاً على مشروع تطوير وعد الشمال", type: "comment" },
  { id: "a6", ts: "أمس", who: "م. عبدالله الدوسري", ar: "أنهى زيارة تفتيش لميناء جدة الجنوبي", type: "approved" },
];

export const kpis = {
  activeProjects: 12,
  pendingReviews: 7,
  overdue: 2,
  approvalRate: 78,
  avgReviewDays: 4.2,
};
