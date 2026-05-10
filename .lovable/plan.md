## استكمال المرحلة A — ربط الصفحات

### اكتشاف هام
العلاقة المخزّنة في الكود هي `request.relatedProjectId` (وليس `project.relatedRequestId`). إذن للحصول على الطلب المرتبط بمشروع نستخدم:
```ts
const relatedRequest = requests.find(r => r.relatedProjectId === project.id);
```

---

### 1) `src/routes/projects.$id.tsx` (واجهة الهيئة)
- جلب `requests` من `useAppStore`، حساب `relatedRequest` بالطريقة أعلاه.
- إضافة شريط فوق `<Tabs>` (تحت `<header>`) إذا `relatedRequest` موجود:
  - `<Link to="/requests/$id" params={{ id: relatedRequest.id }}>` يحتوي `Badge` بلون primary + أيقونة `ExternalLink` + النص: `الطلب المرتبط: {relatedRequest.ref}`.

### 2) `src/routes/portal.projects.$id.tsx` (واجهة المنشأة)
- نفس المنطق، الرابط `/portal/requests/$id`.

### 3) `src/routes/companies.$id.tsx`
- إضافة قسم جديد **بعد قسم "المشاريع النشطة"** بعنوان: `الطلبات النشطة (n)`.
- فلترة: `requests.filter(r => r.companyId === company.id)`.
- جدول مصغّر (Card يحتوي `<table>` بسيطة) بأعمدة: المرجع، العنوان، النوع، الحالة (`StatusBadge` أو chip ملوّن)، الإدارة الحالية.
- كل صف ملفوف بـ `<Link to="/requests/$id" params={{ id: r.id }}>` مع hover.
- استخدام `requestTypeLabel`/`departmentLabel` من `@/data/requests` للعرض بالعربي.

### 4) `src/data/notifications.ts`
- تصحيح روابط الإشعارات المتعلّقة بالطلبات لتشير لصفحات الطلبات بدل المشاريع:
  - **`n7`** (مطلوب مستندات إضافية — توسعة رأس تنورة): `/portal/projects/p1` → `/portal/requests/r1` (لأن r1 مرتبط بـ p1 و r2 مرتبط بـ p2/سابك).
  - **`n12`** (تم استلام تقديمكم — رقم المرجع…): `/portal/projects/p6` → `/portal/requests/r1` ومحدّث النص للإشارة لـ REQ-0001 (أو نُبقيه على المشروع لأنه إشعار مرحلة، أُبقيه مرتبط بالمشروع — لكن إن أردت يستهدف طلب فعلي، تحويله لطلب أرامكو).
- باقي إشعارات المشاريع تبقى كما هي (روابطها صحيحة).
- `NotificationsList.tsx` يستخدم `<Link to={n.linkTo}>` مباشرة، فالضغط ينقل تلقائياً للوجهة الصحيحة. لا تغيير في الـ component.

### 5) `src/components/tasks/TaskDetailSheet.tsx`
- جلب `requests` من المتجر.
- حساب `relatedRequest = requests.find(r => r.relatedProjectId === task.projectId)`.
- إذا موجود، إضافة سطر **تحت سطر المشروع**:
  - `<Link to="/requests/$id" params={{ id: relatedRequest.id }}>` بصيغة: `الطلب المرتبط: {relatedRequest.ref}` بلون secondary مع underline على الـ hover وأيقونة `ExternalLink` صغيرة.

### 6) قائمة التحقق النهائية
بعد التنفيذ سأمشي يدوياً على المسارات التالية وأبلّغك بالنتيجة:
- `/projects/p1` → الضغط على شارة "الطلب المرتبط: REQ-0001" → `/requests/r1` ✓
- `/portal/projects/p1` → نفس الشيء → `/portal/requests/r1` ✓
- `/companies/aramco` → جدول الطلبات → صف r1 → `/requests/r1` ✓
- `/notifications` → ضغط n7 → `/portal/requests/r1` ✓
- `/tasks` → فتح مهمة على p1 → رابط الطلب → `/requests/r1` ✓

### الملفات المعدّلة
- `src/routes/projects.$id.tsx`
- `src/routes/portal.projects.$id.tsx`
- `src/routes/companies.$id.tsx`
- `src/data/notifications.ts`
- `src/components/tasks/TaskDetailSheet.tsx`

لا تغييرات في منطق الأعمال (`appStore`) ولا إنشاء ملفات جديدة.