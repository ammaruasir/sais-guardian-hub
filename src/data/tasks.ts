export type TaskType = "review" | "inspection" | "followup";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "new" | "in_progress" | "waiting" | "completed";

export type TaskComment = { by: string; text: string; ts: string };

export type Task = {
  id: string;
  titleAr: string;
  projectId: string;
  type: TaskType;
  priority: TaskPriority;
  assigneeId: string;
  status: TaskStatus;
  dueDate: string;
  overdue: boolean;
  descriptionAr?: string;
  comments?: TaskComment[];
};

export const currentUserId = "khaled";

export const taskTypeLabel: Record<TaskType, string> = {
  review: "مراجعة",
  inspection: "تفتيش",
  followup: "متابعة",
};

export const taskPriorityLabel: Record<TaskPriority, { ar: string; cls: string }> = {
  urgent: { ar: "عاجل", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  high: { ar: "عالي", cls: "bg-warning/20 text-warning-foreground border-warning/30" },
  medium: { ar: "متوسط", cls: "bg-secondary/15 text-secondary border-secondary/30" },
  low: { ar: "منخفض", cls: "bg-muted text-muted-foreground border-border" },
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  new: "جديدة",
  in_progress: "قيد التنفيذ",
  waiting: "بانتظار الرد",
  completed: "مكتملة",
};

export const tasks: Task[] = [
  {
    id: "t1",
    titleAr: "مراجعة تقديم المرحلة 3 — توسعة رأس تنورة",
    projectId: "p1",
    type: "review",
    priority: "urgent",
    assigneeId: "khaled",
    status: "in_progress",
    dueDate: "2026-05-01",
    overdue: true,
    descriptionAr: "مراجعة المخططات التفصيلية ومصفوفة الامتثال للمرحلة الثالثة.",
    comments: [
      {
        by: "م. خالد الحربي",
        text: "بدأت المراجعة، أحتاج المخطط المحدث للأنابيب.",
        ts: "قبل ساعتين",
      },
      { by: "أرامكو السعودية", text: "سيتم رفع المخطط اليوم.", ts: "قبل ساعة" },
    ],
  },
  {
    id: "t2",
    titleAr: "جدولة تفتيش ميداني — وعد الشمال",
    projectId: "p3",
    type: "inspection",
    priority: "high",
    assigneeId: "abdullah",
    status: "new",
    dueDate: "2026-05-08",
    overdue: false,
    descriptionAr: "التنسيق مع فريق المنشأة لزيارة ميدانية لمجمع الفوسفات.",
    comments: [{ by: "م. عبدالله الدوسري", text: "بانتظار تأكيد التواريخ من المنشأة.", ts: "أمس" }],
  },
  {
    id: "t3",
    titleAr: "متابعة المستندات الإضافية — منشأة حائل",
    projectId: "p5",
    type: "followup",
    priority: "high",
    assigneeId: "fahad",
    status: "waiting",
    dueDate: "2026-05-02",
    overdue: true,
    descriptionAr: "متابعة استلام مصفوفة المخاطر المحدثة وخطة الاستجابة للطوارئ.",
    comments: [{ by: "م. فهد القحطاني", text: "تم إرسال تذكير ثاني للمنشأة.", ts: "قبل 3 ساعات" }],
  },
  {
    id: "t4",
    titleAr: "مراجعة التصميم الأولي — مجمع ينبع",
    projectId: "p7",
    type: "review",
    priority: "medium",
    assigneeId: "khaled",
    status: "in_progress",
    dueDate: "2026-05-10",
    overdue: false,
    descriptionAr: "مراجعة وثائق التصميم الأولي للمرحلة الثانية.",
    comments: [{ by: "م. خالد الحربي", text: "المراجعة بنسبة 60%.", ts: "أمس" }],
  },
  {
    id: "t5",
    titleAr: "تدقيق مصفوفة الامتثال — خط الشرقية",
    projectId: "p6",
    type: "review",
    priority: "high",
    assigneeId: "abdullah",
    status: "new",
    dueDate: "2026-05-09",
    overdue: false,
    comments: [{ by: "م. عبدالله الدوسري", text: "سأبدأ غداً.", ts: "قبل ساعة" }],
  },
  {
    id: "t6",
    titleAr: "تفتيش أنظمة الحريق — محطة القصيم",
    projectId: "p8",
    type: "inspection",
    priority: "medium",
    assigneeId: "noura",
    status: "completed",
    dueDate: "2026-04-28",
    overdue: false,
    descriptionAr: "اكتمل التفتيش ورفع التقرير النهائي.",
    comments: [{ by: "م. نورة الشمري", text: "النتيجة: مطابقة كاملة للمعايير.", ts: "قبل 4 أيام" }],
  },
  {
    id: "t7",
    titleAr: "مراجعة وثائق التشغيل — ميناء جدة",
    projectId: "p9",
    type: "review",
    priority: "high",
    assigneeId: "abdullah",
    status: "in_progress",
    dueDate: "2026-05-07",
    overdue: false,
    comments: [{ by: "م. عبدالله الدوسري", text: "أكملت 40% من المراجعة.", ts: "أمس" }],
  },
  {
    id: "t8",
    titleAr: "متابعة تصنيف المنشأة — مصنع الجبيل",
    projectId: "p2",
    type: "followup",
    priority: "medium",
    assigneeId: "fahad",
    status: "waiting",
    dueDate: "2026-05-12",
    overdue: false,
    comments: [{ by: "م. فهد القحطاني", text: "بانتظار شهادة التصنيف.", ts: "قبل يومين" }],
  },
  {
    id: "t9",
    titleAr: "إعداد تقرير الامتثال الشهري",
    projectId: "p4",
    type: "followup",
    priority: "low",
    assigneeId: "noura",
    status: "new",
    dueDate: "2026-05-15",
    overdue: false,
  },
  {
    id: "t10",
    titleAr: "مراجعة نهائية — مصفاة جازان",
    projectId: "p12",
    type: "review",
    priority: "medium",
    assigneeId: "noura",
    status: "completed",
    dueDate: "2026-04-25",
    overdue: false,
    comments: [{ by: "م. نورة الشمري", text: "تم الاعتماد النهائي.", ts: "قبل 6 أيام" }],
  },
];
