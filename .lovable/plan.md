# Sub-Phase 8C — قوالب الخطابات الرسمية

## 1. نموذج البيانات (`src/store/appStore.ts` + `src/data/requests.ts`)

إضافة نوع `Letter`:
```ts
type LetterType = "additional_docs" | "approval" | "rejection" | "comments";
type LetterStatus = "draft" | "sent";

type Letter = {
  id: string;            // L-0001
  ref: string;           // SAIS/2026/0001
  requestId: string;
  type: LetterType;
  status: LetterStatus;
  subjectAr: string;
  addresseeAr: string;   // اسم المنشأة
  bodyIntroAr: string;
  items: string[];       // bullets للوثائق المطلوبة / شروط / أسباب
  commentsTable?: { doc: string; comment: string; status: string }[];
  closingAr: string;
  signatoryAr: string;   // اسم + المنصب
  signatoryTitleAr: string;
  hijriDate: string;
  gregorianDate: string;
  attachmentsCount: number;
  classified: boolean;   // شارة "سري"
  createdAt: string;
  sentAt?: string;
};
```

Actions: `createLetterDraft`, `updateLetter`, `sendLetter(id)` — يحدث حالة الطلب، يضيف `letterRef` للـ AssignmentEntry الحالي، يطلق Notification للشركة، ويحفظ سجل في الـ audit log الخاص بالطلب.

بيانات تجريبية: 3 خطابات حسب الموجز (additional_docs لـ REQ-0002، approval لـ REQ-0005، comments draft لـ REQ-0001).

## 2. مكوّن `LetterTemplate` المشترك

ملف: `src/components/letters/LetterTemplate.tsx`

تخطيط A4 جاهز للطباعة (`w-[210mm] min-h-[297mm]`)، خلفية بيضاء، خط عربي رسمي:

```text
┌──────────────────────────────────────────────┐
│  [شعار SAIS]   الهيئة السعودية للخدمات       │
│                وزارة الداخلية                 │  [سري] (شرطي)
├──────────────────────────────────────────────┤
│  الرقم: SAIS/2026/0001                       │
│  التاريخ: 1447/05/12 هـ                      │
│  المرفقات: 0                                 │
├──────────────────────────────────────────────┤
│  المكرم/ شركة …                              │
│  السلام عليكم ورحمة الله وبركاته،             │
│  الموضوع: …                                  │
│                                              │
│  [Body — حسب النوع]                          │
│                                              │
│  وتقبلوا تحياتنا،                             │
│         [ختم دائري]                          │
│         الاسم / المنصب / التوقيع              │
├──────────────────────────────────────────────┤
│  الرياض - المملكة العربية السعودية | sais.gov │
└──────────────────────────────────────────────┘
```

تبديل الـ body حسب `type`:
- **additional_docs**: مقدمة + قائمة نقطية بالمستندات الناقصة + بند مهلة 30 يوماً.
- **approval**: نص الموافقة + قائمة شروط اختيارية.
- **rejection**: عبارة اعتذار + قائمة الأسباب + بند إعادة التقديم.
- **comments**: مقدمة + جدول 4 أعمدة (م / المستند / التعليق / الحالة).

CSS طباعة مخصّص: `@media print` يخفي كل شيء عدا `#letter-print-area` ويزيل الهوامش الافتراضية.

## 3. `LetterComposerDialog`

ملف: `src/components/letters/LetterComposerDialog.tsx`

- يُفتح من Action Panel في `/requests/$id` عبر أزرار جديدة:
  - "طلب مستندات إضافية" → `additional_docs`
  - "إصدار قرار الموافقة" → `approval` (مفعّل فقط لقسم له `canFinalApprove`)
  - "إصدار قرار الرفض" → `rejection`
  - "إصدار خطاب ملاحظات" → `comments`
- Dialog واسع (`max-w-5xl`) مع Tabs:
  - **تحرير**: نموذج (موضوع، مقدمة، عناصر قائمة قابلة للإضافة/الحذف، خاتمة، اسم الموقّع، شارة "سري"). للنوع `comments` محرر صفوف الجدول.
  - **معاينة**: يعرض `LetterTemplate` بالقيم الحالية.
- الترويسة تُملأ تلقائياً (الرقم، التاريخ الهجري/الميلادي، المنشأة، الطلب).
- أزرار: **حفظ كمسودة** / **إرسال** / **طباعة** (يستدعي `window.print()` بعد عزل المعاينة).
- عند الإرسال: تحديث الطلب (للـ `additional_docs` يصبح الحالة `additional_docs`، للـ approval/rejection حالات نهائية)، إنشاء Notification للشركة، تسجيل دخول في Assignment Log.

## 4. تبويب الخطابات في صفحة الطلب (SAIS)

في `src/routes/requests.$id.tsx`:
- إضافة تبويب رابع **"الخطابات"** بجانب الموجودين.
- جدول: الرقم المرجعي، النوع (Badge ملوّن)، الموضوع، الحالة (مسودة/مُرسل)، التاريخ، إجراءات (عرض/طباعة، استئناف التحرير لو draft).
- زر "إنشاء خطاب جديد" يفتح قائمة منسدلة بالأنواع الأربعة.

## 5. تكامل بوابة الشركات

في `src/routes/portal.requests.$id.tsx`:
- تبويب **"الخطابات الرسمية"** يعرض قائمة الخطابات المُرسلة فقط (status === "sent").
- النقر يفتح Dialog قراءة فقط بـ `LetterTemplate` + زر طباعة.
- إذا كان الخطاب `additional_docs`: زر بارز **"الرد وإرفاق المستندات"** → يفتح نموذج رفع متعدد + تعليق → يضيف المستندات للطلب، يضيف تعليق خارجي تلقائي ("تم الرد على خطاب رقم …")، ويعيد حالة الطلب من `additional_docs` إلى `in_review`.

## 6. الإشعارات

استخدام نظام الإشعارات الموجود (`appStore.notifications`) لإطلاق:
- "تم إصدار خطاب رسمي بخصوص الطلب [ref]" عند الإرسال.
- "تم استلام رد الشركة على الخطاب [letterRef]" عند رد المنشأة.

## ملاحظات تقنية

- الكتابة بأسلوب RTL مع `ms-/me-/ps-/pe-/start-/end-` فقط.
- التاريخ الهجري: استخدام `Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura")`.
- ختم SAIS الدائري: SVG inline داخل `LetterTemplate` (دائرة بحدود مزدوجة + نص دائري + شعار صغير) لتجنب صور خارجية.
- الطباعة: `print:` utilities في Tailwind لإخفاء الـ AppShell والـ Dialog chrome وعرض الخطاب فقط على A4.
- لا تغييرات في قاعدة البيانات — كل البيانات داخل Zustand لتطابق نمط 8B.

⏸ سأتوقف بعد 8C لمراجعتك النهائية.
