import { Check } from "lucide-react";
import type { Stage } from "@/data";
import { stageLabel } from "@/data";
import { cn } from "@/lib/utils";

export function StageStepper({ current }: { current: Stage }) {
  const stages: Stage[] = [1, 2, 3, 4];
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-primary bg-primary text-primary-foreground shadow-md",
                  !done && !active && "border-border bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <span className="num">{s}</span>}
              </div>
              <div className="text-center text-[11px] font-medium leading-tight md:text-xs">
                <div className={cn(active ? "text-foreground" : "text-muted-foreground")}>
                  {stageLabel[s].ar}
                </div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn("h-0.5 flex-1 rounded", s < current ? "bg-success" : "bg-border")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
