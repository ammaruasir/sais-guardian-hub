# المرحلة E — الفحص النهائي (Final Audit)

هذه مرحلة فحص + إصلاح، لا بناء. الخطة تحدد ترتيب التحقق وكيفية التعامل مع المشاكل.

## النهج

أمشي على القوائم الست بالترتيب، وكل خانة تفشل أوقف وأصلح فوراً ثم أكمل. الإصلاحات تكون موضعية (لا إعادة هيكلة). التقرير النهائي يلخّص ما مرّ بدون تغيير وما تم إصلاحه.

## 1) فحص workflow كامل (٢٧ خطوة) — Browser
- أفتح Browser على `/landing` بحجم 1280×720، وأنفّذ السلسلة كاملة (login → portal → new request → submit → portal/requests/$id → portal/requests → portal dashboard → logout → admin login → /requests/$id → assign → letter → portal upload → approve).
- بعد كل خطوة محورية: screenshot أو observe للتأكد، وقراءة console logs.
- الإصلاحات المتوقعة:
  - مسارات روابط مكسورة (Link to/params)
  - أسماء action في store ناقصة
  - placeholder بدل صفحات حقيقية
  - role switcher لا يحدّث الـ navigation

## 2) Navigation Completeness
- أتحقق من وجود كل route ملف في `src/routes/`، ومن sidebar entries في `AppSidebar.tsx` (أنا قد فحصته).
- خانات Auth Protection: المشروع POC بدون حماية فعلية. سأضيف guard خفيف في `portal.tsx` و `admin.tsx` و `requests.index.tsx` يستخدم `useRole().role`؛ إن كانت `null/guest` → `<Navigate to="/login" />`. لا يلزم `_authenticated` layout (تجنّب إعادة هيكلة المسارات).
- سجلّ روابط dashboard/breadcrumbs/notifications: مراجعة بصرية + click-through في المتصفح على عينات.

## 3) Dark Mode
- أبدّل `themeMode` لـ `dark` عبر store أو الإعدادات، وأمر على ١٧ صفحة.
- إصلاحات شائعة محتملة: ألوان hex مباشرة في landing (`#005528`, `#83bf3f`, `slate-900` …) — أتركها كما هي إن كانت مقصودة للـ government brand، لكن أتأكد من قراءة النصوص في dark.
- Letter preview: يجب أن يبقى الورق أبيض في dark (تحقق من `LetterTemplate`).

## 4) Language Switch
- أبدّل لـ EN، أمر على نفس الصفحات، أتحقق من `dir="ltr"` و sidebar يساراً (موجود في `useApplySettings`).
- نقاط حساسة: عناوين `usePageTitle` في صفحات إنجليزية تستخدم `t()` فعلاً (تحقق)، ونصوص hardcoded عربية متبقّية في landing/login/components → استبدال بـ `isAr ? ... : ...` عند اللزوم.

## 5) Visual Consistency
- ألوان البادج: مراجعة `requestStatusLabel`, `priorityLabel` في `src/data/requests.ts` — toned مرة واحدة، تنطبق في كل مكان.
- Empty states: فحص Kanban/Tasks/Notifications/Search results.
- Confirm dialogs على destructive: تحقق من `delete user`, `reject request`.
- Demo badge: قراءة `DemoBadge.tsx` في dark mode.

## 6) Data Consistency
- ربط KPI ↔ store: تتبّع selectors في `KpiCards.tsx` لتأكيد أنها تقرأ `requests` مباشرة.
- Notification bell: `topbar` يقرأ `notifications.filter(n => !n.read && n.audience matches role)`.
- Company portal scoping: تحقق من فلترة `companyId === "aramco"` في `portal.requests.index.tsx` و `ActiveRequestsSection`.
- Audit log: تأكد أن actions في store تضيف `auditEvents`.

## 7) Performance & Polish
- قراءة `code--read_console_logs` و `code--read_runtime_errors`.
- التحقق من أن `RoleSwitcher` لا يعيد mount كامل التطبيق (transition في `AppShell`).
- لا blank screens: tested via workflow.

## مخرجات
بعد التنفيذ، تقرير منظّم:
- ✅ مرّ بدون تغيير: قائمة
- 🔧 تم إصلاحه: قائمة + الملف المعدّل + سطر مختصر
- ⚠️ ملاحظات (POC limitations): قائمة
