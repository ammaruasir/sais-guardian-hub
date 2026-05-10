# المرحلة C — تكملة: تصحيح سلوك اللغة + ترجمة الصفحات المتبقية

## الجزء 1 — تصحيح سلوك التبديل (Layout يبقى RTL دائماً)

### 1. تعديل `src/hooks/useApplySettings.ts`
- إزالة `root.dir = ...` (لا نلمس `dir` على `<html>` أبداً — يبقى `rtl`).
- إبقاء `root.lang = language`.
- استبدال منطق الـ class:
  ```ts
  root.classList.toggle("font-en", language === "en");
  root.classList.toggle("font-ar", language === "ar");
  document.body.classList.toggle("lang-en", language === "en");
  document.body.classList.toggle("lang-ar", language === "ar");
  ```

### 2. تعديل `src/components/layout/AppShell.tsx`
- إبقاء `dir="rtl"` على الـ wrapper (موجود حالياً — لا تغيير).
- إضافة `className="content-area"` على `<main>`.

### 3. تعديل `src/components/layout/AppSidebar.tsx`
- استبدال `side={isAr ? "right" : "left"}` بـ `side="right"` ثابت.
- النصوص تبقى تتبع `t()`.

### 4. تعديل `src/styles.css`
- استبدال كتلة `html.font-en` الحالية وإضافة `html.font-ar` صراحةً:
  ```css
  html.font-en { font-family: "Inter", "IBM Plex Sans Arabic", system-ui, sans-serif; }
  html.font-ar { font-family: "IBM Plex Sans Arabic", "Inter", system-ui, sans-serif; }
  ```
- إضافة قواعد الـ content-area:
  ```css
  body.lang-ar .content-area { text-align: right; }
  body.lang-en .content-area { text-align: left; }
  body.lang-en .content-area :is(h1,h2,h3,h4,p,span,label,li,td,th,dt,dd) { text-align: left; direction: ltr; }
  body.lang-en .content-area table { direction: ltr; }
  /* استثناءات: الأرقام والعناصر اللي عندها dir صريح ما تتأثر */
  body.lang-en .content-area [dir="rtl"] { direction: rtl; text-align: right; }
  ```
- ملاحظة: السايدبار و TopBar خارج `.content-area` فما يتأثرون.

### 5. صفحات بدون AppShell (Landing, Login, Register, Auth)
- لفّ المحتوى الرئيسي بـ `<div className="content-area">` لتطبيق نفس قاعدة المحاذاة.
- Layout يبقى RTL (الـ root `<html dir="rtl">` لا يتغير).

### 6. سلوك TopBar
- لا تغيير على الـ layout (يبقى RTL — `ms-auto`, `-end-1` تعمل صح).
- النصوص فقط تتغير عبر `t()`.

---

## الجزء 2 — ترجمة الصفحات المتبقية

سيتم استبدال السلاسل العربية المباشرة بـ `t("key")` من `useT()`. كل المفاتيح موجودة في `src/i18n/translations.ts`.

### Routes (SAIS)
- `src/routes/requests.$id.tsx` — العنوان، breadcrumb، أزرار الإجراءات (assign_to_dept, request_docs, return_to_company, escalate, final_approval, reject)، التبويبات (tab_documents, tab_comments, tab_assignment_log, tab_letters)، رابط back_to_list، badges الحالة.
- `src/routes/projects.index.tsx` + `projects.$id.tsx` — العنوان، أعمدة، add_project, edit, delete_action, related_request.
- `src/routes/tasks.tsx` — أعمدة الكانبان والأزرار.
- `src/routes/companies.tsx` + `companies.$id.tsx` — العنوان، أعمدة، add_company, active_requests.
- `src/routes/consultants.tsx` — العنوان، أعمدة، add_consultant.
- `src/routes/reports.tsx` — عناوين الشارتات.
- `src/routes/notifications.tsx` — mark_all_read, notifications.
- `src/routes/admin.users.tsx` — أعمدة (col_user, col_role, col_dept), add_user, search_placeholder.
- `src/routes/admin.roles.tsx` — تبويبات (permissions_matrix, roles_tab), add_role.
- `src/routes/admin.audit.tsx` — العنوان، أعمدة، فلاتر، refresh.
- `src/routes/admin.settings.tsx` — عناوين التبويبات (settings_general/security/...), save_changes.

### Routes (Portal)
- `src/routes/portal.index.tsx` — action_required, no_actions, active_requests, view_all, new_request_short, recent_updates.
- `src/routes/portal.requests.index.tsx` — تبويبات (tab_all/active/waiting/completed/rejected)، أعمدة، new_request_short, search_placeholder.
- `src/routes/portal.requests.$id.tsx` — breadcrumb، respond_attach, send_response, download_letter, submit_new، تبويبات، back_to_list.
- `src/routes/portal.requests.new.tsx` — wizard buttons (next, previous, submit, cancel)، شاشة النجاح (toast_submitted, track_request, back_to_home).
- `src/routes/portal.notifications.tsx` — mark_all_read.
- `src/routes/portal.help.tsx` — العنوان.
- `src/routes/portal.requirements.tsx` — العنوان + CTA `ready_submit`.

### Components مشتركة
- `src/components/common/ConfirmDialog.tsx` — confirm_delete_title, confirm_delete, confirm, cancel.
- `src/components/common/EmptyState.tsx` — يبقى يستلم `message` كـ prop؛ المسؤولية على الـ callers لتمرير `t("no_data")` إلخ.
- `src/components/layout/DemoBadge.tsx` — `t("poc_demo")`.
- جميع `toast.success("...")` المكتوبة بالعربي → `toast.success(t("toast_..."))`.

### أسماء الكيانات
استخدام `name(entity)` من `useT()` بدل `entity.nameAr` المباشر في:
- جدول `companies` + تفاصيل المنشأة.
- dropdown إدارات الإسناد في `requests.$id`.
- جدول الاستشاريين.
- اسم المنشأة في `requests.$id`, `requests.index`, `portal.requests.*`.

### المحتوى التجريبي (لا يُترجم)
- نصوص التعليقات، نصوص الخطابات (letter bodies)، أسماء الموظفين، notes في `chain` — تبقى بالعربي (محتوى تجريبي).

---

## الجزء 3 — التحقق
بعد التطبيق:
1. التبديل للإنجليزي: السايدبار يبقى يمين، نصوصه تصير EN.
2. المحتوى (جداول/بطاقات/عناوين) يصير محاذاته يسار.
3. الجداول تُقرأ من اليسار لليمين.
4. التوست يطلع EN.
5. Landing/Login النص يتمحاذى يسار، اللوقو والتخطيط ما يتقلب.
6. الرجوع للعربي: كل شيء يعود + محاذاة يمين.

⏸️ سأتوقف بعد التنفيذ وأعرض النتيجة قبل المرحلة D.
