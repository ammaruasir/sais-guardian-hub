import { CheckCircle2, FileWarning, Send, MessageSquare } from "lucide-react";

const updates = [
  { icon: CheckCircle2, color: "var(--success)", text: "تم اعتماد المرحلة 2 — خط أنابيب الشرقية", time: "قبل يومين" },
  { icon: FileWarning, color: "var(--warning)", text: "مطلوب مستندات إضافية — توسعة رأس تنورة", time: "قبل 3 أيام" },
  { icon: CheckCircle2, color: "var(--success)", text: "تم اعتماد المرحلة 4 — مصفاة جازان", time: "قبل أسبوع" },
  { icon: Send, color: "var(--secondary)", text: "تم تقديم المرحلة 3 — خط أنابيب الشرقية", time: "قبل أسبوع" },
  { icon: MessageSquare, color: "var(--muted-foreground)", text: "تعليق من المراجع — ميناء جدة الجنوبي", time: "قبل أسبوعين" },
];

export function RecentUpdatesTimeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">آخر التحديثات</h2>
      <ol className="relative space-y-4 pr-4">
        <span className="absolute right-[7px] top-1 bottom-1 w-px bg-border" />
        {updates.map((u, i) => (
          <li key={i} className="relative flex gap-3">
            <span
              className="absolute right-[-5px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card ring-2"
              style={{ color: u.color, boxShadow: `inset 0 0 0 2px ${u.color}` }}
            />
            <div className="mr-4 flex-1">
              <div className="flex items-start gap-2">
                <u.icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: u.color }} />
                <div className="text-sm leading-snug">{u.text}</div>
              </div>
              <div className="mt-1 mr-6 text-[11px] text-muted-foreground">{u.time}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
