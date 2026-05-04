# Phase 6 — Notifications, Reports, Polish & Demo Mode

## 1. Notifications (shared)

**New data file:** `src/data/notifications.ts`
- Export `AppNotification` type and `notifications` array seeded with the 12 entries (6 SAIS + 6 Aramco) per the spec.
- Helper: `getNotificationsForRole(role)` filtering by `forRole === role || "both"`.
- Helper: `unreadCountForRole(role)`.

**New shared component:** `src/components/notifications/NotificationsList.tsx`
- Local state for `read` map (toggled in-memory) + active filter tab.
- Tabs (shadcn `Tabs`): الكل / غير مقروءة / اعتمادات / طلبات / مواعيد.
- Row layout (RTL): icon-on-right (CircleCheck/FileQuestion/XCircle/Clock/FileUp/MessageCircle with proper tone bg), title bold, description muted, timestamp left-aligned, blue dot for unread. Whole row is a `<Link>` to `linkTo` with hover bg.
- "تحديد الكل كمقروء" button top-left clears unread map.
- Empty state when filter has no matches.

**New routes:**
- Create `src/routes/notifications.tsx` → SAIS notifications page (guard: redirect to `/portal/notifications` if role is company).
- Replace stub `src/routes/portal.notifications.tsx` with company list (guard: redirect to `/notifications` if role is sais).
- Both pages just render `<NotificationsList role={...} />` inside `AppShell`.

**TopBar bell:**
- Use `useRole` + `unreadCountForRole`; badge shows actual count (hide if zero).
- Wrap bell in `<Link to={role === "sais" ? "/notifications" : "/portal/notifications"}>`.
- Add `/notifications` and `/portal/notifications` to Breadcrumbs map (already partially present).

**Sidebar:** SAIS nav already links `/notifications`; company nav currently points to `/notifications` — fix it to `/portal/notifications`.

## 2. Reports (`/reports`, SAIS only)

**New route:** `src/routes/reports.tsx` (guard: redirect company role to `/portal`).
- Header "التقارير والإحصائيات" + EN subtitle; date-range `Select` top-left with the 4 options, default "آخر 6 أشهر" (purely cosmetic).
- 2x2 grid (`lg:grid-cols-2`) of `Card`s, each with Arabic title + EN subtitle:
  1. **BarChart** monthly completed projects (Recharts) — values 3,2,4,2,5,3 across نوفمبر→أبريل, fill `var(--primary)`.
  2. **Horizontal BarChart** avg review time by stage (layout="vertical") — 3.2/5.1/6.8/4.5, fill `var(--secondary)`; tooltip suffix "يوم".
  3. **Donut PieChart** submissions by sector — 35/25/15/15/10 using chart palette colors.
  4. **Horizontal BarChart** reviewer workload — bars with `Cell` so the max value (خالد=4) is amber, others primary.

## 3. Help (`/portal/help`)

Replace stub with:
- Header "المساعدة والدعم".
- `Accordion` with the 5 FAQ items (text per spec).
- Contact card (`Card` + Phone/Mail/Clock icons) with hotline, email, business hours.
- Quick-links row: 3 outline buttons linking to `/portal/requirements`, `/portal/submissions/new`, and an info `Dialog`/disabled card for "الاستشاريون المعتمدون" (SAIS-only page; show as text since company role can't navigate there) — alternative: show a Button that toggles a small inline note. Will use simple tile buttons that open `/portal/requirements` etc.

## 4. Polish pass

**Demo badge** — add `src/components/layout/DemoBadge.tsx`: fixed `bottom-4 left-4`, subtle backdrop-blur chip "نموذج توضيحي — POC Demo". Mount it in `AppShell` so it persists everywhere.

**Role transition fade** — wrap `AppShell` children in a keyed div using `role` as key with Tailwind `animate-in fade-in duration-200` to give a soft fade when switching portals.

**Loading skeletons** — add brief mount-time skeleton flashes:
- `src/components/dashboard/KpiCards.tsx`: `useState(loading=true)` cleared via `setTimeout(400)`, render 4 `Skeleton` cards while loading.
- Same trick on `StagePipeline` and `SectorDonut`.

**Sidebar active state fix** — current logic `path.startsWith(item.to)` can match `/portal` for `/portal/projects` too. Adjust so when item.to is the dashboard (`/` or `/portal`) we require exact match; for nested items keep startsWith. Ensures only one item highlights per route.

**Breadcrumbs map** — extend `TopBar.Breadcrumbs.map` to include `/reports`, `/companies`, `/consultants`, `/projects/$id` patterns (for dynamic routes derive from first segment fallback).

**Status badge consistency** — quick audit of `Badges.tsx` — colors already align with spec (approved=success/green, under_review=secondary, additional_docs=warning/amber, rejected=destructive/red, awaiting=muted, pending_final=warning). No code change unless drift found during edit.

## 5. Files

**Create:**
- `src/data/notifications.ts`
- `src/components/notifications/NotificationsList.tsx`
- `src/components/layout/DemoBadge.tsx`
- `src/routes/notifications.tsx`
- `src/routes/reports.tsx`

**Edit:**
- `src/routes/portal.notifications.tsx` (real impl)
- `src/routes/portal.help.tsx` (real impl)
- `src/components/layout/TopBar.tsx` (bell link + count, breadcrumb map)
- `src/components/layout/AppSidebar.tsx` (active-state fix, fix company notifications link)
- `src/components/layout/AppShell.tsx` (mount DemoBadge, keyed fade wrapper)
- `src/components/dashboard/KpiCards.tsx`, `StagePipeline.tsx`, `SectorDonut.tsx` (skeleton flash)

After implementation I'll stop and present the finished demo for review.
