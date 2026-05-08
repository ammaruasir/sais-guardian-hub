# Phase 8 — Implementation Plan (3 Sub-Phases)

I'll implement this in three reviewable chunks, stopping after each. All UI is RTL with logical Tailwind properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`).

---

## Sub-Phase 8A — Government Landing Page + Login (4 methods)

### Routing & Auth state
- Replace current `landing.tsx` design with a Saudi-government-style portal at `/landing` (existing route stays public).
- Keep the existing Supabase `AuthProvider`. Layer a **mock login mode** on top via Zustand:
  - `appStore.auth = { isAuthenticated, mockRole: 'sais' | 'company' | null }`
  - `RequireAuth` accepts either a real Supabase session OR `isAuthenticated === true` (mock), so the 4 mock buttons in the brief work without breaking the real `wakeb@admin.com` account.
- New `/login` route (the existing `/auth` stays as the real email/password form, linked from tab 4).
- `RequireAuth` redirects unauthenticated users to `/landing` (already does); landing CTAs go to `/login`.
- TopBar logout already exists — extend it to clear mock auth too.

### `/landing` page (rebuild)
Sections, Saudi-gov aesthetic (deep navy + white + subtle green accents, Vision 2030 placeholder badge):
1. **Top utility bar** — flag stripe, "المملكة العربية السعودية", language switcher (visual only).
2. **Header** — SAIS shield + name, Vision 2030 placeholder, "تسجيل الدخول" button.
3. **Hero** — title "منصة الخدمات الرقمية", subtitle, description, primary CTA → `/login`, secondary scrolls to services.
4. **Services** — 4 cards (FolderPlus, Search, ClipboardList, Users) with the exact Arabic copy from the brief.
5. **Stats** — 4 counters (2,500+ / 350+ / 94% / 7 أيام).
6. **Footer** — logo, quick links, contact, social placeholders, copyright, "مبادرة من وزارة الداخلية".

### `/login` page
Centered card on a soft gov-style background. Tabs (default = Nafath Business):
- **نفاذ أعمال** — green Nafath placeholder button → sets mock `company` role → `/portal`.
- **نفاذ حكومي** — button → mock `sais` → `/`.
- **نفاذ أفراد** — 10-digit ID input → mock `company` → `/portal`.
- **اسم المستخدم** — username + password (show/hide), remember-me, forgot-password link. Special rule: typing `admin` → `sais`/`/`; anything else → `company`/`/portal`. Link "استخدم حسابك الحقيقي" → existing `/auth`.
- Below card: "تسجيل منشأة جديدة" (placeholder route `/register`), trust badges (lock + NCA compliance text).

**⏸ Stop for review.**

---

## Sub-Phase 8B — Dynamic Request Routing

### Store additions (`src/store/appStore.ts`)
- `Department[]` (7 seeded as in brief, with `canFinalApprove` flags).
- `Request[]` (6 seeded exactly as in brief with full assignment chains).
- Actions: `assignRequest`, `reassignRequest`, `escalateRequest`, `returnRequest`, `approveRequest`, `rejectRequest`, `addRequestComment`, `addRequestDocument`, `createRequest`. Each pushes an `AssignmentEntry` and updates `currentDepartment` + `status`, writes audit log, fires notification.

### SAIS side
- **`/requests`** — Inbox (default), All, Assigned-to-me toggle. Table: ref no, title, type badge, company, priority, status, received date, action.
- **`/requests/$id`** — Header summary + **Assignment Chain Visualizer** (horizontal stepper with department nodes, person, dates, action; current node pulses; completed nodes get checkmarks; arrow connectors).
- **Action panel** (only enabled for current-department holder): Assign, Request Additional Docs (opens 8C composer), Return to Company, Escalate, Final Approval (gated by `canFinalApprove`), Reject.
- **Tabs**: Documents · Comments (internal vs external clearly distinguished) · Assignment Log (table) · Letters.
- Sidebar: add "الطلبات" entry above existing "المشاريع" for SAIS role; keep Projects intact.

### Company side
- **`/portal`** dashboard — add "الطلبات النشطة" section with cards (ref, title, status, current department, last update).
- **`/portal/requests/new`** — 4-step wizard (type → details → documents → review) → success screen with reference number.
- **`/portal/requests/$id`** — simplified chain (no internal comments), letters list, response/upload area when status is `additional_docs`.

Existing projects/tasks/companies/consultants/admin all stay. `Request.relatedProjectId` optional link.

**⏸ Stop for review.**

---

## Sub-Phase 8C — Formal Letter Templates

### Store additions
- `Letter[]` with the exact shape from the brief; actions `createLetterDraft`, `sendLetter`.
- 3 seeded letters as specified (additional_docs for REQ-0002, approval for REQ-0005, comments draft for REQ-0001).

### `LetterTemplate` component (shared)
Renders official SAIS letterhead in print-friendly A4 layout:
- Header: SAIS shield + bilingual authority name + "وزارة الداخلية"; "سري" red badge (conditional).
- Reference block: الرقم / التاريخ (Hijri) / المرفقات.
- Addressee + salutation + subject.
- Body switches by `type`:
  - `additional_docs` — intro + editable bulleted missing-docs list + 30-day deadline clause.
  - `approval` — approval text + optional conditions.
  - `rejection` — apology + editable reasons list + reapply clause.
  - `comments` — intro + editable 4-column table (م / المستند / التعليق / الحالة).
- Closing + signature block + circular SAIS seal placeholder + footer line.

### `LetterComposerDialog`
- Opened from request action panel.
- Pre-fills template; lets user edit body items (add/remove rows in lists/table); auto-fills ref/date/company/request.
- Preview tab shows formal layout; Edit tab shows form.
- Buttons: حفظ كمسودة / إرسال / طباعة (uses `window.print()` with print CSS isolating the letter).
- On send: status → `sent`, notification to company, request gets `letterRef`.

### Company portal integration
- `Letters` tab on `/portal/requests/$id` lists letters; clicking opens read-only `LetterTemplate`.
- Notification: "تم إصدار خطاب بخصوص الطلب [ref]".
- `additional_docs` letter view shows "الرد وإرفاق المستندات" button → upload + auto-comment back to request.

**⏸ Stop for final review.**

---

## Technical notes
- All new data is client-side (Zustand) — matches existing app pattern. No DB migrations needed for 8B/8C.
- Mock auth coexists with real Supabase auth; `wakeb@admin.com` flow keeps working.
- RTL logical properties throughout; reuse existing shadcn primitives + lucide icons.
- Print CSS scoped to letter component for clean PDF/print output.
