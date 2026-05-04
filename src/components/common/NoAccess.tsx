import { ShieldAlert } from "lucide-react";

export function NoAccess({ message = "ليس لديك صلاحية الوصول" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/30 p-10 text-center">
      <ShieldAlert className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
