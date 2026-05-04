import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { ProjectsFilters, applyFilters, defaultFilters, type ProjectFilters } from "@/components/projects/ProjectsFilters";
import { projects } from "@/data";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const filtered = useMemo(() => applyFilters(projects, filters), [filters]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">المشاريع</h1>
            <p className="text-sm text-muted-foreground">إدارة ومتابعة جميع تقديمات المشاريع عبر المراحل الأربع</p>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList>
              <TabsTrigger value="kanban">كانبان</TabsTrigger>
              <TabsTrigger value="table">جدول</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ProjectsFilters value={filters} onChange={setFilters} />

        <div className="text-xs text-muted-foreground">
          يعرض <span className="num font-semibold text-foreground">{filtered.length}</span> من
          <span className="num font-semibold text-foreground"> {projects.length}</span> مشروع
        </div>

        {view === "kanban" ? <KanbanBoard projects={filtered} /> : <ProjectsTable projects={filtered} />}
      </div>
      <Toaster position="top-center" />
    </AppShell>
  );
}
