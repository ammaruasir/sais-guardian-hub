## المرحلة B — تفعيل الوضع الداكن

### ملاحظة هامة
المتجر يحتوي بالفعل على `settings.themeMode: "light" | "dark" | "auto"` (في `src/data/admin.ts`). سأستخدم الحقل الموجود بدل إضافة `theme` جديد — `auto` تكافئ `system`. متغيّرات `.dark` موجودة بالفعل في `src/styles.css`.

---

### 1) Hook لتطبيق الثيم — `src/hooks/useTheme.ts` (جديد)
- يقرأ `settings.themeMode` من المتجر.
- `applyTheme(mode)`:
  - `light` → إزالة `.dark` من `document.documentElement`.
  - `dark` → إضافة `.dark`.
  - `auto` → فحص `window.matchMedia("(prefers-color-scheme: dark)")` وتطبيق النتيجة.
- `useEffect` يطبّق الثيم عند تغيير `themeMode` ويُسجّل listener للـ matchMedia عند `auto`.
- إرجاع `{ themeMode, resolvedTheme, setTheme }` حيث `setTheme(m)` يستدعي `updateSettings({ themeMode: m })`.

### 2) تركيب الـ hook في الـ AppShell
- استدعاء `useTheme()` مرة واحدة داخل `src/components/layout/AppShell.tsx` ليطبّق الثيم على كل الصفحات الداخلية.
- وأيضاً داخل `src/routes/landing.tsx` و`src/routes/login.tsx` (صفحات بدون AppShell).
- بديل أنظف: استدعاؤه في `src/routes/__root.tsx` ليُطبَّق على كل التطبيق دفعة واحدة. **سأستخدم `__root.tsx`**.
- إضافة `transition-colors duration-200` على `<html>` عبر CSS في `styles.css` (لأن `<html>` لا نملكه عبر JSX في TanStack Start بسهولة — سأضيف انتقال على `body` و`html` في `styles.css`).

### 3) زر التبديل في TopBar — `src/components/layout/TopBar.tsx`
- إضافة `<Button variant="ghost" size="icon">` بجانب جرس الإشعارات.
- يعرض `Moon` في الوضع الفاتح و`Sun` في الوضع الداكن.
- النقر: إذا `resolvedTheme === "dark"` → `setTheme("light")`، وإلا `setTheme("dark")`.
- `Tooltip` بنص "الوضع الداكن"/"الوضع الفاتح".

### 4) زر تبديل في Landing — `src/routes/landing.tsx`
- إضافة نفس الزر في شريط التنقل العلوي (الجهة اليسرى من الـ nav في RTL → `me-auto` أو ضمن مجموعة الأزرار).

### 5) ضبط الألوان في Landing & Login
- **`landing.tsx`**: استبدال أي `bg-white`/`text-black` ثابتة بـ `bg-card`/`bg-background`/`text-foreground`. تعديل تدرّج الـ Hero ليستخدم `dark:from-*` و`dark:to-*` (تدرّج أغمق رمادي/كحلي عميق). بطاقات الخدمات → `bg-card`. قسم الإحصاءات والـ Footer → `bg-muted`/`bg-card`.
- **`login.tsx`**: التأكد أن البطاقة تستخدم `bg-card`، الحقول `border-input`، وزر نفاذ يحتفظ بألوانه.

### 6) ربط تبويب المظهر — `src/routes/admin.settings.tsx` (السطر 567-581)
- الـ `RadioGroup` الموجود يستخدم `update({ themeMode: ... })`. مع الـ hook في `__root.tsx` التغيير سيُطبَّق فوراً (المتجر يبثّ التغيير → useEffect يطبّق `.dark`).
- لا يحتاج تغيير إضافي — يكفي أن الـ store-update فوري والـ hook يستجيب. زر "حفظ التغييرات" يبقى لباقي الإعدادات.

### 7) إصلاح الرسوم (Recharts)
الملفات: `SectorDonut.tsx`, `StagePipeline.tsx`, `RequestsByStatusDonut.tsx`, `RequestsByDepartmentBar.tsx`.
- `XAxis`/`YAxis tick={{ fill: "hsl(var(--muted-foreground))" }}` — استبدال أي `var(--muted-foreground)` المباشر بـ `hsl(...)` إذا لزم (مع `oklch` نستخدم `var(--muted-foreground)` مباشرة، يعمل).
- `Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}`.
- `CartesianGrid stroke="var(--border)"` إذا موجود.
- `Legend` → `wrapperStyle={{ color: "var(--foreground)" }}`.

### 8) فحص شامل للصفحات في الوضع الداكن
بعد التطبيق، سأمر على المسارات الرئيسية (Landing, Login, /, /requests, /requests/$id, /projects, /projects/$id, /companies/$id, /tasks, /notifications, /admin/users, /admin/settings, /admin/audit, /portal, /portal/requests, /portal/requests/$id, /portal/requirements) وألتقط لقطات في الوضع الداكن، وأصحّح أي:
- نصوص ثابتة `text-black`/`text-white` → `text-foreground`.
- خلفيات ثابتة `bg-white`/`bg-gray-50` → `bg-card`/`bg-muted`.
- حدود ثابتة → `border-border`.
- خطاب SAIS (`LetterTemplate.tsx`) **يبقى أبيض** — لا تغيير.

### 9) تحسينات إضافية
- Toaster (`<Toaster />` من sonner): إضافة `theme={resolvedTheme}` إذا الـ Sonner يدعمها (يدعم).
- إضافة `transition-colors` على `body` في `styles.css`.

---

### الملفات المعدّلة/الجديدة
**جديد:**
- `src/hooks/useTheme.ts`

**معدّل:**
- `src/routes/__root.tsx` (تركيب useTheme)
- `src/components/layout/TopBar.tsx` (زر التبديل + Tooltip)
- `src/routes/landing.tsx` (زر التبديل + dark variants)
- `src/routes/login.tsx` (dark variants)
- `src/styles.css` (transition-colors)
- `src/components/dashboard/SectorDonut.tsx`
- `src/components/dashboard/StagePipeline.tsx`
- `src/components/dashboard/RequestsByStatusDonut.tsx`
- `src/components/dashboard/RequestsByDepartmentBar.tsx`
- أي ملف يستخدم ألوان ثابتة `bg-white`/`text-black`/`text-gray-*` يُعدَّل أثناء جولة الفحص (قائمة كاملة بعد المسح، متوقع: بطاقات Landing، KPI cards، بعض جداول الطلبات/المنشآت).

### قائمة التحقق النهائية
- [ ] زر القمر/الشمس في TopBar يبدّل الثيم فوراً.
- [ ] زر القمر/الشمس في Landing يعمل.
- [ ] /admin/settings → تغيير الراديو يطبّق فوراً.
- [ ] جميع الصفحات الرئيسية مقروءة بدون نص أبيض على أبيض.
- [ ] الرسوم البيانية: محاور وtooltip مقروءة.
- [ ] خطاب SAIS يظل بخلفية بيضاء.
- [ ] Toasts مقروءة.
- [ ] الديالوجات والنماذج مقروءة بحدود واضحة.