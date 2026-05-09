## الهدف
استبدال الجزء العلوي الأيمن من الشريط الجانبي (الذي يحتوي حالياً على أيقونة بيضاء + نصّي «الهيئة العليا للأمن الصناعي» و«SAIS Platform») بصورة الشعار PNG المرفوعة كاملةً.

## الخطوات
1. نسخ الصورة المرفوعة إلى `src/assets/sais-logo.png`.
2. تعديل `src/components/layout/AppSidebar.tsx` ضمن `SidebarHeader`:
   - عند دور `sais`: استبدال المربع الأبيض + كتلة النصّين بصورة واحدة `<img src={saisLogo} alt="الهيئة العليا للأمن الصناعي - SAIS" />` تأخذ كامل عرض رأس الشريط الجانبي بارتفاع مناسب (~h-12) و`object-contain`.
   - في وضع طيّ الشريط (`group-data-[collapsible=icon]`) نُظهر أيقونة الشعار فقط بحجم مربّع صغير عبر إخفاء الصورة الكاملة وعرض نسخة مقصوصة/مصغّرة.
   - الإبقاء على عرض دور `company` كما هو دون تغيير.
3. إزالة `import logoUrl from "@/assets/logo.svg"` إن لم يعد مستخدماً.

## ملاحظات تقنية
- استيراد الصورة كـ ES module: `import saisLogo from "@/assets/sais-logo.png"`.
- لا تغييرات على `TopBar` أو على المنطق/المتجر.
- الحفاظ على RTL واستخدام الفئات المنطقية إن لزم.

## الملفات
- جديد: `src/assets/sais-logo.png`
- تعديل: `src/components/layout/AppSidebar.tsx`
