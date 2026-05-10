import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { useRole } from "@/context/RoleContext";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LanguageToggleButton } from "@/components/layout/TopBar";
import { toast } from "sonner";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Building2,
  Landmark,
  User as UserIcon,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import logo from "@/assets/logo.svg";

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

function LoginPage() {
  const { user, loading } = useAuth();
  const mockAuthed = useAppStore((s) => s.mockAuth.isAuthenticated);
  const loginMock = useAppStore((s) => s.loginMock);
  const { setRole } = useRole();
  const navigate = useNavigate();
  const { t, isAr } = useT();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

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

  return (
    <div className="content-area min-h-screen bg-slate-50 text-slate-900 dark:bg-background dark:text-foreground">
      <div className="bg-[#006c35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] md:px-6">
          <span>
            {isAr ? "المملكة العربية السعودية — موقع حكومي رسمي" : "Kingdom of Saudi Arabia — Official Government Portal"}
          </span>
          <div className="flex items-center gap-3">
            <LanguageToggleButton />
            <Link to="/landing" className="hover:underline">
              {t("back_to_home")}
            </Link>
          </div>
        </div>
      </div>

      <header className="border-b border-slate-200 bg-white dark:border-border dark:bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/landing" className="flex items-center gap-3">
            <img src={logo} alt="SAIS" className="h-10 w-10" />
            <div className="leading-tight">
              <div className="text-sm font-bold">{t("sais_name")}</div>
              <div className="text-[11px] text-slate-500 dark:text-muted-foreground">
                {t("platform_name")}
              </div>
            </div>
          </Link>
          <Link to="/landing" className="text-sm text-slate-600 hover:text-[#006c35] dark:text-muted-foreground">
            {isAr ? "← " : "← "}{t("home")}
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-5">
        <aside className="hidden lg:col-span-2 lg:block">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-bl from-[#0b3a2c] to-[#103e57] p-8 text-white">
            <Shield className="h-10 w-10 text-[#83bf3f]" />
            <h2 className="mt-5 text-2xl font-bold">{t("platform_name")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {isAr
                ? "سجّل دخولك للوصول إلى جميع خدمات الهيئة العليا للأمن الصناعي بطريقة آمنة وموحدة."
                : "Sign in to access all SAIS services securely and seamlessly."}
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {(isAr
                ? [
                    "تقديم ومتابعة الطلبات إلكترونياً",
                    "الاطلاع على الخطابات الرسمية",
                    "الرد على ملاحظات المراجعة",
                    "تحميل المستندات والشهادات",
                  ]
                : [
                    "Submit and track requests online",
                    "View official letters",
                    "Respond to review comments",
                    "Download documents and certificates",
                  ]
              ).map((it) => (
                <li key={it} className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#83bf3f]/20 text-[#83bf3f]">
                    ✓
                  </span>
                  <span className="text-white/90">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-border dark:bg-card">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">{t("login")}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                {isAr ? "اختر طريقة الدخول المناسبة لحسابك" : "Choose the sign-in method for your account"}
              </p>
            </div>

            <Tabs defaultValue="nafath_business" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-slate-100 p-1 md:grid-cols-4 dark:bg-muted">
                <TabsTrigger value="nafath_business" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  {t("nafath_business")}
                </TabsTrigger>
                <TabsTrigger value="nafath_gov" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  {t("nafath_gov")}
                </TabsTrigger>
                <TabsTrigger value="nafath_individual" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  {t("nafath_individual")}
                </TabsTrigger>
                <TabsTrigger value="username" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  {t("username_password")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nafath_business" className="mt-6">
                <NafathTab
                  icon={Building2}
                  title={isAr ? "تسجيل الدخول عبر نفاذ أعمال" : "Sign in via Nafath Business"}
                  desc={isAr ? "بوابة النفاذ المخصصة للمنشآت والشركات السعودية" : "Nafath portal for Saudi companies and establishments"}
                  buttonText={t("login_via_nafath_biz")}
                  onClick={() => goAs("company", "nafath_business", null, "/portal")}
                />
              </TabsContent>

              <TabsContent value="nafath_gov" className="mt-6">
                <NafathTab
                  icon={Landmark}
                  title={isAr ? "تسجيل الدخول عبر نفاذ حكومي" : "Sign in via Nafath Government"}
                  desc={isAr ? "مخصص للجهات الحكومية وموظفي الهيئة" : "For government entities and SAIS staff"}
                  buttonText={t("login_via_nafath_gov")}
                  onClick={() => goAs("sais", "nafath_gov", null, "/")}
                />
              </TabsContent>

              <TabsContent value="nafath_individual" className="mt-6">
                <NafathIndividualForm
                  onSubmit={(id) => goAs("company", "nafath_individual", id, "/portal")}
                />
              </TabsContent>

              <TabsContent value="username" className="mt-6">
                <UsernameForm
                  onSubmit={(u) => {
                    if (u.trim().toLowerCase() === "admin") {
                      goAs("sais", "username", u, "/");
                    } else {
                      goAs("company", "username", u, "/portal");
                    }
                  }}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-4 border-t border-slate-200 pt-6 dark:border-border">
              <div className="text-center text-sm text-slate-600 dark:text-muted-foreground">
                {t("no_account")}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 dark:bg-muted">
                  <Lock className="h-3 w-3 text-[#006c35]" /> {t("secure_portal")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 dark:bg-muted">
                  <ShieldCheck className="h-3 w-3 text-[#006c35]" />{" "}
                  {isAr ? "متوافقة مع ضوابط NCA" : "NCA compliant"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 dark:border-border dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 md:px-6 dark:text-muted-foreground">
          {t("copyright")}
        </div>
      </footer>
    </div>
  );

  function NafathTab({
    icon: Icon,
    title,
    desc,
    buttonText,
    onClick,
  }: {
    icon: React.ElementType;
    title: string;
    desc: string;
    buttonText: string;
    onClick: () => void;
  }) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-border dark:bg-muted/30">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#006c35]/10">
          <Icon className="h-8 w-8 text-[#006c35] dark:text-[#83bf3f]" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-muted-foreground">{desc}</p>
        <Button
          onClick={onClick}
          size="lg"
          className="mt-6 w-full gap-2 bg-[#006c35] text-white hover:bg-[#005528]"
        >
          <KeyRound className="h-4 w-4" />
          {buttonText}
        </Button>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-muted-foreground">
          {isAr
            ? "سيتم توجيهك إلى تطبيق نفاذ لإكمال التحقق"
            : "You will be redirected to the Nafath app to complete verification"}
        </p>
      </div>
    );
  }

  function NafathIndividualForm({ onSubmit }: { onSubmit: (id: string) => void }) {
    const [id, setId] = useState("");

    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!/^\d{10}$/.test(id)) {
        toast.error(
          isAr
            ? "يرجى إدخال رقم هوية صحيح مكوّن من 10 أرقام"
            : "Please enter a valid 10-digit ID number",
        );
        return;
      }
      onSubmit(id);
    };

    return (
      <form
        onSubmit={submit}
        className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-border dark:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#006c35]/10">
            <UserIcon className="h-6 w-6 text-[#006c35]" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{t("nafath_individual")}</h3>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">
              {isAr ? "سجّل الدخول برقم الهوية الوطنية" : "Sign in with your national ID number"}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">{t("id_number")}</Label>
          <Input
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            value={id}
            onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
            placeholder="1xxxxxxxxx"
            className="text-center font-mono tracking-widest"
          />
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 bg-[#006c35] hover:bg-[#005528]">
          {t("login")}
          <Arrow className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  function UsernameForm({ onSubmit }: { onSubmit: (username: string) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);

    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim() || !password.trim()) {
        toast.error(
          isAr
            ? "يرجى إدخال اسم المستخدم وكلمة المرور"
            : "Please enter username and password",
        );
        return;
      }
      onSubmit(username);
    };

    return (
      <form
        onSubmit={submit}
        className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-border dark:bg-muted/30"
      >
        <div className="space-y-1.5">
          <Label className="text-xs">{t("username_field")}</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">{t("password_field")}</Label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="pe-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute end-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={isAr ? "إظهار/إخفاء كلمة المرور" : "Show/hide password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 dark:text-muted-foreground">
            <Checkbox
              checked={remember}
              onCheckedChange={(c) => setRemember(c === true)}
            />
            {t("remember_me")}
          </label>
          <button type="button" className="text-[#006c35] hover:underline">
            {t("forgot_password")}
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 bg-[#006c35] hover:bg-[#005528]">
          {t("login")}
          <Arrow className="h-4 w-4" />
        </Button>

        <p className="text-center text-[11px] text-slate-500 dark:text-muted-foreground">
          {isAr ? (
            <>
              تلميح للعرض التجريبي: اكتب{" "}
              <span className="font-mono font-bold">admin</span> للدخول كموظف هيئة، أو أي اسم آخر للدخول كمنشأة.
            </>
          ) : (
            <>
              Demo hint: type <span className="font-mono font-bold">admin</span> to sign in as
              SAIS staff, or any other name to sign in as a company.
            </>
          )}
        </p>
      </form>
    );
  }
}
