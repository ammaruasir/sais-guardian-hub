export type NcaStatus = "compliant" | "partial" | "non_compliant";

export type NcaControl = {
  id: string;
  ar: string;
  status: NcaStatus;
};

export const ncaControls: NcaControl[] = [
  { id: "1", ar: "إدارة الأصول المعلوماتية", status: "compliant" },
  { id: "2", ar: "إدارة الهويات والوصول", status: "compliant" },
  { id: "3", ar: "حماية الأنظمة والشبكات", status: "partial" },
  { id: "4", ar: "إدارة الثغرات", status: "compliant" },
  { id: "5", ar: "إدارة الأحداث والحوادث", status: "compliant" },
  { id: "6", ar: "التشفير", status: "compliant" },
  { id: "7", ar: "أمن التطبيقات", status: "partial" },
  { id: "8", ar: "النسخ الاحتياطي والاستعادة", status: "compliant" },
  { id: "9", ar: "الأمن المادي", status: "compliant" },
  { id: "10", ar: "إدارة استمرارية الأعمال", status: "non_compliant" },
];

export const ncaStatusLabel: Record<NcaStatus, { ar: string; cls: string; dot: string }> = {
  compliant: { ar: "مطبق", cls: "bg-success/15 text-success border-success/30", dot: "bg-success" },
  partial: {
    ar: "مطبق جزئياً",
    cls: "bg-warning/20 text-warning-foreground border-warning/30",
    dot: "bg-warning",
  },
  non_compliant: {
    ar: "غير مطبق",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
};
