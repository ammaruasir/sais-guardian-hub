import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldCheck,
  ClipboardCheck,
  FileSearch,
  Activity,
  Lock,
  Building2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import hero from "@/assets/landing-hero.jpg";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "منصة SAIS — الهيئة العليا للأمن الصناعي" },
      {
        name: "description",
        content:
          "البوابة الرسمية للهيئة العليا للأمن الصناعي: إدارة المشاريع، المراجعات، والامتثال لضوابط الأمن السيبراني الأساسية (NCA/ECC).",
      },
    ],
  }),
  component: LandingPage,
});

const pillars = [
  {
    icon: ClipboardCheck,
    title: "إدارة دورة حياة المشروع",
    desc: "تتبع المشاريع من التسجيل وحتى الاعتماد النهائي عبر خمس مراحل موحدة.",
  },
  {
    icon: FileSearch,
    title: "مراجعات فنية معتمدة",
    desc: "مراجعات متعددة الإدارات بقرارات موثقة ومرفقات فنية وسجل قرارات كامل.",
  },
  {
    icon: ShieldCheck,
    title: "امتثال NCA / ECC",
    desc: "ضوابط الأمن السيبراني الأساسية مدمجة في النظام مع لوحة امتثال حية.",
  },
  {
    icon: Activity,
    title: "سجل أحداث أمنية",
    desc: "مراقبة كاملة للنشاط الحساس والوصول والتغييرات لكل مستخدم.",
  },
];

const stats = [
  { value: "1,656+", label: "حدث أمني تم تتبعه" },
  { value: "98%", label: "موثوقية الخدمة" },
  { value: "5", label: "مراحل اعتماد قياسية" },
  { value: "24/7", label: "مراقبة مستمرة" },
];

const guarantees = [
  "تشفير الجلسات وقفل تلقائي بعد المحاولات الفاشلة",
  "صلاحيات دقيقة قائمة على الأدوار (RBAC)",
  "علامات مائية وحماية المحتوى الحساس",
  "تدقيق كامل لكل عملية على مستوى المستخدم",
];

function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white" dir="rtl">
      {/* Top bar */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SAIS" className="h-10 w-10" />
            <div className="leading-tight">
              <div className="text-sm font-bold">SAIS</div>
              <div className="text-[11px] text-white/60">الهيئة العليا للأمن الصناعي</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                تسجيل الدخول
              </Button>
            </Link>
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button className="bg-[#c9a84c] text-[#0a0f1f] hover:bg-[#d4b75c]">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${hero})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f]/40 via-[#0a0f1f]/70 to-[#0a0f1f]"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-1.5 text-xs text-[#c9a84c]">
            <Shield className="h-3.5 w-3.5" />
            البوابة الرسمية المعتمدة
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            منصة <span className="text-[#c9a84c]">الأمن الصناعي</span>
            <br className="hidden md:block" /> للمملكة العربية السعودية
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            منصة موحدة لإدارة المشاريع الصناعية، المراجعات الفنية، والامتثال لضوابط الأمن
            السيبراني الأساسية (ECC) الصادرة عن الهيئة الوطنية للأمن السيبراني.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button
                size="lg"
                className="gap-2 bg-[#c9a84c] text-[#0a0f1f] hover:bg-[#d4b75c]"
              >
                ابدأ الآن
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                دخول موظفي الهيئة
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#0a0f1f]/60 p-6">
                <div className="text-2xl font-bold text-[#c9a84c] md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-widest text-[#c9a84c]">
              قدرات المنصة
            </div>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              أربعة أعمدة لحوكمة الأمن الصناعي
            </h2>
            <p className="mt-3 text-sm text-white/60">
              نظام متكامل يربط المنشآت الصناعية بالجهة التنظيمية في تجربة واحدة.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#c9a84c]/40 hover:bg-white/[0.06]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] transition group-hover:bg-[#c9a84c]/20">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column: portal + security */}
      <section className="relative py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1e3a5f] to-[#0f1b3d] p-8">
            <Building2 className="h-10 w-10 text-[#c9a84c]" />
            <h3 className="mt-5 text-2xl font-bold">بوابة المنشآت الصناعية</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              مساحة مخصصة لكل منشأة لتقديم المشاريع، رفع المتطلبات الفنية، ومتابعة قرارات
              المراجعة لحظياً.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/80">
              {[
                "تقديم مرحلي بخمس مراحل قياسية",
                "رفع وتنظيم المستندات الفنية",
                "إشعارات فورية لقرارات المراجعة",
                "سجل كامل لكل المشاريع",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#c9a84c]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <Lock className="h-10 w-10 text-[#c9a84c]" />
            <h3 className="mt-5 text-2xl font-bold">أمان على مستوى الحكومة</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              مبنية وفق ضوابط الأمن السيبراني الأساسية (ECC) ومتطلبات الهيئة الوطنية للأمن
              السيبراني.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/80">
              {guarantees.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#c9a84c]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-3xl border border-[#c9a84c]/30 bg-gradient-to-br from-[#c9a84c]/15 via-[#1e3a5f]/30 to-[#0f1b3d] p-10 text-center md:p-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              ابدأ في إدارة مشاريعك بأمان اليوم
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
              انضم إلى المنشآت الصناعية الرائدة التي تستخدم منصة SAIS لإدارة الامتثال
              والمراجعات.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth" search={{ mode: "signup" }}>
                <Button
                  size="lg"
                  className="gap-2 bg-[#c9a84c] text-[#0a0f1f] hover:bg-[#d4b75c]"
                >
                  إنشاء حساب جديد
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-white/50 md:flex-row">
          <div>© {new Date().getFullYear()} الهيئة العليا للأمن الصناعي — SAIS</div>
          <div>المملكة العربية السعودية</div>
        </div>
      </footer>
    </div>
  );
}
