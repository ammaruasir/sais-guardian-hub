import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { portalStages } from "@/data/portalRequirements";
import { RequirementCard } from "./RequirementCard";

export function RequirementsTree() {
  return (
    <Accordion type="multiple" defaultValue={["stage-1"]} className="space-y-3">
      {portalStages.map((s) => (
        <AccordionItem
          key={s.stage}
          value={`stage-${s.stage}`}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex w-full items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold num">
                {s.stage}
              </div>
              <div className="flex-1 text-right">
                <div className="text-base font-semibold">المرحلة {s.stage}: {s.titleAr}</div>
                <div className="text-xs text-muted-foreground">{s.titleEn}</div>
              </div>
              <div className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground num">
                {s.items.length} متطلبات
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid gap-3 md:grid-cols-2">
              {s.items.map((it) => (
                <RequirementCard key={it.id} item={it} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
