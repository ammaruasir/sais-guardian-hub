import type { Stage } from "./index";

export type Requirement = { code: string; labelAr: string };

export const requirementsByStage: Record<Stage, Requirement[]> = {
  1: [
    { code: "SEC-01", labelAr: "تقييم المخاطر الأمنية" },
    { code: "RSK-01", labelAr: "تحديد التهديدات والثغرات" },
    { code: "RSK-02", labelAr: "تصنيف الأصول الحرجة" },
    { code: "DOC-01", labelAr: "مخطط الموقع العام" },
    { code: "HAZ-00", labelAr: "قائمة المواد الخطرة" },
  ],
  2: [
    { code: "SAF-01", labelAr: "مخطط الحماية من الحريق" },
    { code: "DSG-01", labelAr: "التصميم الأولي للمحيط الأمني" },
    { code: "DSG-02", labelAr: "مواقع كاميرات المراقبة" },
    { code: "HAZ-01", labelAr: "دراسة هايزوب الأولية" },
    { code: "DOC-03", labelAr: "مذكرة المتطلبات الفنية" },
  ],
  3: [
    { code: "ENG-01", labelAr: "التصميم التفصيلي الهندسي" },
    { code: "INT-01", labelAr: "التكامل مع أنظمة المنشأة" },
    { code: "SEC-02", labelAr: "أنظمة التحكم بالدخول" },
    { code: "EMR-01", labelAr: "خطة الاستجابة للطوارئ" },
    { code: "DOC-04", labelAr: "حسابات هندسية معتمدة" },
  ],
  4: [
    { code: "COM-01", labelAr: "تقرير اختبارات التشغيل" },
    { code: "OPS-01", labelAr: "تدريب فريق التشغيل" },
    { code: "CRT-01", labelAr: "شهادات معايرة الأجهزة" },
    { code: "DOC-02", labelAr: "أدلة التشغيل والصيانة" },
  ],
};
