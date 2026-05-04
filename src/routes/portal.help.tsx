import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/help")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">المساعدة</h1>
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 text-center">
        <div className="text-lg font-semibold">قريباً</div>
        <p className="max-w-md text-sm text-muted-foreground">مركز المساعدة قادم في المرحلة 5.</p>
      </div>
    </div>
  ),
});
