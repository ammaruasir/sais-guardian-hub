import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import { permissionDefs, permissionModules } from "@/data/admin";
import { cn } from "@/lib/utils";
import { Settings as SettingsIcon } from "lucide-react";

export function PermissionsMatrix() {
  const roles = useAppStore((s) => s.roles);
  const perms = useAppStore((s) => s.permissions);
  const setPermission = useAppStore((s) => s.setPermission);

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[800px] text-sm" dir="rtl">
        <thead className="bg-muted/50">
          <tr>
            <th className="sticky end-0 bg-muted/50 px-4 py-3 text-end border-s">
              <div className="flex items-center gap-2 font-semibold">
                <SettingsIcon className="h-4 w-4" />
                الوحدة / الصلاحية
              </div>
            </th>
            {roles.map((r) => (
              <th
                key={r.key}
                className={cn(
                  "px-3 py-3 text-center font-semibold border-s last:border-s-0 min-w-[120px]",
                  r.key === "super_admin" && "bg-primary/10",
                )}
              >
                <div className="text-xs">{r.nameAr}</div>
                {r.system && <Badge variant="secondary" className="mt-1 text-[10px]">نظام</Badge>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionModules.map((mod) => (
            <PermModuleSection key={mod.name}>
              <tr className="bg-muted/30">
                <td colSpan={1 + roles.length} className="px-4 py-2 text-end">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <span className={cn("inline-block h-2.5 w-2.5 rounded-full", mod.color)} />
                    {mod.ar}
                  </div>
                </td>
              </tr>
              {permissionDefs
                .filter((p) => p.module === mod.name)
                .map((p, idx) => (
                  <tr key={p.key} className={cn(idx % 2 === 1 && "bg-muted/10")}>
                    <td className="sticky end-0 px-4 py-2 text-end border-s bg-inherit">{p.labelAr}</td>
                    {roles.map((r) => {
                      const v = perms[p.key]?.[r.key] ?? false;
                      return (
                        <td
                          key={r.key}
                          className={cn(
                            "px-3 py-2 text-center border-s last:border-s-0",
                            r.key === "super_admin" && "bg-primary/5",
                          )}
                        >
                          <div className="flex justify-center">
                            <Checkbox
                              checked={v}
                              onCheckedChange={(checked) => setPermission(p.key, r.key, !!checked)}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </PermModuleSection>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermModuleSection({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
