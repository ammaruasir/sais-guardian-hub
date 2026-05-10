import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Monitor, Smartphone } from "lucide-react";
import { useT } from "@/hooks/useT";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppStore } from "@/store/appStore";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/settings")({
  component: PortalSettingsPage,
});

type Contact = { id: string; name: string; email: string; phone: string; role: string };

function PortalSettingsPage() {
  const { t, isAr } = useT();
  usePageTitle(isAr ? "إعدادات الحساب — بوابة المنشآت" : "Account Settings — Company Portal");
  const language = useAppStore((s) => s.settings.language ?? "ar");
  const setLanguage = useAppStore((s) => s.setLanguage);
  const { theme, setTheme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    name: isAr ? "أرامكو السعودية" : "Saudi Aramco",
    sector: isAr ? "بترول" : "Petroleum",
    reg: "1010000000",
    email: "compliance@aramco.com",
    phone: "+966 13 880 0000",
  });
  const [draft, setDraft] = useState(info);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "م. أحمد الراشد", email: "ahmed@aramco.com", phone: "0501234567", role: "مدير أمن صناعي" },
    { id: "2", name: "م. سارة المالكي", email: "sara@aramco.com", phone: "0509876543", role: "مسؤول امتثال" },
  ]);

  const [prefs, setPrefs] = useState({ email: true, newReq: true, weekly: false });
  const [pwd, setPwd] = useState({ old: "", new: "", confirm: "" });

  const saveInfo = () => { setInfo(draft); setEditing(false); toast.success(t("toast_saved")); };
  const cancelEdit = () => { setDraft(info); setEditing(false); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("account_settings")}</h1>
        <p className="text-sm text-muted-foreground">{isAr ? "إدارة معلومات حسابك وتفضيلاتك" : "Manage your account information and preferences"}</p>
      </div>

      {/* Company Info */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{t("company_info")}</h2>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => { setDraft(info); setEditing(true); }}>
              <Pencil className="h-3 w-3 me-1" /> {t("edit")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={cancelEdit}>{t("cancel")}</Button>
              <Button size="sm" onClick={saveInfo}>{t("save")}</Button>
            </div>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { k: "name", label: isAr ? "اسم المنشأة" : "Company Name" },
            { k: "sector", label: t("sector") },
            { k: "reg", label: t("registration_no") },
            { k: "email", label: t("email_label") },
            { k: "phone", label: t("phone_label") },
          ].map((f) => (
            <div key={f.k} className="space-y-1">
              <Label className="text-xs">{f.label}</Label>
              <Input
                value={(editing ? draft : info)[f.k as keyof typeof info]}
                onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}
                disabled={!editing}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Contacts */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold">{t("contacts")}</h2>
          <Button size="sm" onClick={() => {
            const id = String(Date.now());
            setContacts([...contacts, { id, name: isAr ? "جهة جديدة" : "New contact", email: "", phone: "", role: "" }]);
          }}>
            <Plus className="h-3 w-3 me-1" /> {t("add_contact")}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name_label")}</TableHead>
              <TableHead>{t("email_label")}</TableHead>
              <TableHead>{t("phone_label")}</TableHead>
              <TableHead>{t("role_label")}</TableHead>
              <TableHead className="text-end">—</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-sm">{c.email}</TableCell>
                <TableCell className="text-sm font-mono">{c.phone}</TableCell>
                <TableCell className="text-sm">{c.role}</TableCell>
                <TableCell className="text-end">
                  <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setContacts(contacts.filter((x) => x.id !== c.id))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Preferences */}
      <Card className="p-5 space-y-5">
        <h2 className="font-bold">{t("preferences")}</h2>
        <div className="space-y-2">
          <Label className="text-sm">{t("language_label")}</Label>
          <RadioGroup value={language} onValueChange={(v) => setLanguage(v as "ar" | "en")} className="flex gap-4">
            <div className="flex items-center gap-2"><RadioGroupItem value="ar" id="lang-ar" /><Label htmlFor="lang-ar">{t("arabic")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="en" id="lang-en" /><Label htmlFor="lang-en">{t("english")}</Label></div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">{t("settings_appearance")}</Label>
          <RadioGroup value={theme} onValueChange={(v) => setTheme(v as "light" | "dark" | "auto")} className="flex gap-4">
            <div className="flex items-center gap-2"><RadioGroupItem value="light" id="th-l" /><Label htmlFor="th-l">{t("theme_light")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="dark" id="th-d" /><Label htmlFor="th-d">{t("theme_dark")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="auto" id="th-a" /><Label htmlFor="th-a">{t("theme_system")}</Label></div>
          </RadioGroup>
        </div>
        <div className="space-y-3 pt-2 border-t border-border">
          {[
            { k: "email" as const, label: t("email_notifications") },
            { k: "newReq" as const, label: t("new_request_notifications") },
            { k: "weekly" as const, label: t("weekly_summary") },
          ].map((p) => (
            <div key={p.k} className="flex items-center justify-between">
              <Label>{p.label}</Label>
              <Switch checked={prefs[p.k]} onCheckedChange={(v) => setPrefs({ ...prefs, [p.k]: v })} />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5 space-y-5">
        <h2 className="font-bold">{t("security_section")}</h2>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t("change_password")}</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div><Label className="text-xs">{t("old_password")}</Label><Input type="password" value={pwd.old} onChange={(e) => setPwd({ ...pwd, old: e.target.value })} /></div>
            <div><Label className="text-xs">{t("new_password")}</Label><Input type="password" value={pwd.new} onChange={(e) => setPwd({ ...pwd, new: e.target.value })} /></div>
            <div><Label className="text-xs">{t("confirm_password")}</Label><Input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} /></div>
          </div>
          <Button size="sm" onClick={() => { toast.success(t("toast_saved")); setPwd({ old: "", new: "", confirm: "" }); }}>{t("change_password")}</Button>
        </div>
        <div className="pt-3 border-t border-border space-y-2">
          <h3 className="text-sm font-semibold">{t("active_sessions")}</h3>
          {[
            { icon: Monitor, device: "Chrome — Windows", ip: "37.224.10.5", last: "2026-05-10 09:42" },
            { icon: Smartphone, device: "Safari — iPhone", ip: "37.224.11.8", last: "2026-05-09 18:20" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{s.device}</div>
                  <div className="text-xs text-muted-foreground font-mono">{s.ip} · {s.last}</div>
                </div>
              </div>
              {i === 0 && <Badge variant="secondary">{isAr ? "الحالية" : "Current"}</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
