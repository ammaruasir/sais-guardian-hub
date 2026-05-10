# Phase D — Platform Polish

Seven independent improvements. All new strings go through `useT()`; new keys added to `src/i18n/translations.ts`.

## 1. Profile Dropdown (TopBar)

Replace the avatar block + standalone Logout button in `TopBar.tsx` with a `DropdownMenu` triggered by clicking the avatar.

**SAIS variant:**
- Header: name (bold) + role (muted)
- `DropdownMenuSeparator`
- Item "Profile" → opens a `Sheet` with name, email, role, department, last login (mock)
- Item "Settings" → `/admin/settings`
- Separator
- Inline row: Moon/Sun icon + Dark Mode label + `Switch` (calls `useTheme().setTheme`)
- Inline row: Globe icon + language label + `Switch` (calls `setLanguage`)
- Separator
- Item "Logout" (red, LogOut icon) → existing `handleSignOut`

**Company variant:** same shape; header shows company name + "مدير الامتثال"; "Settings" goes to `/portal/settings`.

Uses existing `dropdown-menu`, `sheet`, `switch` shadcn primitives. The two inline toggle rows use `<DropdownMenuItem onSelect={(e) => e.preventDefault()}>` so the menu stays open.

## 2. Company Account Settings — `/portal/settings`

New file `src/routes/portal.settings.tsx` (child of existing `portal.tsx` layout — no `<AppShell>` wrapping).

Four `Card` sections:
1. **Company Info** — read-only fields with "Edit" → enables inputs → "Save"/"Cancel". State held locally; mock save shows toast.
2. **Contacts** — `Table` with mock rows; "Add contact" opens a `Dialog`; row actions Edit/Delete (mock state).
3. **Preferences** — radio groups for language (wired to `setLanguage`) and theme (wired to `setTheme`); 3 `Switch` items for email/new-request/weekly notifications (local state).
4. **Security** — change password form (3 inputs + button, mock submit); active sessions list (2 mock rows: browser, device, IP, last active).

Add nav entry `{ to: "/portal/settings", icon: Settings, key: "account_settings" }` to `companyNav` in `AppSidebar.tsx` (last item).

## 3. Intra-Department Staff Assignment

**Type change** in `src/data/requests.ts`:
```ts
export type AssignmentEntry = {
  ...
  assignedToUserId?: string;
  assignedToUserName?: string;
};
```

**Store action** in `src/store/appStore.ts`:
`assignToStaff(requestId, userId, userName, note?)` → mutates the open chain entry (the one with no `endedAt`) of the request, sets `assignedToUserId`/`assignedToUserName`, appends an audit-log + activity entry.

**UI** in `src/routes/requests.$id.tsx` action panel:
- New button "Assign to staff member"
- Opens a `Dialog` with a `Select` of users where `user.department === currentDepartment`, optional notes textarea, Confirm button
- Header card shows "المسؤول: {assignedToUserName}" when set on the active chain entry

## 4. Command Palette (Ctrl/⌘+K)

New `src/components/common/CommandPalette.tsx` using shadcn `CommandDialog`.

- Mounted in `AppShell.tsx` (always present for authenticated users)
- Global `keydown` listener (in palette component) for `(metaKey||ctrlKey) && key === "k"` toggles `open`
- TopBar gets a `Search` icon button that also opens it
- Reads `requests`, `projects`, `companies`, `users` from `useAppStore`
- For role `company`, filter requests/projects to `companyId === "aramco"`; hide Users group
- Search filter: case-insensitive substring on `ref`, `titleAr`, `titleEn`, `nameAr`, `nameEn`
- `CommandGroup` per type with icon + primary text + subtitle; `onSelect` → `navigate({ to, params })` then close
- Empty state via `CommandEmpty`

## 5. Browser Tab Titles

Add a tiny hook `src/hooks/usePageTitle.ts`:
```ts
useEffect(() => { document.title = title; }, [title]);
```

Call it at the top of each page component with the localized title (using `useT`). Dynamic routes (`/requests/$id`, `/portal/requests/$id`) compute from the loaded request's `ref`.

Pages updated: index, requests.index, requests.$id, projects.index, tasks, companies, consultants, reports, notifications, admin.users, admin.roles, admin.audit, admin.settings, portal.index, portal.requests.index, portal.requests.$id, portal.requests.new, portal.requirements, portal.settings, landing, login.

## 6. Mobile Responsiveness (≤ 375 px)

Targeted fixes only — most layouts already use Tailwind responsive utils:
- `requests.index.tsx`: wrap the table in `hidden md:block`; add a card list (`grid gap-3 md:hidden`) duplicating the same data per row.
- `requests.$id.tsx` chain visualizer: switch container to `flex-col md:flex-row`; arrows rotate to point down on mobile.
- `landing.tsx`: verify hero stacks (`flex-col md:flex-row`) and stats grid is `grid-cols-2 md:grid-cols-4`; add classes if missing.
- TopBar: hide RoleSwitcher text labels under `sm` (`hidden sm:inline` on the labels), keep icons.
- Dialogs: confirm `max-w-[95vw]` on the largest ones (CommandDialog, assignment dialog).
- KPI grids on dashboards: ensure `grid-cols-2 md:grid-cols-4` (already mostly correct — verify and fix).

No changes to business logic; pure className/layout tweaks.

## 7. Footer

- `AppSidebar.tsx` `SidebarFooter`: change to two lines — "© 2026 SAIS" + small muted "v1.0.0-poc" badge.
- Landing page: scan existing footer; if any of {logo+name, quick links, contact, copyright, "مبادرة من وزارة الداخلية"} is missing, add it. No restructure.

## Translation keys to add

`account_settings`, `profile`, `dark_mode`, `light_mode`, `language`, `company_info`, `contacts`, `preferences`, `security`, `edit`, `save`, `cancel`, `add_contact`, `change_password`, `old_password`, `new_password`, `confirm_password`, `active_sessions`, `assign_to_staff`, `staff_member`, `notes_optional`, `search_platform`, `no_results`, `email_notifications`, `new_request_notifications`, `weekly_summary`.

## Out of scope

No backend changes (no Supabase migration). No new dependencies — all UI primitives already exist in `src/components/ui/`.

## Verification after build

1. Cmd+K from any page → dialog opens, search filters across all 4 entity types, click navigates.
2. Click avatar → dropdown shows; toggle dark mode and language inline; menu stays open.
3. `/portal/settings` reachable from sidebar; all 4 sections render; edit/save in Company Info works.
4. Open a request as SAIS reviewer → "Assign to staff" dialog → staff member set → header shows name.
5. Browser tab title changes on every navigation.
6. 375 px viewport: requests page shows cards (no horizontal scroll); chain stacks vertically on detail.
7. Sidebar footer shows version line.
