# Sub-Phase 7B — Store Migration + Settings + NCA + Email

## Part 1: Migrate all app data into the Zustand store

Extend `src/store/appStore.ts` so it owns every domain entity. Keep static seed files (`src/data/index.ts`, `tasks.ts`, `submissions.ts`, `notifications.ts`, `consultants.ts`, `facilities.ts`) unchanged — the store imports them as initial state. Components stop importing the static arrays directly and read from selectors instead.

### New store slices & actions

- **projects**: `addProject`, `updateProject`, `deleteProject`, `updateProjectStatus(id, status, stage?)` — auto-advances stage and resets to `awaiting_submission` on intermediate approvals; final stage 4 approval stays `approved`.
- **companies**: `addCompany`, `updateCompany`, `deleteCompany`.
- **tasks**: `addTask`, `updateTask`, `deleteTask`, `updateTaskStatus(id, status)`.
- **submissions**: `addSubmission`, `updateSubmission`, `updateSubmissionDecision(id, decision, comments?)` — internally calls `updateProjectStatus` and `addNotification` + `addActivity`.
- **notifications**: `addNotification`, `markAsRead`, `markAllAsRead(role)`, `deleteNotification`, selector `getUnreadCount(role)` (counts unread where `forRole === role || forRole === "both"`).
- **activity**: `addActivity` (prepends).
- **consultants**: `addConsultant`, `updateConsultant`, `deleteConsultant`.
- **facilities**: read-only initial state (no CRUD required this phase).

`resetDemo` extended to re-seed every slice. Persist key bumped to `sais-app-store-v2` to avoid stale localStorage shape.

### Component wiring (existing screens)

| Component | Change |
|---|---|
| `KpiCards.tsx` | Compute KPIs live from `projects` + `submissions`. |
| `SubmissionReviewSheet.tsx` | `decide()` calls `updateSubmissionDecision`, emits notification + activity, then toast/close. |
| `portal.submissions.new.tsx` | On submit: `addSubmission` → `addNotification` (sais) → `addActivity` → success screen. |
| `TaskBoard.tsx`, `NewTaskDialog`, `TaskDetailSheet` | Read tasks from store; create/update via store actions. |
| `KanbanBoard.tsx` | Read `projects` from store (re-renders on stage change; full DnD deferred to 7C). |
| `TopBar.tsx` | Bell badge = `getUnreadCount(role)`. |
| `portal.index.tsx` (Action Required + Recent Updates) | Computed from store filtered by `companyId === "aramco"`. |
| `OverdueTable.tsx` | `projects.filter(p => p.overdue)` from store. |
| `ActivityFeed.tsx` | Reads `activity` from store. |
| Lists: `companies.tsx`, `consultants.tsx`, `projects.tsx`, `tasks.tsx`, project/company detail pages, `MyProjectsGrid`, `PortalProjectCard`, `SubmissionList`, `notifications` pages | Switch to `useAppStore` selectors. |

KPI formulas:
- `activeProjects = projects.length`
- `pendingReviews = projects.filter(p => p.status === "under_review").length`
- `overdue = projects.filter(p => p.overdue).length`
- `approvalRate = approvedDecisions / decidedSubmissions * 100`
- `avgReviewDays = mean(daysInStage of projects under_review)`

## Part 2: Settings page (`/admin/settings`)

Replace the placeholder route. Layout: page header + two-column grid with vertical RTL tabs on the right (icon + label) and tab content on the left. Default tab: **الأمان**.

### Tabs

1. **عام** — platform name, default language, timezone, Hijri/Gregorian toggle.
2. **الإشعارات** — 5 toggle rows bound to `notify*` settings.
3. **المظهر** — radio groups for `themeMode`, `fontSize`, `sidebarMode`.
4. **الأمان** (default) — 4 cards:
   - **إعدادات الجلسة**: `sessionTimeout`, `maxLoginAttempts`, `lockoutMinutes`.
   - **سياسة كلمة المرور**: `passwordMinLength`, `passwordExpiryDays`, 2×2 toggles for upper/lower/number/special.
   - **إعدادات أمان إضافية**: rows for 2FA (disabled + "قريباً" badge), `ipWhitelist`, `watermark`, `copyProtection`, `disableRightClick`.
   - **ضوابط الأمن السيبراني (ECC)**: progress bar (70%), three count badges (8/2/1), 10-row checklist with colored status pill per spec. Static metadata in `src/data/ncaControls.ts`.
5. **النسخ الاحتياطي** — last backup info, schedule, "إنشاء نسخة احتياطية الآن" button (toast), table of 5 mock backups.
6. **البريد الإلكتروني** — provider dropdown, sender name/email, collapsible SMTP card (server/port/user/password/TLS toggle), amber security note.

All inputs are controlled and write through `updateSettings`. Floating bottom-left **حفظ التغييرات** button shows the success toast (state already persists via Zustand `persist` — button confirms intent).

## Files

**New**
- `src/data/ncaControls.ts`
- `src/components/admin/settings/SettingsTabs.tsx`
- `src/components/admin/settings/SecurityTab.tsx`
- `src/components/admin/settings/NcaCompliancePanel.tsx`
- `src/components/admin/settings/EmailTab.tsx`
- `src/components/admin/settings/GeneralTab.tsx`
- `src/components/admin/settings/NotificationsTab.tsx`
- `src/components/admin/settings/AppearanceTab.tsx`
- `src/components/admin/settings/BackupTab.tsx`

**Edited**
- `src/store/appStore.ts` (large extension)
- `src/data/admin.ts` (extend `AppSettings` with date format already covered; add backup fields if needed)
- `src/routes/admin.settings.tsx` (replace placeholder)
- All components listed in the wiring table above

## Verification before stopping

- Approving a submission in the review sheet flips the project's status (visible in Kanban + KPIs).
- Submitting via the company wizard adds a row to the SAIS project's submissions tab and bumps the SAIS bell count.
- Bell count differs per role and decreases when "mark all read" is clicked.
- All 6 settings tabs render; toggles persist after reload (Zustand persist).
- NCA panel shows progress bar + 10 controls with correct colors.
