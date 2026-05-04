function complianceBand(score: number) {
  if (score >= 75) return { ar: "ممتثل", color: "var(--success)" };
  if (score >= 50) return { ar: "قيد المراجعة", color: "var(--warning)" };
  return { ar: "غير ممتثل", color: "var(--destructive)" };
}

export function ComplianceGauge({ score, size = 140 }: { score: number; size?: number }) {
  const band = complianceBand(score);
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--muted)"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={band.color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="num text-3xl font-bold" style={{ color: band.color }}>
          {score}%
        </div>
        <div className="text-xs text-muted-foreground">{band.ar}</div>
      </div>
    </div>
  );
}

export function complianceBadgeFor(score: number) {
  return complianceBand(score);
}
