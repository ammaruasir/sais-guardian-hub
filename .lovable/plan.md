# المرحلة D — المتبقي

## 1) إصلاح خطأ portal.settings.tsx
`useTheme()` يصدّر `themeMode` و`setTheme` (لا يوجد `theme`). نستبدل في السطرين 29 و146:
- السطر 29: `const { themeMode, setTheme } = useTheme();`
- السطر 146: `<RadioGroup value={themeMode} ...>`

## 2) تطبيق usePageTitle على كل الصفحات
أضيف استدعاء `usePageTitle(...)` في أعلى مكوّن كل route حسب الجدول الذي زوّدتنا به.
- صفحات SAIS الداخلية: `${t("key")} — ${t("sais_short") || "SAIS"}` (نستخدم نص "SAIS" مباشرة كما طلبت).
- صفحات البوابة: `${t("key")} — ${t("company_portal")}`.
- الصفحات ذات معرف ديناميكي (`requests/$id`, `portal/requests/$id`): العنوان يُحسب من `request.referenceNo` بعد التحميل (`isAr ? "طلب " + ref : "Request " + ref`).
- اللاندنغ: `${t("sais_name")} — ${t("platform_name")}`.
- صفحات Login/Register/Auth: `${t("login")} — SAIS` إلخ.

سأمر على كل ملفات `src/routes/*.tsx` المذكورة وأضيف السطر داخل المكوّن مباشرة بعد `useT()`.

## 3) زر "إسناد لموظف" في `/requests/$id`
في لوحة الإجراءات داخل `src/routes/requests.$id.tsx`:
- زر جديد بعد "إسناد لإدارة أخرى" بعنوان `t("assign_to_staff")` وأيقونة `UserCheck`.
- يفتح `Dialog` يحتوي:
  - عنوان (AR/EN حسب `isAr`)
  - `Select` يعرض `users` من المتجر مفلترة بـ `user.department === currentDepartment` (الإدارة الحالية = آخر `assignmentChain.departmentName`).
  - `Textarea` للملاحظات (اختياري)
  - زر "إسناد" يستدعي `assignToStaff(requestId, userId, userName, notes)` الموجود مسبقاً، يضيف `assignedToUserId/Name` لآخر entry، يضيف audit log، ويعرض `toast.success(t("toast_assigned"))`.
- في هيدر تفاصيل الطلب: عند وجود `assignedToUserName` في آخر entry، أعرض `<Badge>` صغيرة: "المسؤول: {name}" بجانب اسم الإدارة.

## 4) تحسينات الموبايل (375px)
أ) **Landing** (`landing.tsx`): Hero → `flex-col md:flex-row`, نص `w-full`. Service cards → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. Stats → `grid-cols-2 md:grid-cols-4`. Footer → `flex-col md:flex-row`.

ب) **Login/Register** (`login.tsx`, `register.tsx`, `auth.tsx`): البطاقة `w-full max-w-md mx-4` بدل عرض ثابت.

ج) **Dashboards** (`index.tsx` SAIS + `portal.index.tsx`): KPI grid → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. Charts wrapper → `grid-cols-1 lg:grid-cols-2`. Action-required cards (`ActionRequiredCards`, `RequestsNeedingAction`) → `flex-col md:flex-row` أو `grid-cols-1 md:grid-cols-2`.

د) **Request inbox** (`requests.index.tsx`, `portal.requests.index.tsx`):
- التفاف الجدول الحالي بـ `<div className="hidden md:block">`.
- إضافة قائمة بطاقات `<div className="md:hidden space-y-3">` تعرض كل طلب كـ `<Card>` (رقم مرجعي، عنوان، شركة، حالة badge، تاريخ، رابط للتفاصيل).

هـ) **Request detail — Assignment chain** (`requests.$id.tsx` + `portal.requests.$id.tsx`):
- Wrapper visualizer: `flex flex-col md:flex-row md:items-center gap-2 md:gap-3`.
- الأسهم بين العقد: `rotate-90 md:rotate-0` (أو إخفاء/إظهار بأيقونة سفلية للموبايل).

و) **Sidebar** (`AppSidebar.tsx` / `AppShell.tsx`): التحقق أن `SidebarTrigger` (هامبرغر) ظاهر على الموبايل في TopBar وأن السايدبار في وضع `offcanvas`/`sheet` لا يطغى على المحتوى.

ز) **Dialogs**: في `ConfirmDialog` و Dialogs الإسناد الجديدة → `max-w-[calc(100vw-2rem)] sm:max-w-lg`.

## 5) فوتر Landing
أتحقق من فوتر `landing.tsx` ويحوي:
- شعار + اسم الهيئة
- روابط سريعة: عن الهيئة / الخدمات / تواصل معنا (anchors داخل الصفحة)
- اتصال: `920001234` و `info@sais.gov.sa`
- "© 2026 الهيئة العليا للأمن الصناعي — جميع الحقوق محفوظة"
- "مبادرة من وزارة الداخلية"
- 3 أيقونات تواصل اجتماعي (Twitter/LinkedIn/YouTube من lucide) كروابط `#`
- التنسيق: `grid-cols-1 md:grid-cols-4` على الموبايل stack عمودي

أضيف ما ينقص من ترجمات (`assign_to_staff_dialog_title`, `staff_member`, `notes_optional`, إلخ) إلى `src/i18n/translations.ts` إن لم تكن موجودة.

## ملاحظات تقنية
- لا تغييرات على المتجر — `assignToStaff` موجود من المرحلة السابقة.
- لا تبعيات جديدة — كل المكوّنات (`Dialog`, `Select`, `Textarea`, `Badge`) موجودة في `src/components/ui/`.
- بعد الانتهاء أتحقق من البناء وأقف هنا بانتظار المرحلة E.
