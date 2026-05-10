import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { useRole } from "@/context/RoleContext";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Fingerprint,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Cloud,
  Flame,
  HardHat,
  FlaskConical,
  Download,
  ChevronLeft,
} from "lucide-react";
import logo from "@/assets/sais-logo-full.svg";
import saFlag from "@/assets/sa-flag.png";
import nafathLogo from "@/assets/nafath-logo.png";
import heroBg from "@/assets/hero-industrial.png";
import { usePageTitle } from "@/hooks/usePageTitle";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — الهيئة العليا للأمن الصناعي" },
      {
        name: "description",
        content: "تسجيل الدخول إلى منصة الخدمات الرقمية للهيئة العليا للأمن الصناعي.",
      },
    ],
  }),
  component: LoginPage,
});

type AccountTab = "individual" | "entity";

function LoginPage() {
  const { user, loading } = useAuth();
  const mockAuthed = useAppStore((s) => s.mockAuth.isAuthenticated);
  const loginMock = useAppStore((s) => s.loginMock);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const { setRole } = useRole();
  const navigate = useNavigate();
  const { t, isAr } = useT();
  const [tab, setTab] = useState<AccountTab>("individual");
  usePageTitle((isAr ? "تسجيل الدخول" : "Login") + " — SAIS");

  useEffect(() => {
    if (!loading && (user || mockAuthed)) navigate({ to: "/" });
  }, [user, mockAuthed, loading, navigate]);

  const goAs = (
    role: "sais" | "company",
    method: "nafath_business" | "nafath_gov" | "nafath_individual" | "username",
    identifier: string | null,
    target: "/" | "/portal",
  ) => {
    loginMock({ mockRole: role, method, identifier });
    setRole(role);
    toast.success(isAr ? "تم تسجيل الدخول ✓" : "Signed in ✓");
    navigate({ to: target });
  };

  const handleNafathLogin = () => {
    if (tab === "individual") goAs("company", "nafath_individual", null, "/portal");
    else goAs("company", "nafath_business", null, "/portal");
  };

  const features = isAr
    ? [
        { icon: Flame, title: "الوقاية والحماية من الحريق", desc: "تقديم طلبات اعتماد أنظمة الإنذار والإطفاء ومتابعة الشهادات" },
        { icon: HardHat, title: "تأهيل المقاولين والاستشاريين", desc: "إصدار وثائق التأهيل في مجال المقاولات والاستشارات الأمنية" },
        { icon: FlaskConical, title: "إدارة المواد الكيميائية", desc: "تسجيل وتراخيص استيراد وتداول المواد الكيميائية الخاضعة للرقابة" },
      ]
    : [
        { icon: Flame, title: "Fire Prevention & Protection", desc: "Submit fire safety system approvals and follow up on certifications" },
        { icon: HardHat, title: "Contractor & Consultant Qualification", desc: "Issue qualification documents in security contracting and consulting" },
        { icon: FlaskConical, title: "Chemical Materials Management", desc: "Register and license import & handling of regulated chemicals" },
      ];

  return (
    <div
      className="content-area min-h-screen bg-white text-slate-900 dark:bg-background dark:text-foreground"
      style={{ fontFamily: isAr ? "'Tajawal', 'IBM Plex Sans Arabic', system-ui, sans-serif" : undefined }}
    >
      {/* Gov top bar */}
      <div className="bg-[#006c35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[12px] md:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <img src={saFlag} alt="SA" className="h-4 w-auto rounded-[2px]" />
            <span className="truncate">
              {isAr ? "موقع حكومي رسمي تابع لحكومة المملكة العربية السعودية" : "Official Government Portal — Kingdom of Saudi Arabia"}
            </span>
            <button className="ms-2 inline-flex items-center gap-1 text-white/90 hover:text-white">
              <span className="hidden sm:inline">{isAr ? "كيف تتحقق" : "How to verify"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="hidden items-center gap-4 text-white/90 md:flex">
            <span className="inline-flex items-center gap-1.5"><Cloud className="h-3.5 w-3.5" />{isAr ? "غائم جزئياً" : "Partly cloudy"}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{isAr ? "الاثنين، ٢٤ ذو القعدة ١٤٤٧ هـ" : "Mon, 24 Dhul-Qadah 1447 H"}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><span dir="ltr">{isAr ? "١٢:٣٤ ص" : "12:34 AM"}</span></span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{isAr ? "الرياض" : "Riyadh"}</span>
            <span className="mx-1 h-3 w-px bg-white/30" />
            <button onClick={() => setLanguage("en")} className={isAr ? "hover:underline" : "font-semibold"}>English</button>
            <span className="text-white/40">|</span>
            <button onClick={() => setLanguage("ar")} className={isAr ? "font-semibold" : "hover:underline"}>عربي</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-border dark:bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <Link to="/landing" className="flex items-center">
            <img src={logo} alt={t("sais_name")} className="h-10 w-auto md:h-12" />
          </Link>
          <Link to="/landing" className="text-sm text-slate-600 hover:text-[#006c35] dark:text-muted-foreground">
            {t("home")}
          </Link>
        </div>
      </header>

      {/* Two-column body */}
      <main className="grid min-h-[calc(100vh-150px)] grid-cols-1 lg:grid-cols-2">
        {/* Left: green hero with feature cards */}
        <aside
          className="relative overflow-hidden bg-[#0e5b3a] p-8 text-white md:p-12"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11,58,44,0.92), rgba(14,91,58,0.92)), url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-2xl font-bold md:text-3xl">{t("platform_name")}</h2>
            <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-white/85">
              {isAr
                ? "بوابتكم الإلكترونية لتقديم الطلبات ومتابعة الموافقات والاطلاع على المتطلبات التنظيمية للهيئة العليا للأمن الصناعي."
                : "Your digital portal to submit requests, track approvals, and view regulatory requirements of SAIS."}
            </p>

            <div className="mt-8 space-y-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-white/75">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: login panel */}
        <section className="flex flex-col px-6 py-10 md:px-16 md:py-14">
          {/* Breadcrumb */}
          <div className="mb-10 flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-muted-foreground">
            <Link to="/landing" className="hover:text-[#006c35]">{isAr ? "الرئيسية" : "Home"}</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-[#006c35]">{isAr ? "تسجيل الدخول" : "Login"}</span>
          </div>

          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
              {isAr ? "تسجيل الدخول" : "Sign in"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
              {isAr
                ? "سجل الدخول للوصول إلى حسابك والاستفادة من جميع خدمات البوابة. الرجاء اختيار نوع حسابك أولاً للمتابعة"
                : "Sign in to access your account and all portal services. Please choose your account type to continue."}
            </p>

            {/* Tabs: Individual / Entity */}
            <div className="mt-8 grid grid-cols-2 border-b border-slate-200 dark:border-border">
              {(["individual", "entity"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
                    tab === k
                      ? "border-[#006c35] text-[#006c35]"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-muted-foreground"
                  }`}
                >
                  {k === "individual" ? (isAr ? "فرد" : "Individual") : isAr ? "جهة" : "Entity"}
                </button>
              ))}
            </div>

            {/* Nafath info card */}
            <div className="mt-6 rounded-xl border border-[#006c35]/20 bg-[#006c35]/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#006c35]/15">
                  <Fingerprint className="h-6 w-6 text-[#006c35]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-foreground">
                    {isAr ? "تسجيل الدخول عبر نفاذ" : "Sign in via Nafath"}
                  </div>
                  <div className="mt-0.5 text-[12px] text-slate-600 dark:text-muted-foreground">
                    {tab === "individual"
                      ? isAr
                        ? "انقر على الزر أدناه للدخول باستخدام تطبيق النفاذ الوطني الموحد"
                        : "Click the button below to sign in using the Nafath app"
                      : isAr
                        ? "يمكن لممثلي الشركات المعتمدين الدخول باستخدام نفاذ"
                        : "Authorized company representatives can sign in using Nafath"}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4">
              {tab === "individual" ? (
                <Button
                  onClick={handleNafathLogin}
                  size="lg"
                  className="h-12 w-full gap-2 rounded-xl bg-[#006c35] text-sm font-semibold text-white hover:bg-[#005528]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {isAr ? "دخول / تسجيل (أفراد) عبر منصة النفاذ الوطني الموحد" : "Sign in (Individuals) via Nafath"}
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleNafathLogin}
                    size="lg"
                    className="h-12 w-full gap-2 rounded-xl bg-[#006c35] text-sm font-semibold text-white hover:bg-[#005528]"
                  >
                    {isAr ? "الدخول لحساب الجهة" : "Entity sign in"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toast.info(isAr ? "نموذج تسجيل جهة جديدة قريباً" : "New entity registration coming soon")}
                    className="h-12 w-full gap-2 rounded-xl border-slate-300 text-sm font-semibold text-slate-700 hover:border-[#006c35] hover:text-[#006c35]"
                  >
                    {isAr ? "تسجيل جهة جديدة" : "Register new entity"}
                  </Button>
                </div>
              )}
            </div>

            {/* Nafath app download */}
            <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-border">
              <div className="flex items-center gap-3 min-w-0">
                <img src={nafathLogo} alt="Nafath" className="h-11 w-11 shrink-0 rounded-lg object-contain" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-foreground">
                    {isAr ? "تطبيق نفاذ" : "Nafath app"}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-muted-foreground">
                    {isAr ? "تطبيق النفاذ الوطني الموحد" : "National Single Sign-On app"}
                  </div>
                </div>
              </div>
              <a
                href="https://www.absher.sa/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#006c35] hover:text-[#006c35]"
              >
                <Download className="h-3.5 w-3.5" />
                {isAr ? "تحميل" : "Download"}
              </a>
            </div>

            {/* Demo bypass */}
            <div className="mt-8 border-t border-dashed border-slate-200 pt-4 text-center dark:border-border">
              <p className="text-[11px] text-slate-400 dark:text-muted-foreground">
                {isAr ? "وضع العرض التجريبي" : "Demo mode"}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => goAs("sais", "username", "admin", "/")}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:border-[#006c35] hover:text-[#006c35] dark:border-border dark:text-muted-foreground"
                >
                  {isAr ? "دخول كموظف هيئة" : "Sign in as SAIS staff"}
                </button>
                <button
                  onClick={() => goAs("company", "username", "demo-company", "/portal")}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:border-[#006c35] hover:text-[#006c35] dark:border-border dark:text-muted-foreground"
                >
                  {isAr ? "دخول كمنشأة" : "Sign in as company"}
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-[11px] text-slate-400 dark:text-muted-foreground">
              {isAr ? "جميع الحقوق محفوظة للهيئة العليا للأمن الصناعي" : "© SAIS. All rights reserved."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
