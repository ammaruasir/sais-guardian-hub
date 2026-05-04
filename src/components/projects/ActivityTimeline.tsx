import { CheckCircle2, FileUp, MessageCircle, AlertTriangle, XCircle, UserCog } from "lucide-react";
import type { ProjectActivity } from "@/data/notes";

const map: Record<ProjectActivity["type"], { Icon: any; cls: string }> = {
  approved: { Icon: CheckCircle2, cls: "bg-success/15 text-success" },
  submitted: { Icon: FileUp, cls: "bg-secondary/15 text-secondary" },
  comment: { Icon: MessageCircle, cls: "bg-muted text-muted-foreground" },
  requested: { Icon: AlertTriangle, cls: "bg-warning/20 text-warning-foreground" },
  rejected: { Icon: XCircle, cls: "bg-destructive/10 text-destructive" },
  assigned: { Icon: UserCog, cls: "bg-primary/10 text-primary" },
};

export function ActivityTimeline({ items }: { items: ProjectActivity[] }) {
  return (
    <ol className="relative space-y-4 border-r-2 border-border pr-6">
      {items.map((a) => {
        const { Icon, cls } = map[a.type];
        return (
          <li key={a.id} className="relative">
            <span className={`absolute -right-[34px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${cls}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{a.ar}</span>
                <span className="num text-[11px] text-muted-foreground">{a.ts}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.who}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
