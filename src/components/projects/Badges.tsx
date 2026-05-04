import { Badge } from "@/components/ui/badge";
import { classificationLabel, sectorLabel, statusLabel, type Classification, type ProjectStatus, type Sector } from "@/data";

export function ClassificationBadge({ c }: { c: Classification }) {
  const tone = classificationLabel[c].tone;
  const cls =
    tone === "destructive"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : tone === "warning"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : tone === "secondary"
          ? "bg-secondary/15 text-secondary border-secondary/30"
          : "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={cls}>{classificationLabel[c].ar}</Badge>;
}

export function SectorBadge({ s }: { s: Sector }) {
  return <Badge variant="outline" className="bg-accent/40 text-accent-foreground border-accent">{sectorLabel[s].ar}</Badge>;
}

export function StatusChip({ s }: { s: ProjectStatus }) {
  const tone = statusLabel[s].tone;
  const cls =
    tone === "success"
      ? "bg-success/15 text-success border-success/30"
      : tone === "warning"
        ? "bg-warning/20 text-warning-foreground border-warning/30"
        : tone === "destructive"
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : tone === "secondary"
            ? "bg-secondary/15 text-secondary border-secondary/30"
            : "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={cls}>{statusLabel[s].ar}</Badge>;
}
