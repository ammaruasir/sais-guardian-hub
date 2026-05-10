## 1. كروت KPI قابلة للضغط (Dashboard)

تحويل كل كرت في `KpiCards.tsx` إلى `<Link>` يوجّه إلى صفحة الطلبات مع فلتر مسبق:

| الكرت | الوجهة |
|---|---|
| الطلبات النشطة | `/requests?filter=active` |
| طلبات جديدة | `/requests?filter=new` (status=submitted) |
| قيد المراجعة | `/requests?filter=in_review` |
| بانتظار الرد | `/requests?filter=waiting` (additional_docs) |
| معتمدة | `/requests?filter=approved` |
| نسبة الإنجاز | `/reports` |

التعديلات:
- `KpiCards.tsx`: الـ `Card` يصير `<Link>` مع `hover:shadow-md`, `hover:border-primary/40`, `transition`, و focus ring للوصولية.
- `requests.index.tsx`: قراءة `search.filter` عبر `Route.useSearch()` وتطبيقه كقيمة افتراضية للفلتر، مع إظهار chip "تم الفلترة من اللوحة — مسح" أعلى الجدول.

## 2. تحليلات وشارتات إضافية بألوان الهيئة

اللوحة حالياً فيها: KPIs، Donut حسب الحالة، Bar حسب الإدارة، Activity Feed، (قسم كلاسيكي مطوي).
نضيف **قسم تحليلات** جديد بين الـ Donut/Bar و Activity Feed باسم "نظرة تحليلية" يحتوي:

أ) **Area Chart — تدفق الطلبات (آخر 6 أشهر)**: stacked area لـ (مُقدَّمة / معتمدة / مرفوضة) — ألوان `--chart-1` navy, `--chart-3` green, `--chart-5` red.

ب) **Radial/Gauge — متوسط زمن الإغلاق**: `RadialBarChart` يعرض متوسط الأيام مقابل SLA المستهدف، بلون teal.

ج) **Horizontal Bar — أعلى 5 منشآت بعدد الطلبات**: ألوان متدرجة من navy إلى teal.

د) **Heatmap-style Bar — توزّع الطلبات حسب أيام الأسبوع**: bar chart بسيط بلون secondary.

هـ) **Line Chart — مقارنة الواردة vs المغلقة شهرياً**: خطّان (navy + green) لإظهار الاتجاه.

كلها تُحسب من `useAppStore().requests` بدوال `useMemo` (لا بيانات وهمية مكررة، نشتق من نفس المخزن مع إضافة بسيطة لتاريخ افتراضي عند الحاجة).

**القالب اللوني المعتمد** (موجود في `styles.css`):
- chart-1 = navy `#1B3A5C` (الأساسي)
- chart-2 = teal `#0E918C`
- chart-3 = saudi green `#006C35`
- chart-4 = amber
- chart-5 = red
- + إضافة تدرّجين في `styles.css`: `--gradient-primary` (navy→teal) و `--gradient-success` (teal→green) لاستخدامها في خلفيات الكروت التحليلية ورؤوس الشارتات.

كل ChartCard موحّد الشكل (عنوان عربي + subtitle إنجليزي صغير، ارتفاع 280-300px، responsive grid `lg:grid-cols-2`).

## 3. السايدبار أبيض ليُظهر اللوقو كـ PNG شفاف

تحديث توكنات الـ sidebar في `src/styles.css`:

```css
:root {
  --sidebar: oklch(1 0 0);                          /* أبيض */
  --sidebar-foreground: oklch(0.25 0.04 250);       /* navy نص */
  --sidebar-primary: oklch(0.32 0.06 250);          /* navy */
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.96 0.01 250);           /* hover رمادي فاتح */
  --sidebar-accent-foreground: oklch(0.32 0.06 250);
  --sidebar-border: oklch(0.91 0.01 270);           /* border رمادي */
  --sidebar-ring: oklch(0.58 0.09 195);
}
```
مع نسخة dark تبقى داكنة كما هي.

تعديلات `AppSidebar.tsx`:
- إزالة الخلفية البيضاء حول اللوقو (`bg-white p-2`) — السايدبار نفسه أبيض الآن، فاللوقو الـ PNG يظهر طبيعي.
- تعديل لون الـ company portal logo placeholder ليتناسب (navy bg مع نص أبيض يبقى مناسب على أبيض).
- footer (© 2026 SAIS) يصير لونه `text-muted-foreground` بدل أبيض شفاف.

## 4. تنفيذ مرتب

1. تحديث `styles.css` (sidebar tokens + gradients).
2. تعديل `AppSidebar.tsx` (إزالة الخلفية البيضاء حول اللوقو).
3. تعديل `KpiCards.tsx` (Link wrapping + hover).
4. تعديل `requests.index.tsx` (قراءة search param + chip).
5. إنشاء `src/components/dashboard/AnalyticsSection.tsx` يحوي الشارتات الخمسة الجديدة.
6. إدراج `<AnalyticsSection />` في `src/routes/index.tsx` بعد قسم Donut/Bar.

## ملاحظات

- ما نلمس صفحة `/reports` (لها شارتات مستقلة).
- شارت dark mode مدعوم تلقائياً عبر `var(--chart-*)`.
- السايدبار الأبيض راح يحتاج تأكد بصري للحالة active (ستبقى navy bg مع نص أبيض — متوفّر في `sidebar-primary`).