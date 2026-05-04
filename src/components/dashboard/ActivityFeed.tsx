import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileUp, AlertCircle, XCircle, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const iconMap = {
  approved: { Icon: CheckCircle2, tone: "bg-success/10 text-success" },
  submitted: { Icon: FileUp, tone: "bg-secondary/10 text-secondary" },
  requested: { Icon: AlertCircle, tone: "bg-warning/15 text-warning" },
  rejected: { Icon: XCircle, tone: "bg-destructive/10 text-destructive" },
  comment: { Icon: MessageSquare, tone: "bg-muted text-muted-foreground" },
} as const;

export function ActivityFeed() {
  const activity = useAppStore((s) => s.activity);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">آخر الأنشطة</CardTitle>
        <p className="text-xs text-muted-foreground">Recent Activity</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activity.map((a) => {
            const { Icon, tone } = iconMap[a.type];
            return (
              <li key={a.id} className="flex gap-3">
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", tone)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground">
                    <span className="font-semibold">{a.who}</span> {a.ar}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.ts}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
