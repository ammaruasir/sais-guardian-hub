export type NotificationType =
  | "approval"
  | "request"
  | "rejection"
  | "deadline"
  | "submission"
  | "comment";

export type AppNotification = {
  id: string;
  titleAr: string;
  descriptionAr: string;
  type: NotificationType;
  ts: string;
  read: boolean;
  linkTo: string;
  forRole: "sais" | "company" | "both";
};

export const notifications: AppNotification[] = [
  // SAIS
  {
    id: "n1",
    type: "approval",
    titleAr: "تم تقديم المرحلة 1 — مصنع الجبيل الجديد (سابك)",
    descriptionAr: "بانتظار المراجعة الأولية من فريق الأمن الصناعي.",
    ts: "قبل ساعتين",
    read: false,
    linkTo: "/projects/p2",
    forRole: "sais",
  },
  {
    id: "n2",
    type: "submission",
    titleAr: "تحديث مستندات — توسعة رأس تنورة (أرامكو)",
    descriptionAr: "تم رفع نسخة محدّثة من تقييم المخاطر.",
    ts: "قبل 3 ساعات",
    read: false,
    linkTo: "/projects/p1",
    forRole: "sais",
  },
  {
    id: "n3",
    type: "deadline",
    titleAr: "تنبيه: مراجعة خط أنابيب الشرقية متأخرة 3 أيام",
    descriptionAr: "المهمة تجاوزت الموعد المحدد للرد.",
    ts: "قبل 5 ساعات",
    read: false,
    linkTo: "/projects/p6",
    forRole: "sais",
  },
  {
    id: "n4",
    type: "comment",
    titleAr: "م. نورة الشمري أضافت تعليقاً — وعد الشمال",
    descriptionAr: "ملاحظة على وثيقة خطة الاستجابة للطوارئ.",
    ts: "أمس",
    read: true,
    linkTo: "/projects/p3",
    forRole: "sais",
  },
  {
    id: "n5",
    type: "submission",
    titleAr: "تم تقديم وثائق التشغيل — ميناء جدة الجنوبي",
    descriptionAr: "المرحلة 4 جاهزة للمراجعة الميدانية.",
    ts: "أمس",
    read: true,
    linkTo: "/projects/p9",
    forRole: "sais",
  },
  {
    id: "n6",
    type: "approval",
    titleAr: "مصفاة جازان — اعتماد نهائي جاهز للتوقيع",
    descriptionAr: "إغلاق ملف المشروع بعد اكتمال جميع المراحل.",
    ts: "قبل يومين",
    read: true,
    linkTo: "/projects/p12",
    forRole: "sais",
  },
  // Company / Aramco
  {
    id: "n7",
    type: "request",
    titleAr: "مطلوب مستندات إضافية — توسعة رأس تنورة — المرحلة 3",
    descriptionAr: "يرجى رفع مخططات الحماية المحدّثة خلال 5 أيام.",
    ts: "قبل 3 أيام",
    read: false,
    linkTo: "/portal/requests/r1",
    forRole: "company",
  },
  {
    id: "n8",
    type: "approval",
    titleAr: "تم اعتماد المرحلة 2 — خط أنابيب الشرقية",
    descriptionAr: "يمكنكم البدء بإعداد ملف المرحلة 3.",
    ts: "قبل 5 أيام",
    read: true,
    linkTo: "/portal/projects/p6",
    forRole: "company",
  },
  {
    id: "n9",
    type: "comment",
    titleAr: "تعليق من المراجع — ميناء جدة الجنوبي",
    descriptionAr: "ملاحظة فنية على وثيقة التشغيل.",
    ts: "قبل أسبوع",
    read: true,
    linkTo: "/portal/projects/p9",
    forRole: "company",
  },
  {
    id: "n10",
    type: "approval",
    titleAr: "تم اعتماد المرحلة 4 — مصفاة جازان — المشروع مكتمل",
    descriptionAr: "تهانينا على إكمال جميع متطلبات الامتثال.",
    ts: "قبل أسبوع",
    read: true,
    linkTo: "/portal/projects/p12",
    forRole: "company",
  },
  {
    id: "n11",
    type: "deadline",
    titleAr: "تذكير: موعد تقديم المرحلة 3 — خط الشرقية خلال 3 أيام",
    descriptionAr: "تأكدوا من إرفاق جميع المستندات المطلوبة.",
    ts: "قبل يوم",
    read: false,
    linkTo: "/portal/projects/p6",
    forRole: "company",
  },
  {
    id: "n12",
    type: "submission",
    titleAr: "تم استلام تقديمكم — رقم المرجع REQ-0001",
    descriptionAr: "سيتم إشعاركم عند بدء المراجعة.",
    ts: "قبل أسبوعين",
    read: true,
    linkTo: "/portal/requests/r1",
    forRole: "company",
  },
];

export function getNotificationsForRole(role: "sais" | "company") {
  return notifications.filter((n) => n.forRole === role || n.forRole === "both");
}

export function unreadCountForRole(role: "sais" | "company") {
  return getNotificationsForRole(role).filter((n) => !n.read).length;
}
