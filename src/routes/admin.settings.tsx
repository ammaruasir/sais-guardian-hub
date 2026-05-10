import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  Bell,
  Palette,
  Lock,
  Database,
  Mail,
  Shield,
  Key,
  Save,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { ncaControls, ncaStatusLabel } from "@/data/ncaControls";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import { NoAccess } from "@/components/common/NoAccess";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type TabKey = "general" | "notifications" | "appearance" | "security" | "backup" | "email";

const tabs: { key: TabKey; ar: string; Icon: typeof Globe }[] = [
  { key: "general", ar: "عام", Icon: Globe },
  { key: "notifications", ar: "الإشعارات", Icon: Bell },
  { key: "appearance", ar: "المظهر", Icon: Palette },
  { key: "security", ar: "الأمان", Icon: Lock },
  { key: "backup", ar: "النسخ الاحتياطي", Icon: Database },
  { key: "email", ar: "البريد الإلكتروني", Icon: Mail },
];

function SettingsPage() {
  const { hasPermission } = useRole();
  const [active, setActive] = useState<TabKey>("security");

  if (!hasPermission("settings.view")) return <NoAccess />;

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">تخصيص إعدادات النظام والتفضيلات العامة</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div className="space-y-6 order-2 lg:order-1">
          {active === "general" && <GeneralTab />}
          {active === "notifications" && <NotificationsTab />}
          {active === "appearance" && <AppearanceTab />}
          {active === "security" && <SecurityTab />}
          {active === "backup" && <BackupTab />}
          {active === "email" && <EmailTab />}
        </div>

        <Card className="order-1 lg:order-2 h-fit p-2 sticky top-20">
          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-end",
                  active === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <t.Icon className="h-4 w-4" />
                <span className="flex-1 text-end">{t.ar}</span>
              </button>
            ))}
          </nav>
        </Card>
      </div>

      <div className="fixed bottom-6 start-6 z-30">
        <Button
          size="lg"
          className="shadow-xl gap-2"
          onClick={() => toast.success("تم حفظ الإعدادات بنجاح ✓")}
        >
          <Save className="h-4 w-4" /> حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  Icon,
  children,
  extra,
}: {
  title: string;
  Icon: typeof Globe;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {extra}
      </div>
      {children}
    </Card>
  );
}

function NumField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        className="mt-1.5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
  badge,
  disabled,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  badge?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
      <div className="flex-1 text-end">
        <div className="flex items-center justify-end gap-2">
          {badge && (
            <Badge variant="outline" className="text-[10px]">
              {badge}
            </Badge>
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

// ============== Tabs ==============

function SecurityTab() {
  const s = useAppStore((x) => x.settings);
  const update = useAppStore((x) => x.updateSettings);

  const compliant = ncaControls.filter((c) => c.status === "compliant").length;
  const partial = ncaControls.filter((c) => c.status === "partial").length;
  const nonCompliant = ncaControls.filter((c) => c.status === "non_compliant").length;
  const compliancePct = Math.round(((compliant + partial * 0.5) / ncaControls.length) * 100);

  return (
    <div className="space-y-5">
      <SectionCard title="إعدادات الجلسة" Icon={Shield}>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumField
            label="مهلة الجلسة (دقائق)"
            value={s.sessionTimeout}
            onChange={(n) => update({ sessionTimeout: n })}
          />
          <NumField
            label="الحد الأقصى لمحاولات تسجيل الدخول"
            value={s.maxLoginAttempts}
            onChange={(n) => update({ maxLoginAttempts: n })}
            hint="قبل قفل الحساب"
          />
          <NumField
            label="مدة القفل (دقائق)"
            value={s.lockoutMinutes}
            onChange={(n) => update({ lockoutMinutes: n })}
            hint="مدة قفل الحساب بعد المحاولات الفاشلة"
          />
        </div>
      </SectionCard>

      <SectionCard title="سياسة كلمة المرور" Icon={Key}>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumField
            label="الحد الأدنى للطول"
            value={s.passwordMinLength}
            onChange={(n) => update({ passwordMinLength: n })}
          />
          <NumField
            label="صلاحية كلمة المرور (أيام)"
            value={s.passwordExpiryDays}
            onChange={(n) => update({ passwordExpiryDays: n })}
            hint="0 = لا تنتهي أبداً"
          />
        </div>
        <div className="mt-4">
          <Label className="text-xs text-muted-foreground">متطلبات كلمة المرور</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ToggleRow
              title="أحرف كبيرة"
              desc="A-Z"
              checked={s.pwdRequireUpper}
              onChange={(v) => update({ pwdRequireUpper: v })}
            />
            <ToggleRow
              title="أرقام"
              desc="0-9"
              checked={s.pwdRequireNumber}
              onChange={(v) => update({ pwdRequireNumber: v })}
            />
            <ToggleRow
              title="أحرف صغيرة"
              desc="a-z"
              checked={s.pwdRequireLower}
              onChange={(v) => update({ pwdRequireLower: v })}
            />
            <ToggleRow
              title="رموز خاصة"
              desc="!@#$"
              checked={s.pwdRequireSpecial}
              onChange={(v) => update({ pwdRequireSpecial: v })}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="إعدادات أمان إضافية" Icon={Lock}>
        <div className="space-y-2">
          <ToggleRow
            title="المصادقة الثنائية"
            desc="طبقة حماية إضافية لتسجيل الدخول"
            checked={s.twoFactor}
            onChange={(v) => update({ twoFactor: v })}
            badge="قريباً"
            disabled
          />
          <ToggleRow
            title="القائمة البيضاء للـ IP"
            desc="السماح بالوصول من عناوين IP محددة فقط"
            checked={s.ipWhitelist}
            onChange={(v) => update({ ipWhitelist: v })}
          />
          <ToggleRow
            title="العلامة المائية"
            desc="عرض علامة مائية تحتوي على اسم المستخدم والتاريخ على جميع الصفحات لمنع التقاط الشاشة غير المصرح به"
            checked={s.watermark}
            onChange={(v) => update({ watermark: v })}
          />
          <ToggleRow
            title="حماية النسخ"
            desc="منع نسخ المحتوى من النظام باستخدام لوحة المفاتيح أو تحديد النص"
            checked={s.copyProtection}
            onChange={(v) => update({ copyProtection: v })}
          />
          <ToggleRow
            title="تعطيل الزر الأيمن"
            desc="منع ظهور قائمة الزر الأيمن للماوس لحماية المحتوى"
            checked={s.disableRightClick}
            onChange={(v) => update({ disableRightClick: v })}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="ضوابط الأمن السيبراني الأساسية (ECC)"
        Icon={Shield}
        extra={<Badge className="bg-primary text-primary-foreground">NCA</Badge>}
      >
        <p className="text-xs text-muted-foreground -mt-2 mb-4">
          الامتثال لمتطلبات الهيئة الوطنية للأمن السيبراني
        </p>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              نسبة الامتثال: <span className="num">{compliancePct}%</span>
            </span>
            <div className="flex gap-2">
              <Badge className="bg-success/15 text-success border-success/30" variant="outline">
                <span className="num ms-1">{compliant}</span> مطبق
              </Badge>
              <Badge
                className="bg-warning/20 text-warning-foreground border-warning/30"
                variant="outline"
              >
                <span className="num ms-1">{partial}</span> مطبق جزئياً
              </Badge>
              <Badge
                className="bg-destructive/10 text-destructive border-destructive/30"
                variant="outline"
              >
                <span className="num ms-1">{nonCompliant}</span> غير مطبق
              </Badge>
            </div>
          </div>
          <Progress value={compliancePct} className="mt-3 h-2" />
        </div>

        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {ncaControls.map((c) => {
            const meta = ncaStatusLabel[c.status];
            return (
              <li key={c.id} className="flex items-center gap-3 p-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
                <span className="flex-1 text-sm">{c.ar}</span>
                <Badge variant="outline" className={meta.cls}>
                  {meta.ar}
                </Badge>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}

function EmailTab() {
  const s = useAppStore((x) => x.settings);
  const update = useAppStore((x) => x.updateSettings);
  return (
    <div className="space-y-5">
      <SectionCard title="إعدادات البريد الإلكتروني" Icon={Mail}>
        <p className="text-xs text-muted-foreground -mt-2 mb-4">
          قم بتكوين إعدادات البريد الإلكتروني لإرسال الإشعارات والرسائل من المنصة
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="text-xs text-muted-foreground">مزود الخدمة</Label>
            <Select
              value={s.emailProvider}
              onValueChange={(v) => update({ emailProvider: v as "smtp" | "sendgrid" | "mailgun" })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">اسم المرسل</Label>
            <Input
              className="mt-1.5"
              value={s.senderName}
              onChange={(e) => update({ senderName: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">بريد المرسل</Label>
            <Input
              className="mt-1.5"
              value={s.senderEmail}
              onChange={(e) => update({ senderEmail: e.target.value })}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="إعدادات SMTP" Icon={Lock}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">خادم SMTP</Label>
            <Input
              className="mt-1.5"
              value={s.smtpServer}
              onChange={(e) => update({ smtpServer: e.target.value })}
            />
          </div>
          <NumField label="المنفذ" value={s.smtpPort} onChange={(n) => update({ smtpPort: n })} />
          <div>
            <Label className="text-xs text-muted-foreground">اسم المستخدم</Label>
            <Input
              className="mt-1.5"
              value={s.smtpUser}
              onChange={(e) => update({ smtpUser: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">كلمة المرور</Label>
            <Input
              type="password"
              className="mt-1.5"
              value={s.smtpPassword}
              onChange={(e) => update({ smtpPassword: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <ToggleRow
            title="استخدام اتصال آمن (TLS/SSL)"
            desc="تشفير الاتصال بخادم البريد"
            checked={s.smtpTls}
            onChange={(v) => update({ smtpTls: v })}
          />
        </div>
      </SectionCard>

      <Card className="p-4 border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="text-xs text-foreground">
            <strong>ملاحظة أمنية</strong> — يتم تخزين بيانات الاعتماد في قاعدة البيانات للاستخدام
            الداخلي. تأكد من حماية قاعدة البيانات وعدم مشاركة بيانات الاتصال.
          </div>
        </div>
      </Card>
    </div>
  );
}

function GeneralTab() {
  const s = useAppStore((x) => x.settings);
  const update = useAppStore((x) => x.updateSettings);
  return (
    <SectionCard title="إعدادات عامة" Icon={Globe}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-muted-foreground">اسم المنصة</Label>
          <Input
            className="mt-1.5"
            value={s.platformName}
            onChange={(e) => update({ platformName: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">اللغة الافتراضية</Label>
          <Input
            className="mt-1.5"
            value={s.defaultLanguage}
            onChange={(e) => update({ defaultLanguage: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">المنطقة الزمنية</Label>
          <Input
            className="mt-1.5"
            value={s.timezone}
            onChange={(e) => update({ timezone: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">تنسيق التاريخ</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={s.dateFormat}
            onValueChange={(v) => update({ dateFormat: v as "hijri" | "gregorian" })}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="hijri" /> هجري
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="gregorian" /> ميلادي
            </label>
          </RadioGroup>
        </div>
      </div>
    </SectionCard>
  );
}

function NotificationsTab() {
  const s = useAppStore((x) => x.settings);
  const update = useAppStore((x) => x.updateSettings);
  return (
    <SectionCard title="تفضيلات الإشعارات" Icon={Bell}>
      <div className="space-y-2">
        <ToggleRow
          title="إشعارات البريد"
          desc="إرسال الإشعارات إلى البريد الإلكتروني"
          checked={s.notifyEmail}
          onChange={(v) => update({ notifyEmail: v })}
        />
        <ToggleRow
          title="إشعارات المتصفح"
          desc="عرض إشعارات المتصفح المنبثقة"
          checked={s.notifyBrowser}
          onChange={(v) => update({ notifyBrowser: v })}
        />
        <ToggleRow
          title="إشعارات التقديمات الجديدة"
          desc="إشعار فوري عند استلام تقديم جديد"
          checked={s.notifyNewSubmissions}
          onChange={(v) => update({ notifyNewSubmissions: v })}
        />
        <ToggleRow
          title="إشعارات المراجعات المتأخرة"
          desc="تنبيه عند تأخر مراجعة عن موعدها"
          checked={s.notifyOverdueReviews}
          onChange={(v) => update({ notifyOverdueReviews: v })}
        />
        <ToggleRow
          title="ملخص يومي"
          desc="استلام ملخص يومي بآخر النشاطات"
          checked={s.notifyDailyDigest}
          onChange={(v) => update({ notifyDailyDigest: v })}
        />
      </div>
    </SectionCard>
  );
}

function AppearanceTab() {
  const s = useAppStore((x) => x.settings);
  const update = useAppStore((x) => x.updateSettings);
  return (
    <SectionCard title="المظهر" Icon={Palette}>
      <div className="space-y-5">
        <div>
          <Label className="text-xs text-muted-foreground">الوضع</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={s.themeMode}
            onValueChange={(v) => update({ themeMode: v as "light" | "dark" | "auto" })}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="light" /> فاتح
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="dark" /> داكن
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="auto" /> تلقائي
            </label>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">حجم الخط</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={s.fontSize}
            onValueChange={(v) => update({ fontSize: v as "small" | "medium" | "large" })}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="small" /> صغير
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="medium" /> متوسط
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="large" /> كبير
            </label>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">الشريط الجانبي</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={s.sidebarMode}
            onValueChange={(v) => update({ sidebarMode: v as "open" | "collapsed" })}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="open" /> مفتوح
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="collapsed" /> مصغر
            </label>
          </RadioGroup>
        <div>
          <Label className="text-xs text-muted-foreground">اللغة / Language</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={s.language ?? "ar"}
            onValueChange={(v) => update({ language: v as "ar" | "en" })}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="ar" /> عربي
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="en" /> English
            </label>
          </RadioGroup>
        </div>
      </div>
    </SectionCard>
  );
}

const mockBackups = [
  { date: "2026-05-03 02:00", size: "1.4 GB", status: "ناجحة" },
  { date: "2026-05-02 02:00", size: "1.4 GB", status: "ناجحة" },
  { date: "2026-05-01 02:00", size: "1.3 GB", status: "ناجحة" },
  { date: "2026-04-30 02:00", size: "1.3 GB", status: "ناجحة" },
  { date: "2026-04-29 02:00", size: "1.3 GB", status: "ناجحة" },
];

function BackupTab() {
  return (
    <div className="space-y-5">
      <SectionCard title="النسخ الاحتياطي" Icon={Database}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground">آخر نسخة</div>
            <div className="num mt-1 text-sm font-semibold">2026-05-03 02:00</div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground">النسخ التلقائي</div>
            <div className="mt-1 text-sm font-semibold">يومياً الساعة 2:00</div>
          </div>
        </div>
        <Button
          className="mt-4 gap-2"
          onClick={() => toast.success("تم بدء عملية النسخ الاحتياطي")}
        >
          <CheckCircle2 className="h-4 w-4" /> إنشاء نسخة احتياطية الآن
        </Button>
      </SectionCard>

      <SectionCard title="آخر 5 نسخ احتياطية" Icon={Database}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-end">التاريخ</TableHead>
              <TableHead className="text-end">الحجم</TableHead>
              <TableHead className="text-end">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBackups.map((b) => (
              <TableRow key={b.date}>
                <TableCell className="num">{b.date}</TableCell>
                <TableCell className="num">{b.size}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                    {b.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
