import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/layout/TopBar";
import { useT } from "@/hooks/useT";
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
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import vision2030 from "@/assets/vision-2030.png";
import type { TKey } from "@/i18n/translations";
import { usePageTitle } from "@/hooks/usePageTitle";

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

const services: { icon: typeof FolderPlus; titleKey: TKey; descKey: TKey }[] = [
  { icon: FolderPlus, titleKey: "service_submit", descKey: "service_submit_desc" },
  { icon: Search, titleKey: "service_track", descKey: "service_track_desc" },
  { icon: ClipboardList, titleKey: "service_reqs", descKey: "service_reqs_desc" },
  { icon: Users, titleKey: "service_consultants", descKey: "service_consultants_desc" },
];

function LandingPage() {
  const { user, loading } = useAuth();
  const mockAuthed = useAppStore((s) => s.mockAuth.isAuthenticated);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const navigate = useNavigate();
  const { t, isAr } = useT();
  usePageTitle(t("sais_name") + " — " + t("platform_name"));
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (!loading && (user || mockAuthed)) navigate({ to: "/" });
  }, [user, mockAuthed, loading, navigate]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "+2,500", label: t("stat_processed") },
    { value: "+350", label: t("stat_registered") },
    { value: "94%", label: t("stat_completion") },
    { value: `7 ${t("stat_days")}`, label: t("stat_avg_time") },
  ];

  return (
    <div className="content-area min-h-screen bg-white text-slate-900 dark:bg-background dark:text-foreground">
      {/* Top utility bar */}
      <div className="bg-[#006c35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] md:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-4 rounded-sm bg-white/90" />
            <span>{isAr ? "المملكة العربية السعودية" : "Kingdom of Saudi Arabia"}</span>
            <span className="hidden text-white/70 md:inline">
              — {isAr ? "موقع حكومي رسمي" : "Official Government Portal"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={isAr ? "hover:underline" : "font-semibold"}
            >
              English
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => setLanguage("ar")}
              className={isAr ? "font-semibold" : "hover:underline"}
            >
              عربي
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-border dark:bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#006c35]/5">
              <img src={logo} alt="SAIS" className="h-10 w-10" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900 md:text-base dark:text-foreground">
                {t("sais_name")}
              </div>
              <div className="text-[11px] text-slate-500 md:text-xs dark:text-muted-foreground">
                {isAr ? "Supreme Authority for Industrial Security" : t("platform_name")}
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-700 lg:flex dark:text-foreground/85">
            <a href="#services" className="hover:text-[#006c35]">
              {isAr ? "الخدمات" : "Services"}
            </a>
            <a href="#stats" className="hover:text-[#006c35]">
              {isAr ? "إحصائيات" : "Statistics"}
            </a>
            <a href="#about" className="hover:text-[#006c35]">
              {isAr ? "عن الهيئة" : "About"}
            </a>
            <a href="#contact" className="hover:text-[#006c35]">
              {isAr ? "تواصل معنا" : "Contact"}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center rounded border border-slate-200 bg-white px-2 py-1 md:flex dark:border-border dark:bg-card">
              <img src={vision2030} alt="Vision 2030" className="h-7 w-auto object-contain" />
            </div>
            <ThemeToggleButton />
            <Link to="/login">
              <Button className="gap-2 bg-[#006c35] text-white hover:bg-[#005528]">
                {t("login")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-[#0b3a2c] via-[#0e4a37] to-[#103e57] text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              {isAr ? "بوابة رسمية معتمدة" : "Official Approved Portal"}
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">{t("platform_name")}</h1>
            <div className="mt-2 text-lg text-white/80 md:text-2xl">{t("sais_name")}</div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
              {t("landing_hero_desc")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="gap-2 bg-white text-[#0b3a2c] hover:bg-white/90">
                  {t("login")}
                  <Arrow className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("services")}
                className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                {t("landing_services")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t("secure_portal")}</div>
                  <div className="text-xs text-white/60">
                    {isAr ? "متوافق مع ضوابط NCA" : "NCA compliant"}
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-white/85">
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-white/60">{isAr ? "حالة المنصة" : "Platform Status"}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    {isAr ? "تعمل" : "Operational"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{isAr ? "الإصدار" : "Version"}</span>
                  <span>v2.4.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{t("last_updated")}</span>
                  <span>1447/10/12 هـ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-50 py-20 dark:bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#006c35] dark:text-[#83bf3f]">
              {isAr ? "خدماتنا" : "Our Services"}
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl dark:text-foreground">
              {isAr ? "ماذا تقدم لك المنصة" : "What the Platform Offers"}
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-muted-foreground">
              {isAr
                ? "مجموعة متكاملة من الخدمات الرقمية لتسهيل تعاملاتكم مع الهيئة."
                : "An integrated set of digital services to facilitate your dealings with SAIS."}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.titleKey}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#006c35]/40 hover:shadow-md dark:border-border dark:bg-card"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#006c35]/10 text-[#006c35] transition group-hover:bg-[#006c35] group-hover:text-white dark:bg-[#83bf3f]/15 dark:text-[#83bf3f]">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">
                  {t(s.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
                  {t(s.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-white py-20 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-border dark:bg-border">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-8 text-center dark:bg-card">
                <div className="text-3xl font-bold text-[#006c35] md:text-4xl dark:text-[#83bf3f]">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section
        id="about"
        className="bg-gradient-to-l from-[#006c35] to-[#005528] py-14 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div>
            <h3 className="text-xl font-bold md:text-2xl">
              {isAr ? "جاهز للبدء؟" : "Ready to start?"}
            </h3>
            <p className="mt-1 text-sm text-white/80">
              {isAr
                ? "سجّل دخولك الآن لتقديم طلبك ومتابعة معاملاتك مع الهيئة."
                : "Sign in now to submit your request and track your dealings with SAIS."}
            </p>
          </div>
          <Link to="/login">
            <Button size="lg" className="gap-2 bg-white text-[#005528] hover:bg-white/90">
              {isAr ? "ابدأ الآن" : "Get Started"}
              <Arrow className="h-4 w-4" />
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
                <div className="text-sm font-bold text-white">{t("sais_name")}</div>
                <div className="text-[11px] text-slate-400">SAIS</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              {isAr
                ? "مبادرة من وزارة الداخلية — المملكة العربية السعودية"
                : "An initiative of the Ministry of Interior — Kingdom of Saudi Arabia"}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">{isAr ? "عن الهيئة" : "About"}</a></li>
              <li><a href="#services" className="hover:text-white">{isAr ? "الخدمات" : "Services"}</a></li>
              <li><a href="#contact" className="hover:text-white">{isAr ? "تواصل معنا" : "Contact"}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </h4>
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
            <h4 className="mb-4 text-sm font-semibold text-white">
              {isAr ? "تابعنا" : "Follow Us"}
            </h4>
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
            <div>{t("copyright")}</div>
            <div>{isAr ? "مبادرة من وزارة الداخلية" : "Ministry of Interior initiative"}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
