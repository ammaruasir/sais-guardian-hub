import { Link } from "@tanstack/react-router";
import { FileWarning, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { useT } from "@/hooks/useT";

export function ActionRequiredCards() {
  const requests = useAppStore((s) => s.requests);
  const { t, isAr } = useT();
  const items = requests.filter(
    (r) => r.companyId === "aramco" && r.status === "additional_docs",
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success" />
        {t("no_actions")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((r) => {
        const lastNote = r.chain[r.chain.length - 1]?.noteAr;
        return (
          <div
            key={r.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm border-e-4"
            style={{ borderInlineEndColor: "var(--warning)" }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <FileWarning className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground line-clamp-1">
                  {r.titleAr}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{r.ref}</div>
                {lastNote && (
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {isAr ? "المطلوب:" : "Required:"} {lastNote}
                  </div>
                )}
              </div>
            </div>
            <Button asChild size="sm">
              <Link to="/portal/requests/$id" params={{ id: r.id }}>
                {t("respond_attach")}
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
