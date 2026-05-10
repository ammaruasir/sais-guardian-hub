import { useMemo, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import {
  ProjectsFilters,
  applyFilters,
  defaultFilters,
  type ProjectFilters,
} from "@/components/projects/ProjectsFilters";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { useAppStore } from "@/store/appStore";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/projects/")({
  component: GuardedProjects,
});

function GuardedProjects() {
  const { role } = useRole();
  if (role !== "sais") return <Navigate to="/portal" />;
  return <ProjectsPage />;
}

function ProjectsPage() {
  const projects = useAppStore((s) => s.projects);
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const filtered = useMemo(() => applyFilters(projects, filters), [filters, projects]);
  const { t, isAr } = useT();

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("projects")}</h1>
            <p className="text-sm text-muted-foreground">
              {isAr
                ? "إدارة ومتابعة جميع تقديمات المشاريع عبر المراحل الأربع"
                : "Manage and track all project submissions across the four stages"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="ms-1 h-4 w-4" />
              {t("add_project")}
            </Button>
            <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "table")}>
              <TabsList>
                <TabsTrigger value="kanban">{isAr ? "كانبان" : "Kanban"}</TabsTrigger>
                <TabsTrigger value="table">{isAr ? "جدول" : "Table"}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <ProjectsFilters value={filters} onChange={setFilters} />

        <div className="text-xs text-muted-foreground">
          {isAr ? "يعرض" : "Showing"}{" "}
          <span className="num font-semibold text-foreground">{filtered.length}</span>{" "}
          {isAr ? "من" : "of"}{" "}
          <span className="num font-semibold text-foreground">{projects.length}</span>{" "}
          {isAr ? "مشروع" : "projects"}
        </div>

        {view === "kanban" ? (
          <KanbanBoard projects={filtered} />
        ) : (
          <ProjectsTable projects={filtered} />
        )}
      </div>
      <ProjectFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <Toaster position="top-center" />
    </AppShell>
  );
}
