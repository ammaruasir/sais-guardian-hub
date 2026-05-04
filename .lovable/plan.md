
# Phase 3 — Tasks, Companies Registry, Approved Consultants

## Goal
Add three SAIS hub sections: `/tasks` (Kanban with quick-add + detail modal), `/companies` (+ `/companies/$id`), `/consultants`. All RTL Arabic-first, reusing existing badge/sector/classification helpers and shadcn primitives.

## Data additions (`src/data/`)

**`tasks.ts`** — `Task` type per spec + 10 seeded tasks (linked to existing `projectId`s p1–p10 and reviewers khaled/abdullah/fahad/noura). Each task gets 1–2 seeded comments. Export `currentUserId = "khaled"` for the "مهامي" filter.

**`facilities.ts`** — `Facility` type per spec + 9 seeded facilities distributed across the 5 existing companies, matching `facilitiesCount`. Reuse existing `Classification` and `Sector` types from `data/index.ts`.

**`consultants.ts`** — `Consultant` type per spec + 5 seeded firms exactly as specified. Add a `complianceScore` (0–100) and `assignedConsultantId` per company in `data/index.ts` (or a small map in `companies.ts`) so the company detail page can show score + SAIS-assigned consultant.

## Routes

### `src/routes/tasks.tsx`
- Header: title + "مهامي" toggle (shadcn `Switch`/`ToggleGroup`) defaulting off; when on, filter to `assigneeId === currentUserId`. "إضافة مهمة +" button opens `NewTaskDialog`.
- `TaskBoard.tsx`: 4 columns by status (`new`/`in_progress`/`waiting`/`completed`) with Arabic headers and counts.
- `TaskCard.tsx`: title, project link (→ `/projects/$id`), priority badge (red/orange/blue/gray), type icon (`FileSearch`/`ClipboardCheck`/`MessageSquare`), assignee initials avatar + name, due date with red text + AlertCircle when `overdue`. Click → `TaskDetailSheet`.
- `NewTaskDialog.tsx`: shadcn `Dialog` with Input/Select/Select/Select/Select/date Input/Textarea fields. Submit → toast + close; no persistence.
- `TaskDetailSheet.tsx`: shadcn `Sheet` showing description, project link, status `Select`, assignee `Select`, due date, comments thread + "إضافة تعليق" textarea (local state append).

### `src/routes/companies.tsx`
- Search Input + sector `Select` filter.
- shadcn `Table`: اسم المنشأة, القطاع (sector badge), المنشآت (facilities count), المشاريع النشطة (computed from projects where status ≠ approved/rejected), حالة الامتثال (compliance badge derived from score: ≥75 ممتثل green, 50–74 قيد المراجعة amber, <50 غير ممتثل red).
- Row click → `<Link to="/companies/$id">`.

### `src/routes/companies.$id.tsx`
- Header card: nameAr / nameEn, sector + compliance badges.
- `ComplianceGauge.tsx`: circular SVG progress (single arc, percentage in center, color matches compliance band).
- Facilities grid: cards with name, classification badge (using existing `classificationLabel` tone helpers), location, sector badge.
- Active Projects section: filtered projects → reuse `ProjectCard` (or compact variant) with mini stage indicator, linked to `/projects/$id`.
- SAIS-assigned consultant: small card with consultant name + license number (lookup via `assignedConsultantId`).

### `src/routes/consultants.tsx`
- Search Input + specialization `Select` + status `Select` filters.
- Table: اسم الشركة (Ar + En stacked), رقم الترخيص, التخصص (badges: أمن / سلامة وحريق / الكل), المشاريع النشطة, انتهاء الترخيص, الحالة (active green / expired red / pending_renewal amber).
- Row click → `ConsultantDetailDialog` showing phone, email, license details, and a list of project names this consultant is assigned to (mock by matching `assignedConsultantId`).

## Components to create
```
src/components/tasks/
  TaskBoard.tsx
  TaskCard.tsx
  NewTaskDialog.tsx
  TaskDetailSheet.tsx
src/components/companies/
  CompaniesTable.tsx
  ComplianceGauge.tsx
  FacilityCard.tsx
src/components/consultants/
  ConsultantsTable.tsx
  ConsultantDetailDialog.tsx
src/data/tasks.ts
src/data/facilities.ts
src/data/consultants.ts
```

## Wiring
- Sidebar links `/tasks`, `/companies`, `/consultants` already exist — new file routes will register via `createFileRoute` and the auto-generated route tree.
- All pages render inside `AppShell` consistent with existing routes.

## Out of scope (later phases)
Reports, Notifications, Company Portal (Phases 4–6). No persistence — all mutations are local state + toasts.

Stop after Phase 3 for review.
