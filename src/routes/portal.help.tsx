import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail, Clock, FileText, FileUp, UserCheck } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useT } from "@/hooks/useT";

export const Route = createFileRoute("/portal/help")({
  component: HelpPage,
});

const faqs = [
  {
    q: "كيف أبدأ مشروعاً جديداً؟",
    a: "يتطلب البدء بمشروع جديد تعيين استشاري معتمد من الهيئة وتقديم تقييم المخاطر الأمنية كخطوة أولى. بعد قبول التقييم يمكنكم الانتقال إلى مراحل التصميم والتنفيذ.",
  },
  {
    q: "ما المستندات المطلوبة لكل مرحلة؟",
    a: "يمكنكم استخدام مستكشف المتطلبات لمعرفة المستندات المطلوبة بالتفصيل حسب نوع المنشأة والمشروع. يتم تحديث القائمة دورياً وفق الاشتراطات الحديثة.",
  },
  {
    q: "كم يستغرق وقت المراجعة؟",
    a: "تستغرق المراجعة عادة من 5 إلى 7 أيام عمل. المشاريع ذات التصنيف الحرج قد تستغرق وقتاً أطول للتأكد من اكتمال جميع متطلبات الأمن الصناعي.",
  },
  {
    q: "ماذا أفعل عند طلب مستندات إضافية؟",
    a: "عند طلب مستندات إضافية، يمكنكم الرد من خلال صفحة تفاصيل المشروع أو بدء تقديم جديد مع المستندات المطلوبة قبل انتهاء المهلة المحددة.",
  },
  {
    q: "كيف أتواصل مع الهيئة؟",
    a: "يمكنكم التواصل من خلال تبويب المراسلات في صفحة المشروع، أو عبر البريد الإلكتروني support@sais.gov.sa أو الاتصال على 920001234 خلال ساعات العمل الرسمية.",
  },
];

const links = [
  { to: "/portal/requirements", icon: FileText, label: "مستكشف المتطلبات" },
  { to: "/portal/submissions/new", icon: FileUp, label: "تقديم جديد" },
  { to: "/portal/projects", icon: UserCheck, label: "مشاريعنا" },
];

function HelpPage() {
  const { t } = useT();
  usePageTitle(t("help") + " — " + t("company_portal"));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">المساعدة والدعم</h1>
        <p className="text-sm text-muted-foreground">
          إجابات على الأسئلة الشائعة وقنوات التواصل مع فريق الهيئة
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`q${i}`}>
                  <AccordionTrigger className="text-end">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تواصل معنا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">هاتف</div>
                  <div className="num font-semibold">920001234</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">بريد إلكتروني</div>
                  <div className="font-semibold">support@sais.gov.sa</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ساعات العمل</div>
                  <div className="font-semibold">الأحد - الخميس · 8:00 - 16:00</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm transition-colors hover:bg-accent/40"
                >
                  <l.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{l.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
