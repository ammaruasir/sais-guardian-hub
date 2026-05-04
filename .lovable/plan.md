# SAIS Industrial Security Platform — Phased POC

A bilingual (Arabic-first, RTL) pitch-grade demo for SAIS covering a SAIS Hub (regulator) and Company Portal (operators), toggled via a top-bar role switcher. All data is mock/static. Built phase-by-phase — I will stop after each phase for your review.

## Design System

- **Language**: Arabic primary (RTL via `dir="rtl"`), English secondary labels where useful
- **Fonts**: IBM Plex Sans Arabic (Arabic) + Inter (Latin), loaded from Google Fonts
- **Palette** (mapped to semantic Tailwind tokens in `src/styles.css`):
  - Primary navy `#1B3A5C`, Secondary teal `#0E918C`
  - Success Saudi green `#006C35`, Warning `#D4A017`, Danger `#C0392B`
  - Background `#F5F6FA`, Card white, Text `#1A1A2E` / muted `#6B7280`
  - Rounded 12px cards, subtle shadow, government-grade restraint
- **Components**: shadcn/ui (already present), Lucide icons, Recharts for charts
- **Layout**: Right-side collapsible sidebar (RTL), top bar with role switcher + bell + avatar + breadcrumbs

## Phase Plan (I will STOP after each)

### Phase 1 — Foundation & SAIS Dashboard
- Configure RTL globally in `__root.tsx`, load Arabic + Latin fonts, extend theme tokens in `src/styles.css`
- Create `RoleContext` (`sais` | `company`) with persisted toggle
- Build `AppShell`: right-side `Sidebar` (shadcn) that swaps nav items based on role, top bar with role switcher pill (مركز الهيئة | بوابة المنشآت), notifications bell w/ badge, avatar dropdown, breadcrumbs
- Seed data files in `src/data/` (companies, facilities, projects, reviewers, submissions, tasks, consultants, notifications, directives, activity)
- SAIS Dashboard route `/`: KPI cards row, Projects-by-Stage bar, Projects-by-Sector donut, Recent Activity feed, Overdue Reviews table

### Phase 2 — SAIS Projects Pipeline & Submission Review
- `/projects` with Kanban ↔ Table toggle, filters, draggable cards (dnd-kit)
- `/projects/$projectId` detail: 4-stage stepper, tabs (Submissions / Requirements / Activity / Notes)
- Submission Review panel: docs list, directive-tied compliance checklist, comments, decision actions (Approve / Request Docs / Reject / Reassign)

### Phase 3 — Tasks, Companies & Consultants (SAIS)
- `/tasks` Kanban + My Tasks view + task detail modal (8–10 seeded tasks)
- `/companies` table + `/companies/$id` detail (facilities, projects, compliance meter, consultant)
- `/consultants` registry table

### Phase 4 — Company Portal: Dashboard & Requirements Explorer
- Sidebar swaps; header shows company (default Aramco)
- `/portal` dashboard: action-required cards, project summaries, updates timeline, compliance gauge
- `/portal/requirements` 3-step explorer (sector → project type → expandable stage requirement trees with directive refs and mock template downloads)

### Phase 5 — Company Portal: Projects & Submission Wizard
- `/portal/projects` + project detail with prominent stage stepper, current-stage checklist, upload slots, submission history, SAIS message thread
- `/portal/submissions/new` 5-step wizard ending with reference number confirmation

### Phase 6 — Notifications, Reports & Polish
- `/notifications` shared inbox with unread state, bell wiring
- `/reports` (SAIS only): 4 Recharts visuals + date range filter
- Loading skeletons, empty states, hover/transitions, RTL audit, role-switch animation
- Optional floating "عرض تجريبي" demo walkthrough

## Technical Notes

- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn/ui + Recharts + Lucide + dnd-kit (Phase 2)
- Routing: file-based under `src/routes/`; each major section is its own route file (no hash anchors)
- Role state: lightweight React Context in a client provider mounted in `__root.tsx`
- Data: typed mock constants in `src/data/*.ts`, shared by both portals so the story stays consistent
- No backend / no Lovable Cloud needed for the POC

## Phase 1 Deliverables (what you'll see first)

```text
src/
  styles.css                 # tokens + fonts + RTL base
  routes/__root.tsx          # <html dir="rtl">, providers, shell
  routes/index.tsx           # SAIS dashboard
  components/
    layout/AppShell.tsx
    layout/AppSidebar.tsx
    layout/TopBar.tsx
    layout/RoleSwitcher.tsx
    dashboard/KpiCards.tsx
    dashboard/StagePipeline.tsx
    dashboard/SectorDonut.tsx
    dashboard/ActivityFeed.tsx
    dashboard/OverdueTable.tsx
  context/RoleContext.tsx
  data/{companies,facilities,projects,reviewers,submissions,tasks,
        consultants,notifications,directives,activity}.ts
```

After Phase 1 I'll pause and wait for your go-ahead before starting Phase 2.
