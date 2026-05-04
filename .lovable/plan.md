# Sub-Phase 7C — Final Polish & Wiring

This is the final sub-phase. Three pillars: **(1) Audit Log page**, **(2) Drag-and-Drop boards**, **(3) CRUD for remaining entities + full platform polish audit**.

---

## 1. Security Audit Log Page (`/admin/audit`)

**File:** replace `src/routes/admin.audit.tsx` placeholder.

- Header `الأحداث الأمنية` (shield-alert icon) + subtitle + `تحديث` button (forces local re-render via state bump).
- **4 KPI cards** computed from `useAppStore(s => s.audit)`:
  - Total / Critical (`level==='critical'`) / Warnings (`level==='warning'`) / Info (`level==='info'`).
- **Collapsible guide card** `دليل الأحداث الأمنية والمستويات` (Collapsible from shadcn) explaining the 3 levels.
- **Filter bar:** search input + 3 Selects (User / Type / Level). All actively filter the table.
- **Table** (RTL) with the 7 columns specified (User, Event, Description, Page, Level, Time, Actions). Level badges: info=teal, warning=amber, critical=red. Delete action with `ConfirmDialog` → `store.deleteAuditEntry(id)`.
- **Pagination:** 15 per page with prev/next + counter `عرض X-Y من Z`.
- **Seed data:** extend `appStore.ts` initial `audit` array with the 15 listed entries (only seed if empty on first persisted load — handled in store initializer).
- New store actions: `deleteAuditEntry(id)`, ensure existing `logActivity` continues feeding this list.

---

## 2. Drag-and-Drop for Boards

Native HTML5 DnD (no new dependency).

**`src/components/tasks/TaskBoard.tsx`:**
- Each `TaskCard` wrapper: `draggable`, `onDragStart` sets `dataTransfer` taskId + dims opacity to 0.5 via local state.
- Each column: `onDragOver={e=>e.preventDefault()}`, `onDragEnter` toggles `border-primary border-dashed` highlight, `onDrop` calls `store.updateTaskStatus(taskId, columnStatus)` and logs activity.

**`src/components/projects/KanbanBoard.tsx`:**
- Same pattern. `onDrop` → `store.updateProjectStatus(projectId, 'under_review', targetStage)`.
- Reset `daysInStage` already handled inside the action.

---

## 3. CRUD for Remaining Entities

### Projects (`/projects`)
- `+ إضافة مشروع` button → new `ProjectFormDialog.tsx` with fields: nameAr, nameEn, companyId (Select from store.companies), facilityAr, sector, classification, reviewerId (Select from store.users where role contains reviewer). Defaults stage=1, status=`awaiting_submission`.
- Project detail header: `تعديل` (pre-filled dialog) and `حذف` (ConfirmDialog → `store.deleteProject` → navigate `/projects`).
- Store: add `addProject`, `updateProject`, `deleteProject`.

### Companies (`/companies`)
- `+ إضافة منشأة` button → `CompanyFormDialog.tsx` (nameAr, nameEn, sector, facilitiesCount, compliance).
- Edit on detail page; Delete from list with confirm.
- Store: `addCompany`, `updateCompany`, `deleteCompany`.

### Consultants (`/consultants`)
- `+ إضافة استشاري` button → `ConsultantFormDialog.tsx` (nameAr, nameEn, licenseNo, specializations checkboxes, licenseExpiry date, status, phone, email).
- Edit/delete from detail dialog.
- Store: `addConsultant`, `updateConsultant`, `deleteConsultant`.

### Notifications (`/notifications` and `/portal/notifications`)
- Row click → `markAsRead(id)` (blue dot disappears).
- Top button `تحديد الكل كمقروء` → `markAllAsRead(role)`.
- X button per row → `deleteNotification(id)` (no confirm, instant).
- Filter tabs (`الكل / غير مقروءة / اعتمادات / طلبات / مواعيد`) actually filter by `read` flag and `type`.
- Store: `markAsRead`, `markAllAsRead`, `deleteNotification`.

---

## 4. Full Platform Polish Audit

Pass through every page; fix in-place:

**Navigation/Routing**
- Verify all sidebar `<Link>`s in both `AppSidebar` portals resolve. Confirm `activeProps` highlights correctly. Add 150ms fade transition wrapper on portal switch in `AppShell.tsx` (CSS `transition-opacity`).
- Ensure breadcrumbs are clickable per-segment (audit `Breadcrumb` usage on each route).

**Interactive Elements**
- Hook every previously-static button to either nav, dialog, or `toast.success`.
- Make rows on `/companies` and `/consultants` clickable (cursor-pointer + onClick).
- All deletes routed through `ConfirmDialog`. All success paths emit `sonner` toast.

**Visual Consistency**
- Centralize status badge mapping in `src/lib/statusBadge.ts` (approved=green, under_review=secondary, additional_docs=amber, rejected=red, awaiting=gray, pending_final=amber). Replace ad-hoc usages across project/submission components.
- Ensure RTL alignment + LTR numerals (already via Tailwind `dir`).

**Empty states**
- Add empty state blocks (icon + message) to: KanbanBoard columns, NotificationsList, search-filtered tables, submissions tab. Reusable `<EmptyState icon message />` in `src/components/common/EmptyState.tsx`.

**Loading polish**
- Add `Skeleton` shimmer to KPI cards via 200ms artificial mount delay in dashboard.
- 150ms cross-fade on role switch.

**Reports page**
- Wire date-range Select to `useState`; on change, multiply the hardcoded chart datasets by a deterministic factor (±10-15% based on range key) so visuals shift.
- Verify all 4 charts have Arabic labels.

**Demo Badge**
- Verify `DemoBadge.tsx` is mounted in `AppShell` with `fixed bottom-4 right-4 opacity-70 pointer-events-none`.

---

## 5. End-to-End Workflow Verification

After implementation, walk through and document pass/fail for:
1. **Submission → Approval cycle** (Portal wizard → SAIS review → KPI/Kanban update → Portal sees approval).
2. **Task drag-and-drop** persistence across navigation.
3. **Admin CRUD → Audit log** (add/edit/delete user surfaces 3 audit entries).

---

## Files to Create

- `src/components/common/EmptyState.tsx`
- `src/components/projects/ProjectFormDialog.tsx`
- `src/components/companies/CompanyFormDialog.tsx`
- `src/components/consultants/ConsultantFormDialog.tsx`
- `src/lib/statusBadge.ts`

## Files to Modify

- `src/routes/admin.audit.tsx` (full implementation)
- `src/store/appStore.ts` (seed audit, add CRUD actions for projects/companies/consultants, notification actions, audit delete)
- `src/components/tasks/TaskBoard.tsx`, `src/components/projects/KanbanBoard.tsx` (DnD)
- `src/routes/projects.tsx`, `src/routes/companies.tsx`, `src/routes/consultants.tsx` (+ detail routes/dialogs) — add buttons & wiring
- `src/components/notifications/NotificationsList.tsx` (mark-read, delete, filter tabs)
- `src/components/layout/AppShell.tsx` (fade transition, ensure DemoBadge)
- `src/components/dashboard/KpiCards.tsx` (skeleton shimmer)
- `src/routes/reports.tsx` (date-range reactivity)
- Replace ad-hoc status badges with `statusBadge.ts` helper across project/submission components.

After implementation I'll report which of the 3 workflows pass end-to-end.
