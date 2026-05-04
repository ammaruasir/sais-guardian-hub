# Fix: Stale Static Imports + RTL Logical Properties

Two-part wiring/styling fix. No new features.

## Part 1 — Switch to Zustand store (9 files)

For each file, remove static imports of `projects`/`companies`/`consultants`/`submissions` from `@/data` and read from `useAppStore`. Keep `reviewers` (read-only seed), label maps, and type imports as static imports.

1. `src/routes/portal.projects.tsx` — `useAppStore(s => s.projects)` then filter by `companyId === "aramco"`.
2. `src/routes/portal.projects.$id.tsx` — pull `projects`, `companies`, `submissions` from store. Replace `getSubmissionsByProject(id)` with `submissions.filter(s => s.projectId === id)`.
3. `src/routes/companies.$id.tsx` — pull `companies`, `projects`, `consultants` from store.
4. `src/routes/projects.$id.tsx` — replace `getSubmissionsByProject` with store-derived `submissions.filter(...)`.
5. `src/components/projects/ProjectsTable.tsx` — `companies` from store; keep `reviewers`.
6. `src/components/projects/ProjectsFilters.tsx` — `companies` from store; keep `reviewers`.
7. `src/components/projects/ProjectCard.tsx` — `companies` from store; keep `reviewers`.
8. `src/components/tasks/TaskCard.tsx` — `projects` from store; keep `reviewers`.
9. `src/components/consultants/ConsultantDetailDialog.tsx` — `projects`, `companies` from store.

## Part 2 — RTL logical property conversions

Apply the following table across `src/components/**` (excluding `src/components/ui/`) and `src/routes/**`:

```text
ml-*       -> ms-*        mr-*       -> me-*
ml-auto    -> ms-auto     mr-auto    -> me-auto
pl-*       -> ps-*        pr-*       -> pe-*
left-*     -> start-*     right-*    -> end-*
-left-*    -> -start-*    -right-*   -> -end-*
border-l*  -> border-s*   border-r*  -> border-e*
rounded-l* -> rounded-s*  rounded-r* -> rounded-e*
```

Do NOT change:
- Anything under `src/components/ui/`
- `text-right` / `text-left`
- Icon component names (`ChevronRight`, `ArrowLeft`, etc.)
- `top-*` / `bottom-*`

Targeted files (per spec): `TopBar.tsx`, `DemoBadge.tsx`, `ActivityTimeline.tsx`, `SubmissionReviewSheet.tsx`, `ProjectsFilters.tsx`, `UserFormDialog.tsx`, `UsersTable.tsx`, `PermissionsMatrix.tsx`, `ConversationThread.tsx`, all portal wizard buttons, `portal.submissions.new.tsx`, `admin.settings.tsx`, `admin.audit.tsx`, `companies.tsx`, `projects.tsx`, `projects.$id.tsx`, `consultants.tsx`, `NotificationsList.tsx`, `OverdueTable.tsx`.

Approach: ripgrep each file for the physical class tokens listed above and rewrite occurrences via `code--line_replace`. After edits, re-grep the project (excluding `src/components/ui/`) for residual `\b(ml|mr|pl|pr)-`, `\b(left|right)-`, `border-[lr]\b`, `rounded-[lr]-` to confirm zero remaining instances outside the allowed exclusions.

## Verification

- Demo badge bottom-left visually; settings save button bottom-left visually.
- Search inputs: icon on right side, padding reserves right space.
- Activity timeline: vertical border on the right, dots on the right edge.
- Button icons sit on the correct side of Arabic labels.
- Notification badge sits on the top-end corner of the bell.
- CRUD on projects/companies/consultants reflects immediately in lists and detail pages (Part 1 wiring).
- Role switcher + navigation across all pages: no layout regressions, no console errors.
