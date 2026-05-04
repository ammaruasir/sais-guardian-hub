import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyRound, Pencil, Trash2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/admin";

export function RoleCard({
  role,
  highlight,
  onEdit,
  onDelete,
  onShowPermissions,
}: {
  role: Role;
  highlight?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onShowPermissions: () => void;
}) {
  return (
    <Card
      className={cn("p-5 flex flex-col gap-3", highlight && "border-primary border-2 shadow-md")}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-full bg-primary/15 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold">{role.nameAr}</div>
            <code className="text-xs text-muted-foreground font-mono">{role.key}</code>
          </div>
        </div>
        {role.system && <Badge variant="secondary">نظام</Badge>}
      </div>
      <p className="text-sm text-muted-foreground flex-1">{role.description}</p>
      <div className="flex items-center justify-between border-t pt-3">
        <Button size="sm" variant="outline" onClick={onShowPermissions} className="gap-2">
          <KeyRound className="h-4 w-4" />
          الصلاحيات
        </Button>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          {!role.system && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
