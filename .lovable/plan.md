# Phase C — Bilingual AR/EN Support

Wire a full Arabic ↔ English translation system to existing `appStore.settings`, plus an HTML `dir`/font switcher and translation rollout across UI chrome.

## 1. Foundations (new + store)

- **Create `src/i18n/translations.ts`** — full dictionary from spec (`{ar, en}` per key) and `TKey` type.
- **Create `src/hooks/useT.ts`** — returns `{ t, lang, dir, isAr, name(entity) }`. Reads `useAppStore(s => s.settings.language ?? "ar")`.
- **Update `src/data/admin.ts`** — add `language: "ar" | "en"` to `AppSettings`; default `"ar"` in `seedSettings`.
- **Update `src/store/appStore.ts`** — add `setLanguage(lang)` action (thin wrapper over `updateSettings({ language })`); bump persist version to migrate old persisted state (default missing `language` → `"ar"`).

## 2. Apply language globally

- **Extend `src/hooks/useTheme.ts`** (or add side-effect in existing `useApplySettings.ts` — already imported in root) to also apply on every `language` change:
  - `document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"`
  - `document.documentElement.lang = lang`
  - Toggle a `font-en` class on `<html>` (or set `--app-font` CSS var) — Arabic stays default `IBM Plex Sans Arabic, Inter, system-ui`; English becomes `Inter, IBM Plex Sans Arabic, system-ui`.
- **`src/styles.css`** — define `html { font-family: var(--app-font, "IBM Plex Sans Arabic", "Inter", system-ui, sans-serif); }` and `html.font-en { --app-font: "Inter", "IBM Plex Sans Arabic", system-ui, sans-serif; }`. Add `transition` already exists.

## 3. Language toggles (UI controls)

- **`src/components/layout/TopBar.tsx`** — add `LanguageToggleButton` next to `ThemeToggleButton`. Shows `EN` when AR active, `عربي` when EN active. Click → `setLanguage(other)`.
- **`src/routes/landing.tsx`** — add the same toggle in the top nav header (text variant: "عربي | English").
- **Appearance settings** (`src/routes/admin.settings.tsx` appearance tab) — add language radio (عربي / English) bound to `settings.language`, switches immediately on change.

## 4. Translation rollout (replace hardcoded AR strings)

Apply `const { t, name } = useT()` and replace literals in (priority order):

1. **Layout**: `AppSidebar.tsx`, `TopBar.tsx`, `DemoBadge.tsx`.
2. **Dashboards**: `KpiCards.tsx`, `RequestsByStatusDonut.tsx`, `RequestsByDepartmentBar.tsx`, `RequestsNeedingAction.tsx`, `ActionRequiredCards.tsx`, `ActiveRequestsSection.tsx`, `RecentUpdatesTimeline.tsx`, dashboard route titles.
3. **Requests**: `routes/requests.index.tsx`, `requests.$id.tsx`, `requests.new.tsx`, `portal.requests.*`, related card / table / tab components.
4. **Landing & Login**: `routes/landing.tsx`, `routes/login.tsx`.
5. **Admin**: `routes/admin.users.tsx`, `admin.roles.tsx`, `admin.settings.tsx`, `admin.audit.tsx`.
6. **Other**: projects, tasks, companies, consultants, reports, notifications, help, requirements pages — table headers, filter placeholders, primary buttons.

For toasts: replace `toast.success("تم …")` literals with `t("toast_*")` keys.

For entity names with `nameAr`/`nameEn` (companies, departments, consultants, facilities), use `name(entity)`. Where code currently passes raw `nameAr`, swap to `name()`. Helpers in `src/data/requests.ts` like `requestStatusLabel` / `requestTypeLabel` will be replaced at call sites with `t("status_*")` / `t("type_*")` (keep helpers for non-React usage but prefer `t` in components).

**Do NOT translate**: seeded demo content (activity feed text, comments, letter bodies).

## 5. Verification checklist

- Toggle EN → sidebar labels, topbar, KPIs, tables, buttons all in English; `<html dir="ltr" lang="en">`; sidebar flips to left; font switches to Inter.
- Toggle AR → reverts; RTL restored; font reverts.
- Company names + department names follow language.
- Toasts in current language.
- Landing + Login fully switch.
- Settings appearance radio reflects current and switches live.

## Technical notes

- `useT` is the single read path; never read translations dictionary directly in components.
- `dir` is applied via root effect, NOT per-component, so the existing logical-property classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) flip automatically.
- Persist migration: increment `persist({ version })` and supply a `migrate` that injects `language: "ar"` if absent — avoids blank UI for returning users.
- Recharts tick/legend labels that come from data also need `name(...)` translation where the data has bilingual fields (e.g., department breakdown chart).

Files created: `src/i18n/translations.ts`, `src/hooks/useT.ts`.
Files edited (core): `src/data/admin.ts`, `src/store/appStore.ts`, `src/hooks/useApplySettings.ts` (or `useTheme.ts`), `src/styles.css`, `src/components/layout/TopBar.tsx`, `src/components/layout/AppSidebar.tsx`, `src/routes/landing.tsx`, `src/routes/login.tsx`, `src/routes/admin.settings.tsx`, plus the dashboards, request, admin, and listing pages enumerated above.
