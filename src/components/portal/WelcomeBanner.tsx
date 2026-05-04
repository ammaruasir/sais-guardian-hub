import { AlertCircle } from "lucide-react";

export function WelcomeBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border p-6 md:p-8 text-secondary-foreground shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, var(--secondary) 0%, color-mix(in oklab, var(--secondary) 70%, var(--primary)) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.35) 0, transparent 45%)",
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">مرحباً، أرامكو السعودية</h1>
          <p className="mt-2 inline-flex items-center gap-2 text-sm md:text-base opacity-95">
            <AlertCircle className="h-4 w-4" />
            لديكم <span className="num font-semibold">2</span> إجراءات مطلوبة
          </p>
        </div>
        <div className="text-right text-xs opacity-80">
          <div>اليوم</div>
          <div className="num">٤ مايو ٢٠٢٦</div>
        </div>
      </div>
    </div>
  );
}
