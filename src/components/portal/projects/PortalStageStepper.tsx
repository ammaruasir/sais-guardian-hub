import { Check } from "lucide-react";
import type { Stage } from "@/data";
import { stageLabel } from "@/data";
import { cn } from "@/lib/utils";

type StageMeta = { approvedAt?: string; subLabel?: string };

export function PortalStageStepper({
  current,
  meta,
  compact = false,
}: {
  current: Stage;
  meta?: Partial<Record<Stage, StageMeta>>;
  compact?: boolean;
}) {
  const stages: Stage[] = [1, 2, 3, 4];
  return (
    <div className="flex items-start gap-1">
      {stages.map((s, i) => {
        const done = s < current;
        const active = s === current;
        const m = meta?.[s];
        return (
          <div key={s} className="flex flex-1 items-start gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                {active && (
                  <div className="absolute inset-0 -m-1 rounded-full bg-primary/20 animate-pulse" />
                )}
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 font-bold transition-colors",
                    compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm",
                    done && "border-success bg-success text-success-foreground",
                    active && "border-primary bg-primary text-primary-foreground shadow-md",
                    !done && !active && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  ) : (
                    <span className="num">{s}</span>
                  )}
                </div>
              </div>
              <div className="text-center text-[11px] leading-tight">
                <div
                  className={cn(
                    "font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {stageLabel[s].ar}
                </div>
                {m?.approvedAt && (
                  <div className="num mt-0.5 text-[10px] text-success">{m.approvedAt}</div>
                )}
                {m?.subLabel && !m?.approvedAt && (
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{m.subLabel}</div>
                )}
              </div>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded",
                  s < current ? "bg-success" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
