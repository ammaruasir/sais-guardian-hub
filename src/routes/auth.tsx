import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, ArrowRight, Shield } from "lucide-react";
import logo from "@/assets/logo.svg";
import { usePageTitle } from "@/hooks/usePageTitle";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — منصة SAIS" },
      { name: "description", content: "تسجيل الدخول أو إنشاء حساب جديد على منصة الأمن الصناعي." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  usePageTitle("تسجيل الدخول — SAIS");
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(search.mode);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  return (
    <div
      className="content-area relative min-h-screen bg-[#0a0f1f] text-white"
      dir="rtl"
    >
      <Toaster position="top-center" />
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <Link to="/landing" className="flex items-center gap-3 self-start">
          <img src={logo} alt="SAIS" className="h-9 w-9" />
          <div className="leading-tight">
            <div className="text-sm font-bold">SAIS</div>
            <div className="text-[11px] text-white/60">الهيئة العليا للأمن الصناعي</div>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-1 text-xs text-[#c9a84c]">
                <Shield className="h-3.5 w-3.5" />
                وصول آمن
              </div>
              <h1 className="text-3xl font-bold">مرحباً بعودتك</h1>
              <p className="mt-2 text-sm text-white/60">
                ادخل إلى لوحة المنصة بحسابك المؤسسي
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#0a0f1f]"
                  >
                    تسجيل الدخول
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#0a0f1f]"
                  >
                    حساب جديد
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <SignInForm />
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <SignUpForm onCreated={() => setTab("signin")} />
                </TabsContent>
              </Tabs>
            </div>

            <p className="mt-6 text-center text-xs text-white/50">
              بالاستمرار فإنك توافق على شروط الاستخدام وسياسة الخصوصية للمنصة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("يرجى إدخال البريد وكلمة المرور");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "بيانات الدخول غير صحيحة"
          : error.message,
      );
      return;
    }
    toast.success("تم تسجيل الدخول ✓");
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="user@example.com"
      />
      <Field
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
      />
      <Button
        type="submit"
        disabled={submitting}
        className="w-full gap-2 bg-[#c9a84c] text-[#0a0f1f] hover:bg-[#d4b75c]"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            دخول
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function SignUpForm({ onCreated }: { onCreated: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    if (password.length < 8) {
      toast.error("كلمة المرور يجب ألا تقل عن 8 أحرف");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: name, role: "company" },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message.includes("already registered")
          ? "هذا البريد مسجل بالفعل"
          : error.message,
      );
      return;
    }
    if (data.session) {
      toast.success("تم إنشاء الحساب ✓");
      navigate({ to: "/" });
    } else {
      toast.success("تم إنشاء الحساب — يمكنك تسجيل الدخول الآن");
      onCreated();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="الاسم الكامل" value={name} onChange={setName} placeholder="اسمك الكامل" />
      <Field
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="user@example.com"
      />
      <Field
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="على الأقل 8 أحرف"
      />
      <Button
        type="submit"
        disabled={submitting}
        className="w-full gap-2 bg-[#c9a84c] text-[#0a0f1f] hover:bg-[#d4b75c]"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            إنشاء حساب
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="block text-end text-xs text-white/70">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-[#c9a84c]"
        dir={type === "email" || type === "password" ? "ltr" : undefined}
      />
    </div>
  );
}
