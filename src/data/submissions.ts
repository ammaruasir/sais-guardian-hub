import { projects, type Stage, type ProjectStatus } from "./index";

export type DocItem = { name: string; size: string; type: string };
export type ChecklistResult = "pass" | "fail" | "na";
export type ChecklistItem = { code: string; labelAr: string; result: ChecklistResult };
export type SubmissionStatus = "approved" | "under_review" | "additional_docs" | "rejected" | "pending_final";

export type Submission = {
  id: string;
  projectId: string;
  stage: Stage;
  submittedAt: string;
  status: SubmissionStatus;
  documents: DocItem[];
  reviewedAt?: string;
  reviewerId?: string;
  decision?: "approved" | "additional_docs" | "rejected";
  comments?: string;
  checklist?: ChecklistItem[];
};

const stageDocs: Record<Stage, DocItem[]> = {
  1: [
    { name: "تقرير تقييم المخاطر.pdf", size: "2.4 MB", type: "pdf" },
    { name: "مخطط الموقع العام.dwg", size: "8.1 MB", type: "dwg" },
    { name: "قائمة المواد الخطرة.xlsx", size: "180 KB", type: "xlsx" },
  ],
  2: [
    { name: "التصميم الأولي للحماية.pdf", size: "5.2 MB", type: "pdf" },
    { name: "مخطط أنظمة الإطفاء.dwg", size: "6.7 MB", type: "dwg" },
    { name: "دراسة هايزوب الأولية.pdf", size: "3.1 MB", type: "pdf" },
  ],
  3: [
    { name: "التصميم التفصيلي للأمن.pdf", size: "12.4 MB", type: "pdf" },
    { name: "مخططات SCADA.pdf", size: "4.8 MB", type: "pdf" },
    { name: "خطة الاستجابة للطوارئ.pdf", size: "1.9 MB", type: "pdf" },
    { name: "حسابات الحمل الحراري.xlsx", size: "320 KB", type: "xlsx" },
  ],
  4: [
    { name: "تقرير اختبارات التشغيل.pdf", size: "7.2 MB", type: "pdf" },
    { name: "شهادات معايرة الأجهزة.pdf", size: "2.1 MB", type: "pdf" },
    { name: "دليل التشغيل النهائي.pdf", size: "9.5 MB", type: "pdf" },
  ],
};

const checklistByStage: Record<Stage, ChecklistItem[]> = {
  1: [
    { code: "SEC-01", labelAr: "تقييم المخاطر مكتمل", result: "pass" },
    { code: "RSK-01", labelAr: "تحديد التهديدات الأمنية", result: "pass" },
    { code: "RSK-02", labelAr: "تصنيف الأصول الحرجة", result: "pass" },
    { code: "DOC-01", labelAr: "اكتمال المستندات الإلزامية", result: "pass" },
  ],
  2: [
    { code: "SAF-01", labelAr: "مخطط الحماية من الحريق", result: "pass" },
    { code: "DSG-01", labelAr: "التصميم الأولي للمحيط الأمني", result: "pass" },
    { code: "DSG-02", labelAr: "مواقع كاميرات المراقبة", result: "pass" },
    { code: "HAZ-01", labelAr: "دراسة هايزوب الأولية", result: "pass" },
  ],
  3: [
    { code: "ENG-01", labelAr: "التصميم التفصيلي معتمد هندسياً", result: "pass" },
    { code: "INT-01", labelAr: "التكامل مع أنظمة المنشأة", result: "pass" },
    { code: "SEC-02", labelAr: "أنظمة التحكم بالدخول", result: "pass" },
    { code: "EMR-01", labelAr: "خطة الاستجابة للطوارئ", result: "pass" },
  ],
  4: [
    { code: "COM-01", labelAr: "اختبارات التشغيل ناجحة", result: "pass" },
    { code: "OPS-01", labelAr: "تدريب فريق التشغيل", result: "pass" },
    { code: "CRT-01", labelAr: "شهادات المعايرة سارية", result: "pass" },
    { code: "DOC-02", labelAr: "أدلة التشغيل والصيانة", result: "pass" },
  ],
};

const statusToSubmission: Record<ProjectStatus, SubmissionStatus> = {
  under_review: "under_review",
  awaiting_submission: "under_review",
  additional_docs: "additional_docs",
  approved: "approved",
  rejected: "rejected",
  pending_final: "pending_final",
};

export const submissions: Submission[] = projects.flatMap((p) => {
  const list: Submission[] = [];
  for (let s = 1 as Stage; s < p.stage; s = (s + 1) as Stage) {
    list.push({
      id: `${p.id}-s${s}`,
      projectId: p.id,
      stage: s,
      submittedAt: `2026-0${Math.max(1, 4 - (p.stage - s))}-${10 + s * 2}`,
      status: "approved",
      documents: stageDocs[s],
      reviewedAt: `2026-0${Math.max(1, 4 - (p.stage - s))}-${12 + s * 2}`,
      reviewerId: p.reviewerId,
      decision: "approved",
      comments: "تمت المراجعة والاعتماد. جميع المتطلبات مستوفاة.",
      checklist: checklistByStage[s],
    });
  }
  list.push({
    id: `${p.id}-s${p.stage}`,
    projectId: p.id,
    stage: p.stage,
    submittedAt: p.submittedAt,
    status: statusToSubmission[p.status],
    documents: stageDocs[p.stage],
    reviewerId: p.reviewerId,
    checklist: checklistByStage[p.stage].map((c, i) =>
      p.status === "additional_docs" && i === 0 ? { ...c, result: "fail" as ChecklistResult } : c,
    ),
    comments: p.status === "additional_docs" ? "يرجى تحديث تقرير المخاطر بأحدث البيانات." : undefined,
  });
  return list;
});

export function getSubmissionsByProject(projectId: string) {
  return submissions.filter((s) => s.projectId === projectId).sort((a, b) => a.stage - b.stage);
}
