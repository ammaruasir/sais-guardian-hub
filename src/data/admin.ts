// ============= Admin / RBAC seed data =============

export type AdminUser = {
  id: string;
  nameAr: string;
  email: string;
  roleKey: string;
  department: string;
  active: boolean;
  events: number;
};

export type Role = {
  key: string;
  nameAr: string;
  description: string;
  system: boolean;
  color?: string;
};

export type PermMatrix = Record<string, Record<string, boolean>>;
// permissions["dashboard.view"] = { super_admin: true, admin: true, ... }

export type AuditLevel = "info" | "warning" | "critical";

export type AuditEvent = {
  id: string;
  user: string;
  type: string;
  description: string;
  page: string;
  level: AuditLevel;
  ts: string;
};

export type AppSettings = {
  // Security
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutMinutes: number;
  passwordMinLength: number;
  passwordExpiryDays: number;
  pwdRequireUpper: boolean;
  pwdRequireLower: boolean;
  pwdRequireNumber: boolean;
  pwdRequireSpecial: boolean;
  twoFactor: boolean;
  ipWhitelist: boolean;
  watermark: boolean;
  copyProtection: boolean;
  disableRightClick: boolean;
  // Email
  emailProvider: "smtp" | "sendgrid" | "mailgun";
  senderName: string;
  senderEmail: string;
  smtpServer: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpTls: boolean;
  // Notifications
  notifyEmail: boolean;
  notifyBrowser: boolean;
  notifyNewSubmissions: boolean;
  notifyOverdueReviews: boolean;
  notifyDailyDigest: boolean;
  // General
  platformName: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: "hijri" | "gregorian";
  // Appearance
  themeMode: "light" | "dark" | "auto";
  fontSize: "small" | "medium" | "large";
  sidebarMode: "open" | "collapsed";
};

export const departments = [
  "تقنية المعلومات",
  "إدارة المراجعات",
  "إدارة السلامة",
  "إدارة الامتثال",
  "إدارة التفتيش",
  "إدارة المشاريع",
  "الشؤون القانونية",
  "الخدمات المشتركة",
  "الموارد البشرية",
  "المالية",
];

export const seedRoles: Role[] = [
  { key: "super_admin", nameAr: "مدير النظام الأعلى", description: "صلاحيات كاملة على جميع أجزاء النظام", system: true, color: "primary" },
  { key: "admin", nameAr: "مدير النظام", description: "إدارة المستخدمين والإعدادات", system: true, color: "secondary" },
  { key: "strategy_manager", nameAr: "مدير الاستراتيجية", description: "إدارة الاستراتيجيات والأهداف والمبادرات", system: false },
  { key: "kpi_manager", nameAr: "مدير مؤشرات الأداء", description: "إدارة مؤشرات الأداء والمخاطر والتقارير", system: false },
  { key: "department_head", nameAr: "رئيس قسم", description: "إدارة مهام القسم", system: false },
  { key: "data_entry", nameAr: "مدخل بيانات", description: "إنشاء وتعديل بدون حذف", system: false },
  { key: "viewer", nameAr: "مشاهد", description: "عرض فقط بدون تعديل", system: true },
];

export const seedUsers: AdminUser[] = [
  { id: "u1", nameAr: "م. خالد الحربي", email: "khaled@sais.gov.sa", roleKey: "department_head", department: "إدارة المراجعات", active: true, events: 0 },
  { id: "u2", nameAr: "م. فهد القحطاني", email: "fahad@sais.gov.sa", roleKey: "department_head", department: "إدارة السلامة", active: true, events: 12 },
  { id: "u3", nameAr: "م. نورة الشمري", email: "noura@sais.gov.sa", roleKey: "department_head", department: "إدارة الامتثال", active: true, events: 0 },
  { id: "u4", nameAr: "م. عبدالله الدوسري", email: "abdullah@sais.gov.sa", roleKey: "data_entry", department: "إدارة التفتيش", active: true, events: 5 },
  { id: "u5", nameAr: "أ. سارة العتيبي", email: "sara@sais.gov.sa", roleKey: "super_admin", department: "تقنية المعلومات", active: true, events: 193 },
  { id: "u6", nameAr: "أ. محمد الراشد", email: "mohammad@sais.gov.sa", roleKey: "admin", department: "تقنية المعلومات", active: true, events: 1315 },
  { id: "u7", nameAr: "أ. فاطمة الزهراني", email: "fatimah@sais.gov.sa", roleKey: "data_entry", department: "إدارة المشاريع", active: true, events: 0 },
  { id: "u8", nameAr: "أ. سلطان المالكي", email: "sultan@sais.gov.sa", roleKey: "viewer", department: "الشؤون القانونية", active: true, events: 0 },
  { id: "u9", nameAr: "أ. هند المطيري", email: "hind@sais.gov.sa", roleKey: "department_head", department: "إدارة المراجعات", active: true, events: 3 },
  { id: "u10", nameAr: "أ. ريم الحربي", email: "reem@sais.gov.sa", roleKey: "viewer", department: "الخدمات المشتركة", active: false, events: 0 },
];

// Permissions matrix: permission key -> per-role boolean
type RoleKey = string;

export type PermissionDef = { key: string; labelAr: string; module: string };

export const permissionModules: { name: string; ar: string; color: string }[] = [
  { name: "dashboard", ar: "لوحة التحكم", color: "bg-primary" },
  { name: "projects", ar: "المشاريع", color: "bg-secondary" },
  { name: "reviews", ar: "المراجعات", color: "bg-warning" },
  { name: "users", ar: "المستخدمون", color: "bg-success" },
  { name: "settings", ar: "الإعدادات", color: "bg-destructive" },
];

export const permissionDefs: PermissionDef[] = [
  { key: "dashboard.view", labelAr: "عرض لوحة التحكم", module: "dashboard" },
  { key: "dashboard.create", labelAr: "إنشاء لوحة التحكم", module: "dashboard" },
  { key: "dashboard.edit", labelAr: "تعديل لوحة التحكم", module: "dashboard" },
  { key: "dashboard.delete", labelAr: "حذف لوحة التحكم", module: "dashboard" },
  { key: "dashboard.export", labelAr: "تصدير لوحة التحكم", module: "dashboard" },

  { key: "projects.view", labelAr: "عرض المشاريع", module: "projects" },
  { key: "projects.create", labelAr: "إنشاء المشاريع", module: "projects" },
  { key: "projects.edit", labelAr: "تعديل المشاريع", module: "projects" },
  { key: "projects.delete", labelAr: "حذف المشاريع", module: "projects" },
  { key: "projects.approve", labelAr: "اعتماد المشاريع", module: "projects" },

  { key: "reviews.view", labelAr: "عرض المراجعات", module: "reviews" },
  { key: "reviews.create", labelAr: "إنشاء المراجعات", module: "reviews" },
  { key: "reviews.edit", labelAr: "تعديل المراجعات", module: "reviews" },
  { key: "reviews.decide", labelAr: "اعتماد / رفض", module: "reviews" },

  { key: "users.view", labelAr: "عرض المستخدمين", module: "users" },
  { key: "users.create", labelAr: "إضافة مستخدم", module: "users" },
  { key: "users.edit", labelAr: "تعديل مستخدم", module: "users" },
  { key: "users.delete", labelAr: "حذف مستخدم", module: "users" },

  { key: "settings.view", labelAr: "عرض الإعدادات", module: "settings" },
  { key: "settings.edit", labelAr: "تعديل الإعدادات", module: "settings" },
];

const allRoles: RoleKey[] = seedRoles.map((r) => r.key);

function row(allowed: RoleKey[]): Record<RoleKey, boolean> {
  const r: Record<RoleKey, boolean> = {};
  for (const k of allRoles) r[k] = allowed.includes(k);
  return r;
}

export const seedPermMatrix: PermMatrix = {
  "dashboard.view": row(allRoles),
  "dashboard.create": row(["super_admin", "admin", "strategy_manager", "kpi_manager", "department_head", "data_entry"]),
  "dashboard.edit": row(["super_admin", "admin", "kpi_manager", "department_head"]),
  "dashboard.delete": row(["super_admin", "admin", "kpi_manager"]),
  "dashboard.export": row(["super_admin", "admin", "kpi_manager", "department_head"]),

  "projects.view": row(allRoles),
  "projects.create": row(["super_admin", "admin", "strategy_manager", "department_head", "data_entry"]),
  "projects.edit": row(["super_admin", "admin", "strategy_manager", "department_head"]),
  "projects.delete": row(["super_admin", "admin"]),
  "projects.approve": row(["super_admin", "admin", "strategy_manager"]),

  "reviews.view": row(allRoles),
  "reviews.create": row(["super_admin", "admin", "department_head", "data_entry"]),
  "reviews.edit": row(["super_admin", "admin", "department_head"]),
  "reviews.decide": row(["super_admin", "admin"]),

  "users.view": row(["super_admin", "admin"]),
  "users.create": row(["super_admin", "admin"]),
  "users.edit": row(["super_admin", "admin"]),
  "users.delete": row(["super_admin"]),

  "settings.view": row(["super_admin", "admin"]),
  "settings.edit": row(["super_admin"]),
};

// Audit events seed (representative; later actions append more)
export const seedAuditEvents: AuditEvent[] = [
  { id: "ev1", user: "Admin User", type: "مغادرة التبويب", description: "مغادرة التبويب", page: "settings/", level: "info", ts: "2026-05-04T22:50:00" },
  { id: "ev2", user: "Admin User", type: "فقدان التركيز", description: "فقدان التركيز على النافذة (احتمال التقاط شاشة)", page: "settings/", level: "info", ts: "2026-05-04T22:50:30" },
  { id: "ev3", user: "م. خالد الحربي", type: "تسجيل دخول", description: "تم تسجيل الدخول بنجاح", page: "login", level: "info", ts: "2026-05-04T09:15:00" },
  { id: "ev4", user: "م. فهد القحطاني", type: "تعديل مشروع", description: "تعديل حالة مشروع منشأة حائل", page: "projects/p5", level: "info", ts: "2026-05-04T10:30:00" },
  { id: "ev5", user: "Unknown", type: "محاولة دخول فاشلة", description: "3 محاولات فاشلة من IP 192.168.1.105", page: "login", level: "warning", ts: "2026-05-04T03:22:00" },
  { id: "ev6", user: "أ. سارة العتيبي", type: "تغيير صلاحيات", description: "تعديل دور المستخدم فهد القحطاني", page: "admin/users", level: "warning", ts: "2026-05-03T14:00:00" },
  { id: "ev7", user: "Admin User", type: "تصدير بيانات", description: "تصدير قائمة المشاريع", page: "projects/", level: "info", ts: "2026-05-03T16:45:00" },
  { id: "ev8", user: "Unknown", type: "محاولة دخول فاشلة", description: "5 محاولات فاشلة - تم قفل الحساب", page: "login", level: "critical", ts: "2026-05-03T01:15:00" },
  { id: "ev9", user: "م. نورة الشمري", type: "اعتماد مشروع", description: "اعتماد المرحلة 4 لمصفاة جازان", page: "projects/p12", level: "info", ts: "2026-05-02T11:20:00" },
  { id: "ev10", user: "Admin User", type: "تعديل إعدادات", description: "تغيير سياسة كلمة المرور", page: "settings/", level: "warning", ts: "2026-05-02T09:00:00" },
  { id: "ev11", user: "م. عبدالله الدوسري", type: "فقدان التركيز", description: "فقدان التركيز أثناء مراجعة مستندات سرية", page: "projects/p1", level: "warning", ts: "2026-05-01T15:30:00" },
  { id: "ev12", user: "Admin User", type: "إنشاء مستخدم", description: "إضافة مستخدم جديد: ريم الحربي", page: "admin/users", level: "info", ts: "2026-05-01T08:00:00" },
  { id: "ev13", user: "Unknown", type: "محاولة وصول غير مصرح", description: "محاولة وصول من IP محظور", page: "admin/", level: "critical", ts: "2026-04-30T22:00:00" },
  { id: "ev14", user: "أ. محمد الراشد", type: "نسخ احتياطي", description: "إنشاء نسخة احتياطية يدوية", page: "admin/settings", level: "info", ts: "2026-04-30T02:00:00" },
  { id: "ev15", user: "م. فهد القحطاني", type: "رفض مشروع", description: "رفض تقديم المرحلة 1 لمنشأة حائل", page: "projects/p5", level: "info", ts: "2026-04-29T14:15:00" },
];

// Inflated KPI baseline so cards can read 1656/83/84/1489 even with 15 rows
export const auditCountBaseline = {
  total: 1656,
  critical: 83,
  warnings: 84,
  info: 1489,
};

export const seedSettings: AppSettings = {
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutMinutes: 15,
  passwordMinLength: 8,
  passwordExpiryDays: 90,
  pwdRequireUpper: true,
  pwdRequireLower: true,
  pwdRequireNumber: true,
  pwdRequireSpecial: true,
  twoFactor: false,
  ipWhitelist: false,
  watermark: false,
  copyProtection: false,
  disableRightClick: false,
  emailProvider: "smtp",
  senderName: "منصة SAIS",
  senderEmail: "noreply@sais.gov.sa",
  smtpServer: "smtp.sais.gov.sa",
  smtpPort: 587,
  smtpUser: "noreply@sais.gov.sa",
  smtpPassword: "••••••••••••",
  smtpTls: true,
  notifyEmail: true,
  notifyBrowser: true,
  notifyNewSubmissions: true,
  notifyOverdueReviews: true,
  notifyDailyDigest: false,
  platformName: "منصة الهيئة العليا للأمن الصناعي",
  defaultLanguage: "العربية",
  timezone: "Asia/Riyadh (UTC+3)",
  dateFormat: "gregorian",
  themeMode: "light",
  fontSize: "medium",
  sidebarMode: "open",
};
