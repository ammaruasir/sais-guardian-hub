import { projects } from "./index";

export type ProjectNote = { id: string; projectId: string; author: string; ts: string; text: string };
export type ProjectActivity = {
  id: string;
  projectId: string;
  ts: string;
  who: string;
  ar: string;
  type: "submitted" | "approved" | "requested" | "rejected" | "comment" | "assigned";
};

const seedNotes = [
  "المنشأة تتعاون بشكل جيد مع المراجعين.",
  "يُنصح بمتابعة التحديثات على تقرير المخاطر أسبوعياً.",
  "تم التنسيق مع فريق التفتيش لزيارة ميدانية الشهر القادم.",
];

export const notes: ProjectNote[] = projects.flatMap((p, i) => [
  {
    id: `${p.id}-n1`,
    projectId: p.id,
    author: "م. نورة الشمري",
    ts: "قبل يومين",
    text: seedNotes[i % seedNotes.length],
  },
  {
    id: `${p.id}-n2`,
    projectId: p.id,
    author: "م. خالد الحربي",
    ts: "قبل 5 أيام",
    text: "تمت مراجعة المرحلة السابقة بشكل سلس دون ملاحظات جوهرية.",
  },
]);

export const activities: ProjectActivity[] = projects.flatMap((p) => {
  const list: ProjectActivity[] = [];
  for (let s = 1; s < p.stage; s++) {
    list.push({
      id: `${p.id}-a-sub-${s}`,
      projectId: p.id,
      ts: `2026-0${Math.max(1, 4 - (p.stage - s))}-${10 + s * 2}`,
      who: "ممثل المنشأة",
      ar: `تقديم المرحلة ${s}`,
      type: "submitted",
    });
    list.push({
      id: `${p.id}-a-app-${s}`,
      projectId: p.id,
      ts: `2026-0${Math.max(1, 4 - (p.stage - s))}-${12 + s * 2}`,
      who: "م. خالد الحربي",
      ar: `اعتماد المرحلة ${s}`,
      type: "approved",
    });
  }
  list.push({
    id: `${p.id}-a-cur`,
    projectId: p.id,
    ts: p.submittedAt,
    who: "ممثل المنشأة",
    ar: `تقديم المرحلة ${p.stage}`,
    type: "submitted",
  });
  if (p.status === "additional_docs") {
    list.push({
      id: `${p.id}-a-req`,
      projectId: p.id,
      ts: "قبل ساعة",
      who: "م. فهد القحطاني",
      ar: "طلب مستندات إضافية",
      type: "requested",
    });
  }
  return list;
});

export function getNotesByProject(id: string) {
  return notes.filter((n) => n.projectId === id);
}
export function getActivitiesByProject(id: string) {
  return activities.filter((a) => a.projectId === id);
}
