import type { Classification, Sector } from "@/data";

export type Facility = {
  id: string;
  companyId: string;
  nameAr: string;
  nameEn: string;
  classification: Classification;
  location: string;
  sector: Sector;
};

export const facilities: Facility[] = [
  {
    id: "f1",
    companyId: "aramco",
    nameAr: "مصفاة رأس تنورة",
    nameEn: "Ras Tanura Refinery",
    classification: "critical",
    location: "المنطقة الشرقية",
    sector: "petroleum",
  },
  {
    id: "f2",
    companyId: "aramco",
    nameAr: "ميناء جدة",
    nameEn: "Jeddah Port Terminal",
    classification: "high",
    location: "جدة",
    sector: "other",
  },
  {
    id: "f3",
    companyId: "aramco",
    nameAr: "مصفاة جازان",
    nameEn: "Jazan Refinery",
    classification: "critical",
    location: "جازان",
    sector: "petroleum",
  },
  {
    id: "f4",
    companyId: "sabic",
    nameAr: "مجمع الجبيل البتروكيماوي",
    nameEn: "Jubail Petrochemical Complex",
    classification: "high",
    location: "الجبيل",
    sector: "petrochemicals",
  },
  {
    id: "f5",
    companyId: "sabic",
    nameAr: "مجمع ينبع",
    nameEn: "Yanbu Complex",
    classification: "high",
    location: "ينبع",
    sector: "petrochemicals",
  },
  {
    id: "f6",
    companyId: "maaden",
    nameAr: "مجمع وعد الشمال للفوسفات",
    nameEn: "Wa'ad Al Shamal Phosphate",
    classification: "high",
    location: "الحدود الشمالية",
    sector: "mining",
  },
  {
    id: "f7",
    companyId: "almarai",
    nameAr: "منشأة معالجة حائل",
    nameEn: "Hail Processing Facility",
    classification: "medium",
    location: "حائل",
    sector: "industrial",
  },
  {
    id: "f8",
    companyId: "sec",
    nameAr: "محطة تحويل الرياض الغربية",
    nameEn: "Riyadh West Substation",
    classification: "medium",
    location: "الرياض",
    sector: "power",
  },
  {
    id: "f9",
    companyId: "sec",
    nameAr: "محطة القصيم",
    nameEn: "Qassim Power Plant",
    classification: "high",
    location: "القصيم",
    sector: "power",
  },
];

export const companyComplianceScore: Record<string, number> = {
  aramco: 86,
  sabic: 64,
  maaden: 78,
  almarai: 45,
  sec: 82,
};

export const companyAssignedConsultant: Record<string, string> = {
  aramco: "c1",
  sabic: "c3",
  maaden: "c4",
  almarai: "c2",
  sec: "c1",
};
