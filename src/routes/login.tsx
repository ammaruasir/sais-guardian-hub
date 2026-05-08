import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
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
    toast.success("تم تسجيل الدخول ✓");
    navigate({ to: target });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Top utility bar */}
      <div className="bg-[#006c35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] md:px-6">
          <span>المملكة العربية السعودية — موقع حكومي رسمي</span>
          <Link to="/landing" className="hover:underline">العودة للرئيسية</Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/landing" className="flex items-center gap-3">
            <img src={logo} alt="SAIS" className="h-10 w-10" />
            <div className="leading-tight">
              <div className="text-sm font-bold">الهيئة العليا للأمن الصناعي</div>
              <div className="text-[11px] text-slate-500">منصة الخدمات الرقمية</div>
            </div>
          </Link>
          <Link to="/landing" className="text-sm text-slate-600 hover:text-[#006c35]">
            ← الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-5">
        {/* Side info */}
        <aside className="hidden lg:col-span-2 lg:block">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-bl from-[#0b3a2c] to-[#103e57] p-8 text-white">
            <Shield className="h-10 w-10 text-[#83bf3f]" />
            <h2 className="mt-5 text-2xl font-bold">بوابة الخدمات الرقمية</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              سجّل دخولك للوصول إلى جميع خدمات الهيئة العليا للأمن الصناعي بطريقة آمنة وموحدة.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "تقديم ومتابعة الطلبات إلكترونياً",
                "الاطلاع على الخطابات الرسمية",
                "الرد على ملاحظات المراجعة",
                "تحميل المستندات والشهادات",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#83bf3f]/20 text-[#83bf3f]">
                    ✓
                  </span>
                  <span className="text-white/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Login card */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900">تسجيل الدخول</h1>
              <p className="mt-1 text-sm text-slate-500">
                اختر طريقة الدخول المناسبة لحسابك
              </p>
            </div>

            <Tabs defaultValue="nafath_business" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-slate-100 p-1 md:grid-cols-4">
                <TabsTrigger value="nafath_business" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  نفاذ أعمال
                </TabsTrigger>
                <TabsTrigger value="nafath_gov" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  نفاذ حكومي
                </TabsTrigger>
                <TabsTrigger value="nafath_individual" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  نفاذ أفراد
                </TabsTrigger>
                <TabsTrigger value="username" className="data-[state=active]:bg-[#006c35] data-[state=active]:text-white">
                  اسم المستخدم
                </TabsTrigger>
              </TabsList>

              {/* Nafath Business */}
              <TabsContent value="nafath_business" className="mt-6">
                <NafathTab
                  icon={Building2}
                  title="تسجيل الدخول عبر نفاذ أعمال"
                  desc="بوابة النفاذ المخصصة للمنشآت والشركات السعودية"
                  buttonText="الدخول عبر نفاذ أعمال"
                  onClick={() => goAs("company", "nafath_business", null, "/portal")}
                />
              </TabsContent>

              {/* Nafath Gov */}
              <TabsContent value="nafath_gov" className="mt-6">
                <NafathTab
                  icon={Landmark}
                  title="تسجيل الدخول عبر نفاذ حكومي"
                  desc="مخصص للجهات الحكومية وموظفي الهيئة"
                  buttonText="الدخول عبر نفاذ حكومي"
                  onClick={() => goAs("sais", "nafath_gov", null, "/")}
                />
              </TabsContent>

              {/* Nafath Individual */}
              <TabsContent value="nafath_individual" className="mt-6">
                <NafathIndividualForm
                  onSubmit={(id) => goAs("company", "nafath_individual", id, "/portal")}
                />
              </TabsContent>

              {/* Username & Password */}
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

            {/* Below card */}
            <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
              <div className="text-center text-sm text-slate-600">
                ليس لديك حساب؟{" "}
                <Link to="/register" className="font-semibold text-[#006c35] hover:underline">
                  تسجيل منشأة جديدة
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                  <Lock className="h-3 w-3 text-[#006c35]" /> بوابة آمنة ومشفرة
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                  <ShieldCheck className="h-3 w-3 text-[#006c35]" /> متوافقة مع ضوابط NCA
                </span>
              </div>
              <div className="text-center text-[11px] text-slate-400">
                تستخدم حساباً حقيقياً؟{" "}
                <Link to="/auth" className="hover:text-[#006c35]">
                  سجّل الدخول بالبريد الإلكتروني
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 md:px-6">
          © 2026 — الهيئة العليا للأمن الصناعي — جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
}

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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#006c35]/10">
        <Icon className="h-8 w-8 text-[#006c35]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
      <Button
        onClick={onClick}
        size="lg"
        className="mt-6 w-full gap-2 bg-[#006c35] text-white hover:bg-[#005528]"
      >
        <KeyRound className="h-4 w-4" />
        {buttonText}
      </Button>
      <p className="mt-3 text-[11px] text-slate-500">
        سيتم توجيهك إلى تطبيق نفاذ لإكمال التحقق
      </p>
    </div>
  );
}

function NafathIndividualForm({ onSubmit }: { onSubmit: (id: string) => void }) {
  const [id, setId] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(id)) {
      toast.error("يرجى إدخال رقم هوية صحيح مكوّن من 10 أرقام");
      return;
    }
    onSubmit(id);
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#006c35]/10">
          <UserIcon className="h-6 w-6 text-[#006c35]" />
        </div>
        <div>
          <h3 className="text-base font-semibold">نفاذ أفراد</h3>
          <p className="text-xs text-slate-500">سجّل الدخول برقم الهوية الوطنية</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-slate-700">رقم الهوية الوطنية</Label>
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
        تسجيل الدخول
        <ArrowLeft className="h-4 w-4" />
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
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    onSubmit(username);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-700">اسم المستخدم أو البريد الإلكتروني</Label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          dir="ltr"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-slate-700">كلمة المرور</Label>
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
            aria-label="إظهار/إخفاء كلمة المرور"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-600">
          <Checkbox
            checked={remember}
            onCheckedChange={(c) => setRemember(c === true)}
          />
          تذكرني
        </label>
        <button type="button" className="text-[#006c35] hover:underline">
          نسيت كلمة المرور؟
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full gap-2 bg-[#006c35] hover:bg-[#005528]">
        تسجيل الدخول
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <p className="text-center text-[11px] text-slate-500">
        تلميح للعرض التجريبي: اكتب <span className="font-mono font-bold">admin</span> للدخول
        كموظف هيئة، أو أي اسم آخر للدخول كمنشأة.
      </p>
    </form>
  );
}
