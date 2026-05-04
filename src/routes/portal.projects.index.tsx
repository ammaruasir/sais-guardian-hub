import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { PortalProjectCard } from "@/components/portal/projects/PortalProjectCard";
import { Button } from "@/components/ui/button";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { Toaster } from "@/components/ui/sonner";
import { useRole } from "@/context/RoleContext";

export const Route = createFileRoute("/portal/projects/")({
  component: PortalProjectsPage,
});

function PortalProjectsPage() {
  const { currentUser } = useRole();
  const companyId = currentUser.companyId ?? "aramco";
  const projects = useAppStore((s) => s.projects);
  const mine = projects.filter((p) => p.companyId === companyId);
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مشاريعنا</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            جميع المشاريع المسجلة لدى الهيئة العليا للأمن الصناعي
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="ms-1 h-4 w-4" />
          مشروع جديد
        </Button>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {mine.map((p) => (
          <PortalProjectCard key={p.id} p={p} />
        ))}
      </div>
      <ProjectFormDialog open={open} onOpenChange={setOpen} defaultCompanyId={companyId} />
      <Toaster position="top-center" />
    </div>
  );
}
