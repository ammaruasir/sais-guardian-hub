import { Circle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortalRequirement } from "@/data/portalRequirements";

export function RequirementCard({ item }: { item: PortalRequirement }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4">
      <Circle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-semibold leading-snug">{item.nameAr}</div>
          <Badge variant="outline" className="bg-accent/40 text-accent-foreground border-accent num text-[10px]">
            {item.directive}
          </Badge>
          {item.required ? (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
              مطلوب
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">
              اختياري
            </Badge>
          )}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{item.nameEn}</div>
        {item.descriptionAr && (
          <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{item.descriptionAr}</div>
        )}
        <Button variant="outline" size="sm" className="mt-3 h-8 text-xs">
          <Download className="ms-1 h-3.5 w-3.5" /> تحميل النموذج
        </Button>
      </div>
    </div>
  );
}
