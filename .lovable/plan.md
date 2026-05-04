## Admin sub-modules — non-functional items audit

### Findings

After reviewing `/admin/users`, `/admin/roles`, `/admin/audit`, `/admin/settings` and their components/store, these things don't work end-to-end:

1. **`/admin` is a dead route** — `admin.tsx` is a layout with `<Outlet />` but no index child, so visiting `/admin` shows a blank page.
2. **User active/inactive status can't be toggled** — `seedUsers` includes `active: false` users, but `UserFormDialog` never exposes the field and `UsersTable` has no action to flip it. Only way to deactivate is delete.
3. **Appearance settings are stored but never applied** — `themeMode` (light/dark/auto), `fontSize` (small/medium/large), and `sidebarMode` (open/collapsed) write to the store but nothing reads them. The `.dark` class hook exists in `styles.css` but no code adds it.
4. **Role form doesn't validate key uniqueness** — creating two roles with the same key silently corrupts the permissions matrix.
5. **Audit "user" filter** has hard-coded `"Admin User"` and `"Unknown"` items appended after the dynamic list, even when there are no events for them — minor cleanup.

### Fixes

**1. Add `/admin` index redirect**
Create `src/routes/admin.index.tsx` that `beforeLoad` redirects to `/admin/users`.

**2. User active toggle**
- `UserFormDialog`: add a "نشط" Switch field bound to a new `active` state; pass it on create & update.
- `UsersTable`: replace the static نشط/غير نشط Badge cell with a clickable Switch that calls `updateUser(u.id, { active: !u.active })` + audit entry + toast.

**3. Apply appearance settings**
- Create `src/hooks/useApplySettings.ts` that watches `settings.themeMode` and `settings.fontSize`:
  - Theme: toggle `.dark` on `document.documentElement` (auto = follow `prefers-color-scheme`).
  - Font size: set `document.documentElement.style.fontSize` to 14/16/18px.
- Update `AppShell.tsx` to call `useApplySettings()` and pass `defaultOpen={settings.sidebarMode !== "collapsed"}` to `SidebarProvider` so the sidebar setting takes effect.

**4. Role key uniqueness**
In `RoleFormDialog.submit`, check `roles.some(r => r.key === normalized)` before `addRole` and toast an error if duplicate.

**5. Audit user filter cleanup**
In `admin.audit.tsx`, build the user list from `Array.from(new Set([...users.map(u=>u.nameAr), ...audit.map(e=>e.user)]))` instead of hard-coding extras.

### Files changed
- new `src/routes/admin.index.tsx`
- new `src/hooks/useApplySettings.ts`
- `src/components/layout/AppShell.tsx`
- `src/components/admin/users/UserFormDialog.tsx`
- `src/components/admin/users/UsersTable.tsx`
- `src/components/admin/roles/RoleFormDialog.tsx`
- `src/routes/admin.audit.tsx`