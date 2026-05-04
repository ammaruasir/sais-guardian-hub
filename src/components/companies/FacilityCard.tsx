import { Card } from "@/components/ui/card";
import { ClassificationBadge, SectorBadge } from "@/components/projects/Badges";
import { MapPin } from "lucide-react";
import type { Facility } from "@/data/facilities";

export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold">{facility.nameAr}</div>
          <div className="text-xs text-muted-foreground">{facility.nameEn}</div>
        </div>
        <ClassificationBadge c={facility.classification} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {facility.location}
        </div>
        <SectorBadge s={facility.sector} />
      </div>
    </Card>
  );
}
