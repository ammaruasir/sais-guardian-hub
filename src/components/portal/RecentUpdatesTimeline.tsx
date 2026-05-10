import { Link } from "@tanstack/react-router";
import { CheckCircle2, FileWarning, Send, MessageSquare, XCircle } from "lucide-react";
import { useAppStore } from "@/store/appStore";

const iconMap = {
  approved: { Icon: CheckCircle2, color: "var(--success)" },
  submitted: { Icon: Send, color: "var(--secondary)" },
  requested: { Icon: FileWarning, color: "var(--warning)" },
  rejected: { Icon: XCircle, color: "var(--destructive)" },
  comment: { Icon: MessageSquare, color: "var(--muted-foreground)" },
} as const;

export function RecentUpdatesTimeline() {
  const activity = useAppStore((s) => s.activity);
  const requests = useAppStore((s) => s.requests);
  const updates = activity.slice(0, 5);
  const aramcoFirstReqId = requests.find((r) => r.companyId === "aramco")?.id;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">آخر التحديثات</h2>
      <ol className="relative space-y-4 pe-4">
        <span className="absolute end-[7px] top-1 bottom-1 w-px bg-border" />
        {updates.map((u) => {
          const m = iconMap[u.type];
          return (
            <li key={u.id} className="relative flex gap-3">
              <span
                className="absolute end-[-5px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card ring-2"
                style={{ color: m.color, boxShadow: `inset 0 0 0 2px ${m.color}` }}
              />
              <div className="me-4 flex-1">
                {aramcoFirstReqId ? (
                  <Link
                    to="/portal/requests/$id"
                    params={{ id: aramcoFirstReqId }}
                    className="block hover:opacity-80"
                  >
                    <div className="flex items-start gap-2">
                      <m.Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: m.color }} />
                      <div className="text-sm leading-snug">{u.ar}</div>
                    </div>
                    <div className="mt-1 me-6 text-[11px] text-muted-foreground">{u.ts}</div>
                  </Link>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <m.Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: m.color }} />
                      <div className="text-sm leading-snug">{u.ar}</div>
                    </div>
                    <div className="mt-1 me-6 text-[11px] text-muted-foreground">{u.ts}</div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
