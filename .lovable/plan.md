
# Phase 5 — Company Portal: Project Tracker & Submission Wizard

Build the company-facing project tracking experience and a 5-step submission wizard, replacing the current placeholder routes (`/portal/projects`, `/portal/submissions/new`) with full implementations and adding a new dynamic route `/portal/projects/:id`.

## 1. Data additions

New file `src/data/portalConversations.ts`:
- `PortalMessage` type: `{ id, projectId, sender: "sais" | "company", senderName, ts, body, attachments? }`.
- Seed 3–5 realistic messages per Aramco project (p1, p6, p9, p12) using the back-and-forth examples from the brief.

Extend `src/data/submissions.ts` (no breaking changes): seeded submissions already cover past + current per project; reuse as-is for the history tab. Add a tiny helper `nextSubmissionRef()` that mints a string like `SAIS-2026-04-P1-S3-001` from a project + stage.

No changes to existing requirement / stage data — `portalRequirements.portalStages` drives the wizard's checklist and the project detail "Requirements & Documents" tab.

## 2. New route: `/portal/projects` (Our Projects)

File: `src/routes/portal.projects.tsx` (replace stub).

Component renders a 2-col / 1-col responsive grid of `PortalProjectCard`s, filtered by `companyId === "aramco"`.

New component `src/components/portal/projects/PortalProjectCard.tsx`:
- Header: AR name (bold) + EN name (muted), facility line.
- A compact horizontal `PortalStageStepper` (new component, see §4).
- Status + classification badges (reuse `Badges.tsx`).
- Last submission date (`p.submittedAt`).
- Highlighted "Next action" line — colored bar + icon, computed from `(status, stage)`:
  - `under_review` → neutral info ("التقديم قيد المراجعة لدى الهيئة")
  - `additional_docs` → warning ("مطلوب مستندات إضافية — يرجى الرد")
  - `approved` & stage<4 → success ("تم اعتماد المرحلة — يمكن الانتقال للمرحلة التالية")
  - `approved` & stage===4 → success ("المشروع مكتمل ✅")
  - `pending_final` → warning ("بانتظار الاعتماد النهائي")
  - `awaiting_submission` → muted ("بانتظار تقديم المرحلة")
- "عرض التفاصيل" button → `Link to="/portal/projects/$id" params={{id:p.id}}`.

## 3. New route: `/portal/projects/$id` (Company Project Detail)

File: `src/routes/portal.projects.$id.tsx`.

Guards: company-only (parent layout already enforces). 404 if project not found OR `companyId !== "aramco"` → render not-found card.

Layout:
- Breadcrumb: المشاريع › {project.nameAr}.
- Header card: name AR/EN, company • facility, sector + classification badges (reuse SAIS pattern).
- Prominent `PortalStageStepper` (new) — same 4-step shape but enriched: under each completed stage shows the approval date (from approved submissions); under the current stage shows the current status badge; future stages show "—".
- `Tabs` (defaultValue="status") with 4 tabs:

### Tab 1 — `status` "الحالة الحالية"
New component `src/components/portal/projects/CurrentStatusCard.tsx`:
- Stage name + number, large StatusChip, submission date.
- Reviewer comment quote-card (styled callout, includes reviewer name from `reviewers[]`) when `currentSub.comments` exists.
- Conditional CTA card matching status:
  - `additional_docs`: warning callout + "إرفاق المستندات المطلوبة" button → `/portal/submissions/new?project=p1&stage=3`.
  - `approved` & stage<4: success callout + "بدء تقديم المرحلة {stage+1}" button → wizard.
  - `approved` & stage===4: success "تم اعتماد المشروع".
  - `under_review` / `pending_final`: info card.

### Tab 2 — `requirements` "المتطلبات والمستندات"
New component `src/components/portal/projects/CompanyRequirementsList.tsx`:
- For each of 4 stages, render an `Accordion` item; the *current* stage is open by default.
- Past stages: render items with green ✅ "مرفق" + mock filename + upload date (derived from past submission documents).
- Current stage: render items with statuses driven from current submission's `documents.length` and `checklist`:
  - Attached → ✅ green with name + date.
  - Not attached → ⭕ row with outline "رفع" button (no-op toast).
  - Rejected (when `checklist[i].result === "fail"` or status `additional_docs`) → ❌ red with SAIS comment + "إعادة الرفع" button.
- Future stages: rows greyed out, "غير متاح بعد".

### Tab 3 — `history` "سجل التقديمات"
New component `src/components/portal/projects/SubmissionHistoryTimeline.tsx`:
- Vertical timeline (dot + connector line). Newest first (`subs.reverse()`).
- Each entry: date, "المرحلة {n}", list of document file names (from submission), SAIS decision badge + reviewer comments. Reuse `StatusChip` for decision.

### Tab 4 — `messages` "المراسلات"
New component `src/components/portal/projects/ConversationThread.tsx`:
- Chat bubbles: SAIS messages aligned start (right side in RTL → use `justify-end` carefully — actually in RTL, "left" visually = `flex-row-reverse`; we'll align SAIS bubbles `self-start` with muted background and SAIS avatar; Aramco bubbles `self-end` with secondary background + Aramco avatar "أ").
- Seeded from `portalConversations.ts` filtered by projectId.
- Footer composer: `Textarea` + paperclip `Button variant="ghost" size="icon"` + "إرسال رسالة" button. Local state appends a message to a `useState` list (no persistence). Toast on send.

## 4. Shared component: `PortalStageStepper`

File `src/components/portal/projects/PortalStageStepper.tsx` — new, slightly more compact + portal-flavored variant of `StageStepper`:
- Props: `current`, optional `meta?: Record<Stage, { approvedAt?: string }>`.
- Done = green filled circle + check.
- Current = primary ring with pulse (`animate-pulse` on the ring or background, subtle).
- Future = outlined gray circle.
- Below each step: AR label; on detail page also the approval date (done) or status badge (current).

Existing `MiniStepper` inside `MyProjectsGrid.tsx` stays as is (dashboard widget).

## 5. Submission Wizard — `/portal/submissions/new`

File `src/routes/portal.submissions.new.tsx` (replace stub). Accepts optional `?project=...&stage=...` query (parse manually from `useSearch({strict:false})` or `window.location.search` — keep it simple by using `Route.useSearch` with a minimal `validateSearch`).

Top-level `WizardStepper` (new component) showing 5 numbered steps with AR labels and current highlighted.

State held via `useState` for: `projectId`, `stage`, `files: Record<reqId, {name, size}>`, `consultantId`, `signatory`, `agreed`, `date`.

### Step components (under `src/components/portal/wizard/`):
1. `StepSelectProject.tsx` — `Select` of Aramco projects; on choose, render summary card (name, current stage, facility, classification).
2. `StepSelectStage.tsx` — `RadioGroup` of 4 stages; completed stages disabled; default to suggested next stage (current+1 if approved, else current). Note text when stage === current ("إعادة تقديم بعد طلب مستندات إضافية").
3. `StepUploadDocuments.tsx` — pulls `portalStages[stage-1].items`. Each row = requirement card with directive chip, required/optional badge, dashed dropzone. Clicking dropzone opens a hidden `<input type="file">` — on change we just store `{name: file.name, size: prettyBytes(file.size)}` in state; no real upload. Already-attached row shows file name/size + remove (X). `Progress` bar at top: `attachedRequiredCount / requiredCount`.
4. `StepDeclaration.tsx` — `Textarea` (readonly) with declaration text; `Input` signatory pre-filled "م. أحمد الراشد — مدير الأمن الصناعي"; consultant `Select` populated from `src/data/consultants.ts`; `Checkbox` for agreement; date `Input type="date"` defaulting to today (`new Date().toISOString().slice(0,10)`).
5. `StepReview.tsx` — summary read-out + large green "تقديم" button.

Footer of every step: "السابق" (disabled on step 1) and "التالي" (disabled when validation fails). Step 3 "Next" enabled when all required files attached, but with a small "متابعة بدون اكتمال" link to bypass for the demo. Step 5 "تقديم" → set `submitted=true`.

### Success view
On submit, replace wizard body with `SubmissionSuccess` component:
- Animated `CheckCircle2` (`animate-in zoom-in`) in a green circle.
- "تم التقديم بنجاح" + reference number `SAIS-2026-04-${projectId.toUpperCase()}-S${stage}-001`.
- Two info lines (5–7 days, notification on decision).
- Buttons: "العودة للمشاريع" → `/portal/projects`, "تقديم آخر" → resets state to step 1.

## 6. Wiring updates

- `src/components/portal/MyProjectsGrid.tsx`: change card `Link to="/portal/projects"` → `Link to="/portal/projects/$id" params={{id:p.id}}`.
- `src/components/portal/ActionRequiredCards.tsx`: first card (`p1`) `to` becomes `/portal/projects/$id` with params `{id:"p1"}`; second card stays `/portal/submissions/new` but adds `search={{project:"p6", stage:3}}`.
- Sidebar already links to `/portal/projects`, `/portal/submissions/new` — no edits needed.

## 7. Files created / edited

**Created**
- `src/data/portalConversations.ts`
- `src/components/portal/projects/PortalStageStepper.tsx`
- `src/components/portal/projects/PortalProjectCard.tsx`
- `src/components/portal/projects/CurrentStatusCard.tsx`
- `src/components/portal/projects/CompanyRequirementsList.tsx`
- `src/components/portal/projects/SubmissionHistoryTimeline.tsx`
- `src/components/portal/projects/ConversationThread.tsx`
- `src/components/portal/wizard/WizardStepper.tsx`
- `src/components/portal/wizard/StepSelectProject.tsx`
- `src/components/portal/wizard/StepSelectStage.tsx`
- `src/components/portal/wizard/StepUploadDocuments.tsx`
- `src/components/portal/wizard/StepDeclaration.tsx`
- `src/components/portal/wizard/StepReview.tsx`
- `src/components/portal/wizard/SubmissionSuccess.tsx`
- `src/routes/portal.projects.$id.tsx`

**Edited (replace existing stubs)**
- `src/routes/portal.projects.tsx`
- `src/routes/portal.submissions.new.tsx`
- `src/components/portal/MyProjectsGrid.tsx`
- `src/components/portal/ActionRequiredCards.tsx`
- `.lovable/plan.md`

## 8. Technical notes

- All routes added under `src/routes/portal.*.tsx` — TanStack file router auto-regenerates `routeTree.gen.ts`; do not edit manually.
- Use `Link` with typed `params` / `search` (never string-interpolated `to`).
- All UI uses existing shadcn primitives (`Tabs`, `Accordion`, `RadioGroup`, `Select`, `Checkbox`, `Progress`, `Textarea`, `Toaster`).
- RTL preserved (`text-right`, `flex-row` defaults flip in RTL document).
- No backend, no Lovable Cloud — all interactions are local state with toasts.
- File upload is mocked: hidden `<input type="file">` reads filename + size; nothing is sent anywhere.

## Out of scope

- Real file storage / signed URLs (mock only).
- Notifications page content, Help center content (still phase-X stubs).
- Any SAIS-side behavior changes.

⏸️ I will stop after Phase 5 for review.
