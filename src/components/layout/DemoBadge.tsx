import { Sparkles } from "lucide-react";
import { useT } from "@/hooks/useT";

export function DemoBadge() {
  const { t } = useT();
  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-50">
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-secondary" />
        <span>{t("poc_demo")}</span>
      </div>
    </div>
  );
}
