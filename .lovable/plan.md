
# Phase 2 — Projects Pipeline & Submission Review

## Goal
Build `/projects` (Kanban + Table with filters), `/projects/$id` (header, stage stepper, 4 tabs), and a Submission Review slide-over. All RTL Arabic-first, using existing mock data.

## Data additions (`src/data/`)

Extend `src/data/index.ts` (or split into `submissions.ts`, `requirements.ts`, `notes.ts`):

- **Submission**: `{ id, projectId, stage, submittedAt, status, documents: {name, size, type}[], reviewedAt?, reviewerId?, decision?, comments?, checklist?: ChecklistItem[] }`
- **ChecklistItem**: `{ code: 'SEC-01'|'SAF-01'|..., labelAr, result: 'pass'|'fail'|'na' }`
- **RequirementDef**: per-stage list of directive codes + Arabic labels (Stage 1: SEC-01, RSK-01; Stage 2: SAF-01, DSG-01; Stage 3: ENG-01, INT-01; Stage 4: COM-01, OPS-01).
- **ProjectNote**: `{ id, projectId, author, ts, text }` — 2–3 seeded per project.
- **ProjectActivity**: timeline events per project (submitted, reviewed, comment, status_change).

Seed deterministically: a project at stage N has approved submissions for stages 1..N-1 and a submission matching `project.status` for stage N.

## Routes

### `src/routes/projects.tsx` — Pipeline page
- Top bar: search input + 5 selects (Sector, Stage, Status, Company, Reviewer) using shadcn `Select` + `Input`. Reset button.
- View toggle (Tabs / ToggleGroup): Kanban (default) | جدول.
- **Kanban** (`components/projects/KanbanBoard.tsx`): 4 columns by stage. Cards show nameAr, companyAr, sector badge, classification badge (tone from `classificationLabel`), reviewer initials avatar, `daysInStage`, status chip. `draggable` attribute + cursor-grab; no persistence. Click → detail.
- **Table** (`components/projects/ProjectsTable.tsx`): shadcn Table, sortable headers (local state, simple sort), columns per spec, action column with Link "فتح".

### `src/routes/projects.$id.tsx` — Detail
- Header card: nameAr / nameEn, company, facility, sector + classification badges, status chip.
- **StageStepper** component: 4 horizontal steps using `stageLabel`. `< project.stage` = green check, `=` = primary highlighted, `>` = muted.
- Tabs (shadcn): التقديمات / المتطلبات / سجل النشاط / ملاحظات داخلية.
  - **Submissions tab**: cards per submission — date, stage, document list (icons + name), status badge, "مراجعة" button → opens review Sheet.
  - **Requirements tab**: checklist for current stage; CheckCircle2 (green) for submitted, Circle (muted) for missing, with code + Arabic label.
  - **Activity tab**: vertical timeline (dot + line) of activity events.
  - **Notes tab**: list of seeded notes + Textarea + "إضافة ملاحظة" button (local state).

### Submission Review (`components/projects/SubmissionReviewSheet.tsx`)
- shadcn `Sheet` (slide-over from inline-start in RTL).
- Sections: documents list with عرض/تنزيل buttons (no-op), compliance checklist (6–8 directive rows with pass/fail/N/A toggle group), reviewer comments Textarea, previous reviews accordion if any.
- Footer: 4 decision buttons — اعتماد (green), طلب مستندات إضافية (amber), رفض (red), إعادة تعيين (gray). Click shows toast (sonner) + closes sheet.

## Wiring
- Update `OverdueTable` "فتح" button to `<Link to="/projects/$id" params={{ id }}>`.
- Update sidebar "المشاريع" link to `/projects`.
- Both new routes use `createFileRoute` + `AppShell`.

## Components to create
```
src/components/projects/
  KanbanBoard.tsx
  ProjectCard.tsx
  ProjectsTable.tsx
  ProjectsFilters.tsx
  StageStepper.tsx
  SubmissionList.tsx
  RequirementsChecklist.tsx
  ActivityTimeline.tsx
  InternalNotes.tsx
  SubmissionReviewSheet.tsx
src/data/submissions.ts
src/data/requirements.ts
src/data/notes.ts
```

## Out of scope (later phases)
Tasks, company registry, consultants, reports, company portal, notifications.

Stop after Phase 2 for review.
