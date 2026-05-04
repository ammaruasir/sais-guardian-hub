import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, Clock } from "lucide-react";
import type { Project } from "@/data";
import { companies, reviewers } from "@/data";
import { ClassificationBadge, SectorBadge, StatusChip } from "./Badges";

export function ProjectCard({ p }: { p: Project }) {
  const company = companies.find((c) => c.id === p.companyId);
  const reviewer = reviewers.find((r) => r.id === p.reviewerId);
  return (
    <Link
      to="/projects/$id"
      params={{ id: p.id }}
      draggable
      className="group block"
    >
      <Card className="cursor-grab gap-2 p-3 transition-all hover:shadow-md active:cursor-grabbing">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-semibold leading-tight">{p.nameAr}</h4>
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="text-xs text-muted-foreground">{company?.nameAr}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <SectorBadge s={p.sector} />
          <ClassificationBadge c={p.classification} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <StatusChip s={p.status} />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="num">{p.daysInStage}</span> ي
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-border/60 pt-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">{reviewer?.initials}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{reviewer?.nameAr}</span>
        </div>
      </Card>
    </Link>
  );
}
