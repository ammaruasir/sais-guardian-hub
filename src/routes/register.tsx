import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.svg";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "تسجيل منشأة جديدة — الهيئة العليا للأمن الصناعي" },
    ],
  }),
  component: RegisterPlaceholder,
});

function RegisterPlaceholder() {
  return (
    <div className="content-area min-h-screen bg-slate-50" dir="rtl">
      <div className="bg-[#006c35] py-1.5 text-center text-[11px] text-white">
        المملكة العربية السعودية — موقع حكومي رسمي
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-3">
            <img src={logo} alt="SAIS" className="h-10 w-10" />
            <div className="text-sm font-bold">الهيئة العليا للأمن الصناعي</div>
          </Link>
          <Link to="/login" className="text-sm text-slate-600 hover:text-[#006c35]">
            ← تسجيل الدخول
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#006c35]/10">
            <Building2 className="h-8 w-8 text-[#006c35]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">تسجيل منشأة جديدة</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            خدمة تسجيل المنشآت الصناعية الجديدة قيد التطوير حالياً. يرجى التواصل مع الهيئة
            على الرقم <span dir="ltr" className="font-mono">920001234</span> أو عبر البريد
            <span dir="ltr" className="font-mono"> info@sais.gov.sa</span> لاستكمال إجراءات
            التسجيل.
          </p>
          <Link to="/login" className="inline-block">
            <Button className="mt-6 gap-2 bg-[#006c35] hover:bg-[#005528]">
              العودة إلى تسجيل الدخول
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
