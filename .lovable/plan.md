## Fixes

### 1. Project detail page not rendering
`src/routes/projects.tsx` is treated as the parent of `projects.$id` because of the shared prefix, but it doesn't render `<Outlet />`. Same problem with `portal.projects.tsx` vs `portal.projects.$id.tsx`.

**Fix:** Rename to index routes so they become siblings instead of parents:
- `src/routes/projects.tsx` → `src/routes/projects.index.tsx` (update `createFileRoute("/projects")` → `"/projects/"`)
- `src/routes/portal.projects.tsx` → `src/routes/portal.projects.index.tsx` (update path similarly)

### 2. Company portal can't create new projects
Add a "مشروع جديد" button on `/portal/projects` that opens the existing `ProjectFormDialog`, with the company locked to the current user's company.

- Extend `ProjectFormDialog` with optional `defaultCompanyId` prop, used to pre-fill `form.companyId` (both in initial state and the `useEffect` reset for new projects).
- In `portal.projects.index.tsx`, derive `companyId` from `useRole().currentUser.companyId ?? "aramco"`, filter projects by it, render the New Project button + dialog (passing `defaultCompanyId`).

No other files need changes; the kanban/table "Open" links already use the correct typed `<Link to="/projects/$id" params={{ id: p.id }}>` pattern.