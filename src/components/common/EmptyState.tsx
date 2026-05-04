import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  message,
  hint,
  className = "",
}: {
  icon?: LucideIcon;
  message: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/60 py-10 text-center text-muted-foreground ${className}`}>
      <Icon className="h-8 w-8 opacity-60" />
      <div className="text-sm font-medium text-foreground">{message}</div>
      {hint && <div className="text-xs">{hint}</div>}
    </div>
  );
}
