import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/layout/TopBar";
import {
  Shield,
  FolderPlus,
  Search,
  ClipboardList,
  Users,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Lock,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import logo from "@/assets/logo.svg";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "منصة الخدمات الرقمية — الهيئة العليا للأمن الصناعي" },
      {
        name: "description",
        content:
          "البوابة الإلكترونية للهيئة العليا للأمن الصناعي لتقديم الطلبات ومتابعة الموافقات والاطلاع على المتطلبات التنظيمية.",
      },
    ],
  }),
  component: LandingPage,
});

const services = [
  {
    icon: FolderPlus,
    title: "تقديم طلبات المشاريع",
    desc: "تقديم طلبات الموافقة على المشاريع الصناعية ومتابعة حالتها",
  },
  {
    icon: Search,
    title: "متابعة الطلبات",
    desc: "الاطلاع على حالة طلباتكم ومراحل المراجعة",
  },
  {
    icon: ClipboardList,
    title: "المتطلبات التنظيمية",
    desc: "استعراض المتطلبات والنماذج المطلوبة لكل نوع من الطلبات",
  },
  {
    icon: Users,
    title: "الاستشاريون المعتمدون",
    desc: "قائمة الاستشاريين المعتمدين من الهيئة",
  },
];

const stats = [
  { value: "+2,500", label: "طلب تمت معالجته" },
  { value: "+350", label: "منشأة مسجلة" },
  { value: "94%", label: "نسبة إنجاز الطلبات" },
  { value: "7 أيام", label: "متوسط مدة المعالجة" },
];

function LandingPage() {
  const { user, loading } = useAuth();
  const mockAuthed = useAppStore((s) => s.mockAuth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (user || mockAuthed)) navigate({ to: "/" });
  }, [user, mockAuthed, loading, navigate]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      {/* Top utility bar — Saudi flag green stripe */}
      <div className="bg-[#006c35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] md:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-4 rounded-sm bg-white/90" />
            <span>المملكة العربية السعودية</span>
            <span className="hidden text-white/70 md:inline">— موقع حكومي رسمي</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:underline">English</button>
            <span className="text-white/40">|</span>
            <button className="font-semibold">عربي</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#006c35]/5">
              <img src={logo} alt="SAIS" className="h-10 w-10" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900 md:text-base">
                الهيئة العليا للأمن الصناعي
              </div>
              <div className="text-[11px] text-slate-500 md:text-xs">
                Supreme Authority for Industrial Security
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-700 lg:flex">
            <a href="#services" className="hover:text-[#006c35]">الخدمات</a>
            <a href="#stats" className="hover:text-[#006c35]">إحصائيات</a>
            <a href="#about" className="hover:text-[#006c35]">عن الهيئة</a>
            <a href="#contact" className="hover:text-[#006c35]">تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Vision 2030 placeholder badge */}
            <div className="hidden items-center gap-1.5 rounded border border-slate-200 px-2 py-1 text-[10px] text-slate-600 md:flex">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#006c35] to-[#83bf3f]" />
              <div className="leading-none">
                <div className="font-semibold">رؤية 2030</div>
                <div className="text-[8px] text-slate-400">Vision 2030</div>
              </div>
            </div>
            <ThemeToggleButton />
            <Link to="/login">
              <Button className="gap-2 bg-[#006c35] text-white hover:bg-[#005528]">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-[#0b3a2c] via-[#0e4a37] to-[#103e57] text-white">
        {/* Subtle pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px, 60px 60px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              <Shield className="h-3.5 w-3.5" />
              بوابة رسمية معتمدة
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              منصة الخدمات الرقمية
            </h1>
            <div className="mt-2 text-lg text-white/80 md:text-2xl">
              الهيئة العليا للأمن الصناعي
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
              بوابتكم الإلكترونية لتقديم الطلبات ومتابعة الموافقات والاطلاع على المتطلبات
              التنظيمية، بأعلى معايير الأمان والموثوقية المعتمدة من الجهات الرقابية.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-[#0b3a2c] hover:bg-white/90"
                >
                  تسجيل الدخول
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("services")}
                className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                تعرف على خدماتنا
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hero card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">دخول آمن ومشفر</div>
                  <div className="text-xs text-white/60">متوافق مع ضوابط NCA</div>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-white/85">
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-white/60">حالة المنصة</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    تعمل
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">الإصدار</span>
                  <span>v2.4.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">آخر تحديث</span>
                  <span>1447/10/12 هـ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#006c35]">
              خدماتنا
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              ماذا تقدم لك المنصة
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              مجموعة متكاملة من الخدمات الرقمية لتسهيل تعاملاتكم مع الهيئة.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#006c35]/40 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#006c35]/10 text-[#006c35] transition group-hover:bg-[#006c35] group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-8 text-center">
                <div className="text-3xl font-bold text-[#006c35] md:text-4xl">{s.value}</div>
                <div className="mt-2 text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About strip */}
      <section
        id="about"
        className="bg-gradient-to-l from-[#006c35] to-[#005528] py-14 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div>
            <h3 className="text-xl font-bold md:text-2xl">جاهز للبدء؟</h3>
            <p className="mt-1 text-sm text-white/80">
              سجّل دخولك الآن لتقديم طلبك ومتابعة معاملاتك مع الهيئة.
            </p>
          </div>
          <Link to="/login">
            <Button size="lg" className="gap-2 bg-white text-[#005528] hover:bg-white/90">
              ابدأ الآن
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="SAIS" className="h-10 w-10" />
              <div className="leading-tight">
                <div className="text-sm font-bold text-white">الهيئة العليا للأمن الصناعي</div>
                <div className="text-[11px] text-slate-400">SAIS</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              مبادرة من وزارة الداخلية — المملكة العربية السعودية
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">عن الهيئة</a></li>
              <li><a href="#services" className="hover:text-white">الخدمات</a></li>
              <li><a href="#contact" className="hover:text-white">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-white">الأنظمة والتعليمات</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#83bf3f]" />
                <span dir="ltr">920001234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#83bf3f]" />
                <span dir="ltr">info@sais.gov.sa</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">تابعنا</h4>
            <div className="flex items-center gap-2">
              {[Twitter, Linkedin, Youtube].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 hover:border-[#83bf3f] hover:text-white"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 md:flex-row md:px-6">
            <div>جميع الحقوق محفوظة © 2026 — الهيئة العليا للأمن الصناعي</div>
            <div>مبادرة من وزارة الداخلية</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
