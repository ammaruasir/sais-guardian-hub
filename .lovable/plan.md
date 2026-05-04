# Phase 4 — Company Portal (Aramco view)

Pivot the app so that switching the role to "بوابة المنشآت" presents a fully functional company portal scoped to أرامكو السعودية. This phase delivers the Dashboard and the Requirements Explorer; remaining portal pages (Our Projects, New Submission, Notifications, Help) get lightweight placeholder routes so the sidebar links don't 404 — they will be fleshed out in Phase 5.

## 1. Role-aware shell updates

- **AppSidebar (`src/components/layout/AppSidebar.tsx`)**: when `role === "company"`, swap the SA branding block in `SidebarHeader` for an Aramco placeholder (Building2 icon tile + "أرامكو السعودية" title + "بوابة المنشآت" subtitle). Sidebar item list already exists for company role — confirmed.
- **TopBar (`src/components/layout/TopBar.tsx`)**: avatar text "أ", name "أرامكو السعودية", subtitle "مدير الامتثال" (already wired). Extend `Breadcrumbs` map with the new portal routes.

## 2. Routing & redirects

- Replace the placeholder in `src/routes/index.tsx`: when `role === "company"`, render a `<Navigate to="/portal" />` (using `@tanstack/react-router`'s `Navigate`). Keep SAIS dashboard for SAIS role.
- New route files:
  - `src/routes/portal.tsx` — pathless layout returning `<AppShell><Outlet /></AppShell>`. Inside layout component, if `role === "sais"`, render `<Navigate to="/" />` so SAIS users can't sit on portal pages.
  - `src/routes/portal.index.tsx` → `/portal` (Dashboard).
  - `src/routes/portal.requirements.tsx` → `/portal/requirements` (Explorer).
  - `src/routes/portal.projects.tsx`, `src/routes/portal.submissions.new.tsx`, `src/routes/portal.notifications.tsx`, `src/routes/portal.help.tsx` — minimal "قريباً — المرحلة 5" placeholder cards so sidebar links resolve.
- Add a guard inside SAIS routes (`projects`, `tasks`, `companies`, `consultants`) — small shared `useRoleGuard("sais")` hook that redirects to `/portal` when in company mode. Implemented as a tiny effect in each existing route's component (or a single `RoleGuard` wrapper component in `src/components/layout/RoleGuard.tsx`).

## 3. Company Dashboard — `/portal`

Components under `src/components/portal/`:

- `WelcomeBanner.tsx` — gradient/secondary card, "مرحباً، أرامكو السعودية" + "لديكم 2 إجراءات مطلوبة" + subtle radial pattern.
- `ActionRequiredCards.tsx` — two cards with amber `border-r-4 border-warning`:
  1. "مطلوب مستندات إضافية" — توسعة رأس تنورة (p1) — "عرض التفاصيل" → `/projects/p1` (or portal project page placeholder).
  2. "اقتراب موعد التقديم" — خط أنابيب الشرقية (p6) — "بدء التقديم" → `/portal/submissions/new`.
- `MyProjectsGrid.tsx` — filters `projects` by `companyId === "aramco"` (p1, p6, p9, p12). Each card: name, mini 4-dot stepper (filled ≤ stage, ring on stage, empty after), status badge (reuse `Badges.tsx`), "آخر تحديث" date, "عرض المشروع" link.
- `RecentUpdatesTimeline.tsx` — static array with the 5 entries from the brief, styled like `ActivityFeed` with timeline dots.
- `ComplianceScoreWidget.tsx` — circular SVG gauge at 85%, success color, label "نسبة الامتثال الكلية" + "عبر جميع المنشآت" (reuse pattern from `companies/ComplianceGauge.tsx`).

Layout: banner full width → action cards (2-col) → grid splitting "My Projects" (lg:col-span-2) and right column stacking ComplianceScore + RecentUpdates.

## 4. Requirements Explorer — `/portal/requirements`

New file `src/data/portalRequirements.ts` containing the full 4-stage requirement catalog from the brief (each item: `id`, `code`, `nameAr`, `nameEn`, `directive` like `SEC-01`, `required: boolean`, `descriptionAr?`).

Components under `src/components/portal/requirements/`:
- `RequirementsWizard.tsx` — three selector rows:
  1. Sector dropdown (`Select` with the 7 sector options, default `petroleum`).
  2. Project type as `ToggleGroup` with 4 buttons, default `expansion`.
  3. Classification as `ToggleGroup` with 4 buttons, default `critical`.
  Selections held in local `useState`; they don't actually filter the catalog (POC) but visually update.
- `RequirementsTree.tsx` — `Accordion type="multiple"` with a card per stage. Trigger row: numbered circle (1–4), Arabic title, English subtitle, count chip ("6 متطلبات") on the trailing side.
- `RequirementCard.tsx` — empty circle checkbox icon, AR name (bold) + EN name (muted), directive chip, مطلوب (destructive) / اختياري (muted) chip, description, "تحميل النموذج" outline button (no-op + toast optional).

Page header: title "مستكشف المتطلبات" + descriptive subtitle.

## 5. Placeholder portal pages (Phase 5 stubs)

`portal.projects.tsx`, `portal.submissions.new.tsx`, `portal.notifications.tsx`, `portal.help.tsx` each render an `AppShell` + dashed-border card "هذه الصفحة قادمة في المرحلة 5". This keeps the sidebar functional without expanding scope.

## Technical notes

- TanStack file routing: dot-separated names (`portal.requirements.tsx`). Do not edit `routeTree.gen.ts`; the plugin regenerates on save.
- `Navigate` import from `@tanstack/react-router`.
- Reuse existing primitives: `Card`, `Accordion`, `Select`, `ToggleGroup`, `Badge`, `Button`, `Avatar`.
- Keep RTL: all new components use existing `border-r`, `text-right`, `flex-row` patterns consistent with prior phases.
- No backend / no Lovable Cloud needed — all data static.

## Out of scope (deferred to Phase 5)

- Full /portal/projects detail with submissions
- New Submission wizard interactivity
- Help center content
- Notifications panel content (route stub only)

⏸️ After implementation I will stop for review before Phase 5.
