// Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json) so that
// Phase 2 can pipe Supabase rows in untouched — nothing here is seed-specific.

export type JsonRecord = Record<string, unknown>;

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: "Super Dream" | "Dream" | "Regular" | string;
  incorporationYear: number | null;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string[];
  officeLocations: string[];
  yoyGrowthRate: string;
  websiteUrl: string;
}

export interface CompanyProfile extends CompanySummary {
  raw: JsonRecord;
}

export interface DashboardSkill {
  skillSetId: number;
  name: string;
  requiredLevel: number;
  requiredProficiency: string;
  bloomLevel: "CU" | "AP" | "AS" | "EV" | "CR";
  criticality: "Critical" | "Important" | "Baseline";
}

export const asString = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  return String(v).trim();
};

export const asRecord = (v: unknown): JsonRecord =>
  v && typeof v === "object" ? (v as JsonRecord) : {};

export const splitItems = (v: unknown): string[] => {
  const s = asString(v);
  if (!s) return [];
  return s
    .split(/\n|;|\u2022|·|(?<!\d)\.(?!\d)/g)
    .map((x) => x.trim())
    .filter(Boolean);
};

export const titleCaseFromCode = (code: string): string =>
  code
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const scoreToDifficulty = (score: number): "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER" => {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
};

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);
export const isNullish = (v: unknown): boolean => {
  const s = asString(v).toLowerCase();
  return NULLISH.has(s);
};

export const COMPANY_CTC_ESTIMATES: Record<string, string> = {
  "Google LLC": "₹32.0 – 48.5 LPA",
  "Microsoft Corporation": "₹28.0 – 44.0 LPA",
  "Amazon.com Inc.": "₹28.0 – 45.0 LPA",
  "Qualcomm Incorporated": "₹22.0 – 35.0 LPA",
  "Cisco Systems Inc.": "₹15.0 – 20.5 LPA",
  "Zoho Corporation": "₹8.5 – 16.0 LPA",
  "Accenture plc": "₹4.5 – 12.0 LPA",
  "Tata Consultancy Services": "₹3.6 – 9.5 LPA",
  "Cognizant Technology Solutions": "₹4.2 – 6.8 LPA",
  "Oracle Corporation": "₹14.0 – 22.0 LPA",
};

export function getCompanyCtcEstimate(company: JsonRecord): string {
  const sources = [company, asRecord(company.full_json), asRecord(company.short_json)];
  const packageValue = sources
    .flatMap((source) => [source.ctc, source.package, source.ctc_package, source.salary_package, source.salary, source.lpa])
    .find((value) => !isNullish(value));

  return asString(packageValue) || COMPANY_CTC_ESTIMATES[asString(company.name)] || "";
}

export function classifyCompanyByPackage(packageValue: string, fallback = "Regular"): CompanySummary["companyType"] {
  const packages = packageValue.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  const lowestLpa = Math.min(...packages, Infinity);

  if (lowestLpa >= 20) return "Super Dream";
  if (lowestLpa >= 9) return "Dream";
  if (lowestLpa >= 4) return "Regular";
  if (lowestLpa > 0 && lowestLpa < 4) return "Regular";
  return fallback === "Super Dream" || fallback === "Dream" || fallback === "Regular" ? fallback : "Regular";
}

export function normalizeCompanySummary(short: JsonRecord): CompanySummary {
  const packageValue = getCompanyCtcEstimate(short);
  const existingType = asString(short.company_type);
  const fallbackType = existingType === "Super Dream" || existingType === "Dream" || existingType === "Regular"
    ? existingType
    : "Regular";
  return {
    companyId: Number(short.company_id ?? 0),
    name: asString(short.name),
    shortName: asString(short.short_name) || asString(short.name),
    logoUrl: asString(short.logo_url),
    category: asString(short.category),
    companyType: classifyCompanyByPackage(packageValue, fallbackType),
    incorporationYear: short.incorporation_year ? Number(short.incorporation_year) : null,
    employeeSize: asString(short.employee_size),
    headquarters: asString(short.headquarters_address),
    operatingCountries: splitItems(short.operating_countries),
    officeLocations: splitItems(short.office_locations),
    yoyGrowthRate: asString(short.yoy_growth_rate),
    websiteUrl: asString(short.website_url),
  };
}

export function normalizeCompanyProfile(full: JsonRecord, short: JsonRecord): CompanyProfile {
  const summary = normalizeCompanySummary({ ...short, company_id: short.company_id });
  return {
    ...summary,
    raw: { ...full, ...short },
  };
}

export function normalizeDashboardSkills(
  skillLevels: Array<{
    skill_set_id: number;
    skill_set_name: string;
    required_level: number;
    required_proficiency: string;
  }>
): DashboardSkill[] {
  return skillLevels
    .map((s) => ({
      skillSetId: s.skill_set_id,
      name: s.skill_set_name,
      requiredLevel: s.required_level,
      requiredProficiency: s.required_proficiency,
      bloomLevel: proficiencyToBloom(s.required_level),
      criticality: scoreToCriticality(s.required_level),
    }))
    .sort((a, b) => b.requiredLevel - a.requiredLevel);
}

export function proficiencyToBloom(level: number): "CU" | "AP" | "AS" | "EV" | "CR" {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(level: number): "Critical" | "Important" | "Baseline" {
  if (level >= 7) return "Critical";
  if (level >= 5) return "Important";
  return "Baseline";
}

export const CATEGORY_HEX: Record<string, string> = {
  "Super Dream": "#7c3aed",
  Dream: "#2563eb",
  Regular: "#d97706",
};

export const BLOOM_META: Record<string, { label: string; hex: string; desc: string }> = {
  CU: { label: "Cultivate Understanding", hex: "#3b82f6", desc: "Recall & recognize core concepts" },
  AP: { label: "Apply", hex: "#22c55e", desc: "Use concepts in guided problems" },
  AS: { label: "Analyze/Synthesize", hex: "#eab308", desc: "Break down & combine independently" },
  EV: { label: "Evaluate", hex: "#ef4444", desc: "Judge, optimize, defend trade-offs" },
  CR: { label: "Create", hex: "#a855f7", desc: "Design original, production-grade solutions" },
};
