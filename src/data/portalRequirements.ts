export type PortalRequirement = {
  id: string;
  nameAr: string;
  nameEn: string;
  directive: string;
  required: boolean;
  descriptionAr?: string;
};

export type PortalStage = {
  stage: 1 | 2 | 3 | 4;
  titleAr: string;
  titleEn: string;
  items: PortalRequirement[];
};

export const portalStages: PortalStage[] = [
  {
    stage: 1,
    titleAr: "تقييم المخاطر الأمنية والتصميم المبدئي",
    titleEn: "Security Risk Assessment & Concept of Design",
    items: [
      { id: "s1-1", nameAr: "تقرير تقييم المخاطر الأمنية", nameEn: "Security Risk Assessment Report", directive: "SEC-01", required: true, descriptionAr: "يتضمن تحليل التهديدات ونقاط الضعف وفق منهجية API" },
      { id: "s1-2", nameAr: "التصميم المبدئي للأمن", nameEn: "Security Concept of Design", directive: "SEC-14", required: true, descriptionAr: "التصور العام لنظام الأمن المادي والإلكتروني" },
      { id: "s1-3", nameAr: "نموذج تصنيف المنشأة", nameEn: "Facility Classification Form", directive: "SEC-01", required: true, descriptionAr: "تحديد مستوى الحماية المطلوب" },
      { id: "s1-4", nameAr: "مخطط الموقع العام", nameEn: "General Site Layout", directive: "SAF-01", required: true, descriptionAr: "يشمل مواقع محطات الإطفاء وخطوط المياه" },
      { id: "s1-5", nameAr: "تحليل معايير الأعمال", nameEn: "Business Criteria Analysis", directive: "SEC-01", required: true },
      { id: "s1-6", nameAr: "خطاب تعيين الاستشاري", nameEn: "Consultant Assignment Letter", directive: "SEC-14", required: true },
    ],
  },
  {
    stage: 2,
    titleAr: "التصميم الأولي",
    titleEn: "Preliminary Design",
    items: [
      { id: "s2-1", nameAr: "تقرير FEED للأمن", nameEn: "Security FEED Report", directive: "SEC-14", required: true, descriptionAr: "يشمل التصميم الأولي لأنظمة المراقبة والتحكم" },
      { id: "s2-2", nameAr: "مصفوفة الامتثال", nameEn: "Compliance Matrix", directive: "SEC-01", required: true, descriptionAr: "تقاطع المتطلبات مع التصميم" },
      { id: "s2-3", nameAr: "التصميم الأولي للحماية من الحريق", nameEn: "Preliminary Fire Protection Design", directive: "SAF-01", required: true },
      { id: "s2-4", nameAr: "الحسابات الهيدروليكية الأولية", nameEn: "Preliminary Hydraulic Calculations", directive: "SAF-08", required: true },
      { id: "s2-5", nameAr: "مخطط مسافات المباني", nameEn: "Building Spacing Layout", directive: "SAF-07", required: true },
      { id: "s2-6", nameAr: "وثائق تأهيل المقاول", nameEn: "Contractor Prequalification Docs", directive: "SEC-14", required: false },
    ],
  },
  {
    stage: 3,
    titleAr: "التصميم التفصيلي",
    titleEn: "Detail Design",
    items: [
      { id: "s3-1", nameAr: "التصميم التفصيلي 60%", nameEn: "60% Detailed Design", directive: "SEC-14", required: true, descriptionAr: "تفاصيل الأجهزة والبرمجيات" },
      { id: "s3-2", nameAr: "التصميم التفصيلي 90%", nameEn: "90% Detailed Design", directive: "SEC-14", required: true, descriptionAr: "حتى مستوى المعدات الفردية" },
      { id: "s3-3", nameAr: "وثائق اختبار المصنع FAT", nameEn: "Factory Acceptance Test Docs", directive: "SEC-14", required: true },
      { id: "s3-4", nameAr: "تفاصيل أنظمة الكشف والإطفاء", nameEn: "Detection & Suppression System Details", directive: "SAF-08", required: true },
      { id: "s3-5", nameAr: "مخطط العلاقة بين السبب والنتيجة", nameEn: "Cause & Effect Diagram", directive: "SAF-11", required: true },
      { id: "s3-6", nameAr: "مواصفات العزل الحراري", nameEn: "Fireproofing Specifications", directive: "SAF-09", required: false },
    ],
  },
  {
    stage: 4,
    titleAr: "التشغيل",
    titleEn: "Commissioning",
    items: [
      { id: "s4-1", nameAr: "تقرير اختبار القبول بالموقع SAT", nameEn: "Site Acceptance Test Report", directive: "SEC-14", required: true },
      { id: "s4-2", nameAr: "نظام إدارة الحوادث", nameEn: "Incident Management System", directive: "SAF-01", required: true },
      { id: "s4-3", nameAr: "نظام تصاريح العمل", nameEn: "Permit to Work System", directive: "SAF-01", required: true },
      { id: "s4-4", nameAr: "خطة الاستجابة للطوارئ", nameEn: "Emergency Response Plan", directive: "SAF-01", required: true },
      { id: "s4-5", nameAr: "شهادة الامتثال", nameEn: "Declaration of Compliance", directive: "SEC-01", required: true, descriptionAr: "موقعة من مدير الأمن الصناعي" },
      { id: "s4-6", nameAr: "وثائق التسليم النهائي", nameEn: "Final Handover Documentation", directive: "SEC-14", required: true },
    ],
  },
];
