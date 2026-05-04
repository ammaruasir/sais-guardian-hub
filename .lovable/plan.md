# Phase 7 — Admin Panel, User Management, Security & NCA Compliance

Implemented in **3 sub-phases**, stopping after each for review. Underpinning all of it is a single **Zustand store** that turns existing read-only mock data into mutable, app-wide reactive state so every CRUD action ripples instantly across SAIS and Company portals.

---

## Foundation (added at start of 7A, used by all sub-phases)

**`src/store/appStore.ts`** — Zustand store seeding from existing `src/data/*` modules and exposing CRUD actions for: projects, submissions, tasks, companies, consultants, facilities, notifications, conversations, users, roles, permissions matrix, settings, and audit events. Persisted to `localStorage` so the demo survives reloads but resettable via a debug "reset demo" action.

Existing data files stay as the seed source. Components that currently import arrays directly from `src/data/*` are migrated to `useAppStore(s => s.projects)` etc. so changes propagate.

**Toast system** — already have `sonner` Toaster mounted; add a tiny `src/lib/toast.ts` wrapper exposing `toast.success/info/error` with the standard Arabic strings.

**Confirm dialog** — small reusable `<ConfirmDialog>` (shadcn AlertDialog) for all destructive actions.

---

## SUB-PHASE 7A — User Management + Roles & Permissions

### Sidebar
Update `AppSidebar.tsx`: add a second `SidebarGroup` (only when `role === "sais"`) labelled **الإدارة** with items:
- المستخدمون → `/admin/users`
- الصلاحيات والأدوار → `/admin/roles`
- الأحداث الأمنية → `/admin/audit`
- الإعدادات → `/admin/settings`

Use `Users`, `Shield`, `ShieldAlert`, `Settings` icons. Group label uses existing muted style.

### Data
`src/data/admin.ts` — seeds for users (10 entries from spec), roles (7 entries), permissions matrix (modules × roles boolean map), departments list, audit events (15 from spec, plus generators). Store hydrates from this.

### Routes
- **`src/routes/admin.tsx`** — pathless layout: guards SAIS role (redirect to `/portal` for company), renders `<Outlet />` inside AppShell.
- **`src/routes/admin.users.tsx`** — header + search + "+ إضافة مستخدم" button. Table per spec (Avatar, name/email, role, dept, status badge, security events badge, login history link, view/edit/delete actions). 
  - `<UserFormDialog>` for create+edit (shared) with live password requirements checker (5 rules, green check when met, summary line).
  - `<UserDetailSheet>` for view (read-only with recent activity from audit log filtered to user).
  - Delete uses `<ConfirmDialog>`; blocks deleting last super_admin.
- **`src/routes/admin.roles.tsx`** — Tabs: "مصفوفة الصلاحيات" (default) | "الأدوار".
  - Roles tab: grid of role cards (`<RoleCard>`), super_admin highlighted with primary border, system roles get "نظام" badge and no delete button. "+ إضافة دور" opens `<RoleFormDialog>` (name Ar, key En, description). Edit and delete wired through store; new roles appear as new columns in matrix.
  - Matrix tab: horizontally scrollable table grouped by module (Dashboard/Projects/Reviews/Users/Settings) with section header rows (colored dot). Checkboxes (shadcn `Checkbox`) toggle and persist via `setPermission(roleKey, permKey, value)`. super_admin column has light-primary background. Alternating row backgrounds.

### Audit hook
Every store action records an entry into `auditEvents` with `{user: currentUser, type, description, page, level, ts}` so the audit page in 7C is populated by real demo activity, not just seeds.

**⏸ Stop after 7A.**

---

## SUB-PHASE 7B — Security Settings & Email Configuration

### Route
**`src/routes/admin.settings.tsx`** — header + vertical tabs on the right (RTL) with 7 entries (General, Notifications, Appearance, Security, Backup, AI, Email). Default active tab = **Security**. Sticky bottom-left "حفظ التغييرات" button (toast on click).

Tab state held in store so it persists across navigation.

### Tab components (under `src/components/admin/settings/`)
- **`SecurityTab.tsx`** — Session card, Password Policy card (number inputs + 4 requirement toggles in 2×2 grid), Additional Security card (5 toggle rows: 2FA with "قريباً" badge, IP whitelist, watermark, copy protection, disable right-click — each in bordered row with icon + description). Then **NCA ECC card**: header with NCA shield label, summary bar (70% progress + count badges 8/2/1), checklist of 10 controls with status indicator (green ✓ / amber ⚠ / red ✗) per spec.
- **`EmailTab.tsx`** — Provider dropdown, sender name/email, collapsible SMTP card (server/port/user/password/TLS toggle), amber security note card.
- **`GeneralTab.tsx`**, **`NotificationsTab.tsx`**, **`AppearanceTab.tsx`**, **`BackupTab.tsx`** — per spec (simple inputs, toggles, radios, last-5-backups table with "إنشاء نسخة احتياطية الآن" button that prepends a new row + toast).
- **`AiTab.tsx`** — coming soon card.

All toggles/inputs bind to `store.settings.*`. Save button writes to store + emits success toast + records audit event "تعديل إعدادات".

**⏸ Stop after 7B.**

---

## SUB-PHASE 7C — Audit Log + Full Platform CRUD/Dynamic Wiring

### Audit Log page
**`src/routes/admin.audit.tsx`** — Header + "تحديث" button (re-reads store, toast). 4 KPI cards (computed from store, not hardcoded — but seeded so totals show 1656/83/84/1489). Expandable guide (shadcn `Accordion`) explaining severity levels.

Filter bar: search input + 3 dropdowns (user, type, level) all wired to local state filtering the table. Table columns per spec; level rendered via `<Badge>` with proper tone. Delete row → ConfirmDialog → store removes entry. Pagination (15/page) with prev/next + "عرض X-Y من Z" label.

### CRUD wiring across the platform
For each entity, swap data source from `src/data/*` import to `useAppStore` selector and add the missing C/U/D entry points:

| Page | Add | Edit | Delete | Notes |
|---|---|---|---|---|
| `/projects` | "+ إضافة مشروع" → `<ProjectFormDialog>` | row action + detail header button | row action / detail header | Kanban drag updates `stage` |
| `/projects/$id` | — | edit modal | delete with confirm | Approve/reject/request-docs in `SubmissionReviewSheet` updates submission AND project status, advances stage on approval |
| `/tasks` | existing `NewTaskDialog` wired to store | `TaskDetailSheet` form | delete in detail | Drag-drop between columns updates status |
| `/companies` | "+ إضافة منشأة" dialog | detail edit | delete | |
| `/consultants` | "+ إضافة استشاري" dialog | detail dialog edit mode | delete | |
| `/portal/submissions/new` | wizard final step writes new submission to store, generates SAIS+company notifications, records audit event | — | — | After success → redirect to project detail showing the new submission |
| `/portal/projects/$id` Messages | message input writes to `portalConversations` store slice | — | — | New message appears immediately with current role's branding |
| `/notifications` & `/portal/notifications` | — | click row → mark read; "تحديد الكل كمقروء" | per-row dismiss button | Bell badge in TopBar reads live `unreadCountForRole` |

Drag & drop uses lightweight HTML5 DnD (no new dep) on `KanbanBoard` and `TaskBoard`.

### Cross-cutting polish
- Every successful action calls toast helper.
- Every destructive action uses `<ConfirmDialog>`.
- All modals close on X / outside click / Escape (shadcn defaults — verified).
- Breadcrumb map in `TopBar` extended for `/admin/*` routes.
- All admin routes guarded: company role visiting `/admin/*` redirects to `/portal`.

### Demo workflow verification (manual checklist run at end)
1. Company submits via wizard → submission appears in both portals + 2 notifications + activity feed entry + audit event.
2. SAIS approves submission → project status updates everywhere, stage advances, Kanban card moves, dashboard KPIs recompute.
3. Task drag from "جديدة" → "مكتملة" → KPI counts update.
4. Create a user → add role → toggle a permission → all three pages reflect it.
5. Toggle a security setting → save → toast + audit event row appears in `/admin/audit`.

**⏸ Stop after 7C with summary of what's now fully dynamic.**

---

## Files

**New (~25):**
- `src/store/appStore.ts`, `src/lib/toast.ts`, `src/components/common/ConfirmDialog.tsx`
- `src/data/admin.ts`
- `src/routes/admin.tsx`, `admin.users.tsx`, `admin.roles.tsx`, `admin.settings.tsx`, `admin.audit.tsx`
- `src/components/admin/users/{UsersTable,UserFormDialog,UserDetailSheet,PasswordRequirements}.tsx`
- `src/components/admin/roles/{RoleCard,RoleFormDialog,PermissionsMatrix}.tsx`
- `src/components/admin/audit/{AuditTable,AuditFilters,AuditKpis}.tsx`
- `src/components/admin/settings/{SecurityTab,EmailTab,GeneralTab,NotificationsTab,AppearanceTab,BackupTab,AiTab,NcaCompliance}.tsx`
- New entity dialogs: `CompanyFormDialog`, `ConsultantFormDialog`, `ProjectFormDialog`

**Edited (CRUD + store migration):** `AppSidebar`, `TopBar`, all dashboard widgets, projects/companies/consultants/tasks routes and their components, portal projects/submissions/notifications, RoleContext (currentUser bind), `routeTree.gen.ts`.

**Dependency:** `bun add zustand`.

After approval I'll execute 7A first and stop for your review.