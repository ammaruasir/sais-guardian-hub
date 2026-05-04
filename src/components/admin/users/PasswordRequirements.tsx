import { Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function checkPassword(p: string) {
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p),
  };
}

export function PasswordRequirements({ password }: { password: string }) {
  const r = checkPassword(password);
  const all = r.length && r.upper && r.lower && r.number && r.special;
  const items: { ok: boolean; ar: string }[] = [
    { ok: r.length, ar: "على الأقل 8 أحرف" },
    { ok: r.upper, ar: "حرف كبير واحد على الأقل (A-Z)" },
    { ok: r.lower, ar: "حرف صغير واحد على الأقل (a-z)" },
    { ok: r.number, ar: "رقم واحد على الأقل (0-9)" },
    { ok: r.special, ar: "رمز خاص واحد على الأقل (!@#$%^&*)" },
  ];
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Shield className="h-4 w-4 text-primary" />
        متطلبات كلمة المرور
      </div>
      <ul className="space-y-1.5">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "grid h-4 w-4 place-content-center rounded-full",
                i.ok ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <Check className="h-3 w-3" />
            </span>
            <span className={cn(i.ok ? "text-foreground" : "text-muted-foreground")}>{i.ar}</span>
          </li>
        ))}
      </ul>
      {all && (
        <div className="mt-2 text-xs font-semibold text-success">
          كلمة المرور تستوفي جميع المتطلبات ✓
        </div>
      )}
    </div>
  );
}
