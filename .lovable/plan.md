## الهدف
جعل المنصة تتمحور حول **الطلبات** بدل المشاريع. توحيد الـ Sidebar، إعادة بناء اللوحتين، ربط كل صفحة بالأخرى، وإزالة الطرق المسدودة.

## ملاحظة حول حالات الطلب
الكود يستخدم: `submitted | in_review | additional_docs | escalated | approved | rejected | returned`. سنرسم الخريطة كالتالي:
- "جديد (تحتاج إسناد)" = `submitted`
- "قيد المراجعة / مسند" = `in_review`
- "بانتظار رد المنشأة" = `additional_docs`
- "مصعّد" = `escalated`، "مُعاد" = `returned`

---

## 1) شريط جانبي للمنشأة (AppSidebar.tsx)
حذف "مشاريعنا" و"تقديم جديد" من `companyNav`. الترتيب النهائي:
لوحة المعلومات → /portal · طلباتي → /portal/requests · المتطلبات → /portal/requirements · الإشعارات → /portal/notifications · المساعدة → /portal/help

إبقاء روت `/portal/projects` يعمل (بدون رابط). تحويل `/portal/submissions/new` → إعادة توجيه إلى `/portal/requests/new` (تعديل ملف الروت ليستخدم `<Navigate to="/portal/requests/new" />`).

## 2) لوحة المنشأة `/portal` (portal.index.tsx)
ترتيب جديد:
1. **WelcomeBanner** (كما هو)
2. **ActionRequiredCards** — إعادة كتابة كاملة: مصدر البيانات `requests` لـ companyId="aramco" بحالة `additional_docs` فقط. كل بطاقة: العنوان + الـ ref + ملاحظة آخر إدخال في chain + زر "الرد وإرفاق المستندات" → `/portal/requests/$id`. حالة فارغة خضراء.
3. **ActiveRequestsSection** — تحويلها لجدول مدمج بدل الكروت. أعمدة: الرقم، العنوان، نوع، حالة، الإدارة الحالية، آخر تحديث. الصف بأكمله قابل للنقر → `/portal/requests/$id`. تصفية: استبعاد `approved` و`rejected`. زر "تقديم طلب جديد +" + رابط "عرض الكل" → `/portal/requests`.
4. **RecentUpdatesTimeline** — آخر 5 عناصر؛ كل عنصر يلفّه `<Link to="/portal/requests/$id">` عند توفر `linkTo`، وإلا للوحة.

حذف `MyProjectsGrid` و`ComplianceScoreWidget` من اللوحة (إبقاء الملفات).

## 3) لوحة الهيئة `/` (routes/index.tsx + KpiCards)
إعادة كتابة `KpiCards.tsx` لتحسب من `requests`:
- إجمالي النشطة (status ≠ approved/rejected)
- جديدة تحتاج إسناد (`status === "submitted"`) — لون warning بارز
- قيد المراجعة (`in_review`)
- بانتظار رد المنشأة (`additional_docs`)
- معتمدة (إجمالي)
- نسبة الإنجاز = approved / (approved+rejected) × 100

ملف جديد `src/components/dashboard/RequestsNeedingAction.tsx`: يعرض كروت لطلبات `submitted` مع ref/title/company/type/priority/receivedAt + زر "إسناد" → `/requests/$id`.

ملف جديد `src/components/dashboard/RequestsByStatusDonut.tsx` (Recharts PieChart) و`RequestsByDepartmentBar.tsx` (BarChart أفقي) — مشتقّان من store.

تعديل `routes/index.tsx`:
```text
KpiCards
RequestsNeedingAction
[Donut حسب الحالة] [Bar حسب الإدارة]
ActivityFeed (يربط لـ /requests/$id عبر linkTo إن وُجد)
[قسم ثانوي قابل للطي:] StagePipeline + SectorDonut + OverdueTable
```
استخدام `<details>` بسيط لقابلية الطي.

## 4) `portal.requests.$id.tsx` — عرض حسب الحالة
إضافة Breadcrumb: الرئيسية > طلباتي > REF.

كتلة "حسب الحالة" أعلى المحتوى (بعد العنوان قبل الكروت):
- `submitted | in_review | escalated`: بطاقة info "التقديم قيد المراجعة لدى الهيئة — سيتم إشعاركم..." + ملخص chain.
- `additional_docs`: إبراز خطاب SAIS الأخير + منطقة رفع مستندات + زر "إرسال الرد" يستدعي `addRequestDocument` + `addRequestComment(visibility:"external")` ثم تحديث الحالة لـ `in_review` (دالة جديدة `respondToAdditionalDocs(id)` في store تضيف entry للـ chain) + toast + addNotification(forRole:"sais").
- `approved`: بانر نجاح أخضر + زر "تحميل خطاب الموافقة" (يفتح أحدث letter من نوع approval ويطبع).
- `rejected`: بانر أحمر + عرض خطاب الرفض + زر "تقديم طلب جديد" → `/portal/requests/new`.
- `returned`: مماثل لـ additional_docs مع نص مختلف.

إبقاء التبويبات (الخطابات/المستندات/الرسائل).

## 5) `requests.$id.tsx` — تحديث في المكان
الدوال الحالية (`assignRequest`, إلخ) تستخدم `set` على الـ store، فإعادة الـ render تحدث تلقائياً بدون تنقّل. التحقق: لا توجد أي `navigate(...)` بعد الإجراءات داخل هذا الملف، فقط `toast`. نضيف `addNotification(forRole:"company", linkTo:'/portal/requests/'+id)` بعد كل من: assignRequest، requestAdditionalDocs، approveRequest، rejectRequest (داخل دوال الـ store).

## 6) ربط المشاريع بالطلبات
- `routes/projects.$id.tsx`: تحت العنوان، إن وُجد طلب حيث `relatedProjectId === project.id`، عرض شريحة "الطلب المرتبط: {ref}" → `/requests/$id`.
- `routes/portal.projects.$id.tsx`: نفس الفكرة → `/portal/requests/$id`.
- `routes/companies.$id.tsx`: قسم جديد "الطلبات النشطة" قبل أو بعد المشاريع، جدول صغير، الصف ينقل إلى `/requests/$id`.
- `TaskDetailSheet.tsx`: لا يوجد ربط طلب-مهمة في الـ schema حالياً → نتجاهلها هذه المرحلة (يمكن ذكرها في ملاحظة، بدون تعديل).

## 7) إصلاح روابط الإشعارات (data/notifications.ts)
إعادة كتابة `linkTo` للإشعارات الموجودة لتشير إلى طلبات حقيقية حيث منطقي:
- n7 (مستندات إضافية أرامكو) → `/portal/requests/r2`-style → سننشئ بدلاً من ذلك إشعار مرتبط بطلب أرامكو فعلي (`r1`). سنعدّل linkTo لإشعارات أرامكو لتفتح طلبات أرامكو الموجودة، وإشعارات SAIS لتفتح `/requests/<id>` بدل `/projects/<id>` حيث ينطبق.

## 8) شاشة نجاح طلب جديد
في `portal.requests.new.tsx`: تخزين `id` المُنشأ (يحتاج تعديل `createRequest` في الـ store ليرجع `{id, ref}` بدل `ref` فقط، أو إضافة دالة `getRequestByRef`). الأبسط: تعديل `createRequest` ليرجع الـ id، وحفظ كل من `createdId` و`createdRef` في الـ state. الأزرار:
- "متابعة الطلب" → `<Link to="/portal/requests/$id" params={{id: createdId}}>`
- "العودة للرئيسية" → `<Link to="/portal">`

## 9) المتطلبات → الطلبات
في أسفل `routes/portal.requirements.tsx` إضافة بطاقة CTA: "جاهز؟ قدّم طلبك الآن" → `/portal/requests/new`.

## 10) فحص وتحقق
بعد التعديلات: تشغيل بناء، ثم فتح المعاينة والتحقق سريعاً من المسارات الرئيسية (sidebar, لوحة المنشأة، تفاصيل طلب additional_docs، تنفيذ إسناد على طلب submitted، شاشة النجاح).

---

### ملفات ستُعدَّل
- src/components/layout/AppSidebar.tsx
- src/routes/portal.submissions.new.tsx (تحويل لـ Navigate)
- src/routes/portal.index.tsx
- src/components/portal/ActionRequiredCards.tsx
- src/components/portal/ActiveRequestsSection.tsx
- src/components/portal/RecentUpdatesTimeline.tsx
- src/routes/index.tsx
- src/components/dashboard/KpiCards.tsx
- src/components/dashboard/ActivityFeed.tsx (روابط)
- src/routes/portal.requests.$id.tsx
- src/routes/portal.requests.new.tsx
- src/routes/projects.$id.tsx
- src/routes/portal.projects.$id.tsx
- src/routes/companies.$id.tsx
- src/routes/portal.requirements.tsx
- src/store/appStore.ts (إضافة `respondToAdditionalDocs`، تعديل `createRequest` ليرجع id، إضافة notifications للمنشأة عند الإجراءات)
- src/data/notifications.ts (تصحيح linkTo)

### ملفات جديدة
- src/components/dashboard/RequestsNeedingAction.tsx
- src/components/dashboard/RequestsByStatusDonut.tsx
- src/components/dashboard/RequestsByDepartmentBar.tsx

عند إكمال التعديلات سأتوقف هنا (المرحلة A) قبل الانتقال للمرحلة B.
