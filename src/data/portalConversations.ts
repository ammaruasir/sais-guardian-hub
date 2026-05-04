export type PortalMessage = {
  id: string;
  projectId: string;
  sender: "sais" | "company";
  senderName: string;
  ts: string;
  body: string;
};

export const portalConversations: PortalMessage[] = [
  // p1 — توسعة رأس تنورة
  { id: "m1-1", projectId: "p1", sender: "sais", senderName: "م. خالد الحربي", ts: "2026-04-22 09:15", body: "تم استلام تقديم المرحلة 3. سيتم بدء المراجعة الفنية." },
  { id: "m1-2", projectId: "p1", sender: "sais", senderName: "م. خالد الحربي", ts: "2026-04-24 11:30", body: "يرجى تقديم تحديث لتقرير تقييم المخاطر بعد التعديلات المطلوبة في القسم 4.2." },
  { id: "m1-3", projectId: "p1", sender: "company", senderName: "م. أحمد الراشد", ts: "2026-04-25 14:05", body: "تم إرفاق التقرير المحدث — الرجاء مراجعة القسم 4.2 المعدّل." },
  { id: "m1-4", projectId: "p1", sender: "sais", senderName: "م. خالد الحربي", ts: "2026-04-26 08:40", body: "شكراً — تمت إحالة المستند للمراجع المختص." },

  // p6 — خط أنابيب الشرقية
  { id: "m6-1", projectId: "p6", sender: "sais", senderName: "م. عبدالله الدوسري", ts: "2026-04-25 10:00", body: "بدأت المراجعة الميدانية للتصميم التفصيلي." },
  { id: "m6-2", projectId: "p6", sender: "company", senderName: "م. أحمد الراشد", ts: "2026-04-26 12:20", body: "نشكركم على المتابعة. الاستشاري متاح للزيارة الميدانية." },
  { id: "m6-3", projectId: "p6", sender: "sais", senderName: "م. عبدالله الدوسري", ts: "2026-04-28 09:00", body: "موعد الزيارة محدد يوم الأحد القادم الساعة 10 صباحاً." },

  // p9 — ميناء جدة الجنوبي
  { id: "m9-1", projectId: "p9", sender: "sais", senderName: "م. عبدالله الدوسري", ts: "2026-04-23 13:10", body: "تم استلام مستندات التشغيل. الرجاء التأكد من صلاحية شهادات المعايرة." },
  { id: "m9-2", projectId: "p9", sender: "company", senderName: "م. أحمد الراشد", ts: "2026-04-24 09:45", body: "جميع الشهادات سارية حتى نهاية 2026 — تم إرفاق نسخة محدّثة." },
  { id: "m9-3", projectId: "p9", sender: "sais", senderName: "م. عبدالله الدوسري", ts: "2026-04-27 16:00", body: "ممتاز — جاري إعداد التوصية النهائية." },

  // p12 — مصفاة جازان
  { id: "m12-1", projectId: "p12", sender: "sais", senderName: "م. نورة الشمري", ts: "2026-04-12 11:00", body: "تم اعتماد المرحلة النهائية للمشروع. مبارك." },
  { id: "m12-2", projectId: "p12", sender: "company", senderName: "م. أحمد الراشد", ts: "2026-04-12 12:30", body: "نشكركم على التعاون والمتابعة المستمرة." },
  { id: "m12-3", projectId: "p12", sender: "sais", senderName: "م. نورة الشمري", ts: "2026-04-13 10:15", body: "سيتم إصدار شهادة الامتثال خلال يومين." },
];

export function getMessagesByProject(projectId: string) {
  return portalConversations.filter((m) => m.projectId === projectId);
}

export function nextSubmissionRef(projectId: string, stage: number) {
  return `SAIS-2026-04-${projectId.toUpperCase()}-S${stage}-001`;
}
