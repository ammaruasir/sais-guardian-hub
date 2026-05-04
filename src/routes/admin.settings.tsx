import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">تخصيص إعدادات النظام والتفضيلات العامة</p>
      </header>
      <Card className="p-10 text-center">
        <Construction className="mx-auto h-10 w-10 text-muted-foreground" />
        <div className="mt-3 font-semibold">قيد الإعداد</div>
        <p className="text-sm text-muted-foreground">سيتم بناء الإعدادات والامتثال في المرحلة الفرعية 7B.</p>
      </Card>
    </div>
  ),
});
