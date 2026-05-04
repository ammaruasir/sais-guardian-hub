export type Specialization = "security" | "safety_fire" | "both";
export type ConsultantStatus = "active" | "expired" | "pending_renewal";

export type Consultant = {
  id: string;
  nameAr: string;
  nameEn: string;
  licenseNo: string;
  specializations: Specialization[];
  activeProjects: number;
  licenseExpiry: string;
  status: ConsultantStatus;
  phone?: string;
  email?: string;
};

export const specializationLabel: Record<Specialization, string> = {
  security: "أمن",
  safety_fire: "سلامة وحريق",
  both: "الكل",
};

export const consultantStatusLabel: Record<ConsultantStatus, { ar: string; cls: string }> = {
  active: { ar: "نشط", cls: "bg-success/15 text-success border-success/30" },
  expired: { ar: "منتهي", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  pending_renewal: { ar: "بانتظار التجديد", cls: "bg-warning/20 text-warning-foreground border-warning/30" },
};

export const consultants: Consultant[] = [
  { id: "c1", nameAr: "الجزيرة للاستشارات الأمنية", nameEn: "AJEC", licenseNo: "SAIS-LIC-2023-018", specializations: ["both"], activeProjects: 5, licenseExpiry: "2027-03-15", status: "active", phone: "+966 11 234 5678", email: "info@ajec.sa" },
  { id: "c2", nameAr: "شركة TEC للاستشارات", nameEn: "TEC Consulting", licenseNo: "SAIS-LIC-2024-042", specializations: ["safety_fire"], activeProjects: 3, licenseExpiry: "2026-11-20", status: "active", phone: "+966 12 345 6789", email: "contact@tec.sa" },
  { id: "c3", nameAr: "مجموعة SGW الاستشارية", nameEn: "SGW Group", licenseNo: "SAIS-LIC-2023-027", specializations: ["security"], activeProjects: 4, licenseExpiry: "2027-06-30", status: "active", phone: "+966 13 456 7890", email: "office@sgw.sa" },
  { id: "c4", nameAr: "ساسيكون للاستشارات الأمنية", nameEn: "SASECON", licenseNo: "SAIS-LIC-2024-051", specializations: ["both"], activeProjects: 2, licenseExpiry: "2026-09-12", status: "active", phone: "+966 11 987 6543", email: "hello@sasecon.sa" },
  { id: "c5", nameAr: "المتحدة للحلول الأمنية", nameEn: "United Security Solutions", licenseNo: "SAIS-LIC-2022-009", specializations: ["security"], activeProjects: 1, licenseExpiry: "2026-06-01", status: "pending_renewal", phone: "+966 14 222 3344", email: "info@united-ss.sa" },
];
