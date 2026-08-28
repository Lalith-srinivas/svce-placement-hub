import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  type CompanySummary,
  type CompanyProfile,
} from "./companyData";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const SKILL_NAMES: Record<number, string> = {
  1: "Data Structures & Algorithms",
  2: "Object-Oriented Programming (Java/Python/C++)",
  3: "SQL & Relational Databases",
  4: "Cloud Computing Fundamentals (AWS/Azure/GCP)",
  5: "Operating Systems & Concurrency",
  6: "Computer Networks & Distributed Protocols",
  7: "Aptitude & Logical Reasoning",
  8: "Business Communication & HR",
  9: "Web Technologies & Full Stack",
  10: "System Design & Distributed Systems",
  11: "Git & Software Engineering Practices",
  12: "Generative AI & Modern Tooling",
};

export const PROFICIENCY_LOOKUP: Record<number, { name: string; code: "CU" | "AP" | "AS" | "EV" | "CR" }> = {
  1: { name: "Conceptual Understanding", code: "CU" },
  2: { name: "Conceptual Understanding", code: "CU" },
  3: { name: "Application", code: "AP" },
  4: { name: "Application", code: "AP" },
  5: { name: "Analysis & Synthesis", code: "AS" },
  6: { name: "Analysis & Synthesis", code: "AS" },
  7: { name: "Evaluation", code: "EV" },
  8: { name: "Evaluation", code: "EV" },
  9: { name: "Creation", code: "CR" },
  10: { name: "Creation", code: "CR" },
};

export interface RawCompanyRow {
  company_id: number;
  name: string;
  short_name?: string;
  category?: string;
  company_type?: string;
  incorporation_year?: string | number;
  nature_of_company?: string;
  headquarters_address?: string;
  office_count?: string;
  office_locations?: string;
  operating_countries?: string;
  employee_size?: string;
  yoy_growth_rate?: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  facebook_url?: string;
  instagram_url?: string;
  primary_contact_email?: string;
  primary_phone_number?: string;
  overview_text?: string;
  vision_statement?: string;
  mission_statement?: string;
  legal_issues?: string;
  carbon_footprint?: string;
  short_json?: Record<string, unknown>;
  full_json?: Record<string, unknown>;
  skill_levels?: Array<{
    skill_set_id: number;
    skill_set_name: string;
    required_level: number;
    required_proficiency: string;
    required_proficiency_code?: string;
  }>;
  [key: string]: unknown;
}

function deriveLogo(row: RawCompanyRow): string {
  if (row.website_url) {
    try {
      const urlStr = row.website_url.startsWith("http") ? row.website_url : `https://${row.website_url}`;
      const host = new URL(urlStr).hostname.replace(/^www\./, "");
      const pk = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
      if (pk) {
        return `https://img.logo.dev/${host}?token=${pk}&size=128&format=png`;
      }
      return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    } catch {
      return "";
    }
  }
  return "";
}

function rowToSummaryInput(row: RawCompanyRow): Record<string, unknown> {
  const base = row.short_json
    ? { ...row.short_json, ...row }
    : { ...row };

  return {
    ...base,
    company_id: Number(row.company_id),
    logo_url: (base.logo_url as string) || deriveLogo(row),
    company_type: row.company_type || (base.company_type as string) || "Dream",
    headquarters_address: row.headquarters_address || "",
    operating_countries: row.operating_countries || "",
    office_locations: row.office_locations || "",
    yoy_growth_rate: row.yoy_growth_rate || "",
    employee_size: row.employee_size || "",
  };
}

export async function fetchCompaniesFromSupabase(): Promise<CompanySummary[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("company_id", { ascending: true });

  if (error) {
    console.error("[supabase] fetchCompanies error:", error.message);
    throw error;
  }

  if (!data || data.length === 0) return [];

  // Fetch official vector logos
  const { data: logos } = await supabase.from("company_logo").select("company_id, logo_url");
  const logoMap = new Map<number, string>();
  if (logos) {
    for (const l of logos) {
      if (l.logo_url) logoMap.set(l.company_id, l.logo_url);
    }
  }

  return (data as RawCompanyRow[]).map((row) => {
    const dbLogo = logoMap.get(Number(row.company_id));
    const summaryInput = {
      ...row,
      company_id: Number(row.company_id),
      logo_url: dbLogo || deriveLogo(row),
      company_type: row.company_type || "Dream",
    };
    return normalizeCompanySummary(summaryInput);
  });
}

export async function fetchCompanyProfileFromSupabase(
  companyId: number
): Promise<{ profile: CompanyProfile; skillLevels: RawCompanyRow["skill_levels"] } | null> {
  if (!supabase) return null;

  // 1. Fetch base row
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("company_id", companyId)
    .single();

  if (error || !data) {
    console.error("[supabase] fetchCompanyProfile error:", error?.message);
    return null;
  }

  // 2. Fetch full_json and short_json from company_json
  const { data: jsonRow } = await supabase
    .from("company_json")
    .select("short_json, full_json")
    .eq("company_id", companyId)
    .single();

  // 3. Fetch logo from company_logo
  const { data: logoRow } = await supabase
    .from("company_logo")
    .select("logo_url")
    .eq("company_id", companyId)
    .single();

  // 4. Fetch skill levels from company_skill_levels table
  const { data: rawSkills, error: skillErr } = await supabase
    .from("company_skill_levels")
    .select("*")
    .eq("company_id", companyId)
    .order("skill_set_id", { ascending: true });

  if (skillErr) {
    console.warn("[supabase] company_skill_levels warning:", skillErr.message);
  }

  const skillLevels = (rawSkills && rawSkills.length > 0)
    ? rawSkills.map((s: any) => {
        const prof = PROFICIENCY_LOOKUP[s.required_proficiency_level_id];
        return {
          skill_set_id: s.skill_set_id,
          skill_set_name: SKILL_NAMES[s.skill_set_id] || `Skill #${s.skill_set_id}`,
          required_level: Number(s.required_level || 5),
          required_proficiency: prof?.name || "Application",
          required_proficiency_code: prof?.code || "AP",
        };
      })
    : (data.skill_levels || []);

  const row = data as RawCompanyRow;
  const fullJson = (jsonRow?.full_json as Record<string, unknown>) || {};
  const shortJson = (jsonRow?.short_json as Record<string, unknown>) || {};
  const logoUrl = logoRow?.logo_url || (shortJson.logo_url as string) || deriveLogo(row);

  const summaryInput = {
    ...shortJson,
    ...row,
    company_id: Number(row.company_id),
    logo_url: logoUrl,
    company_type: row.company_type || (shortJson.company_type as string) || "Dream",
  };

  // Merge fullJson (164 fields) + flat row + skills into raw object
  const fullRaw = {
    ...fullJson,
    ...shortJson,
    ...row,
    logo_url: logoUrl,
    skill_levels: skillLevels,
  };

  const profile = normalizeCompanyProfile(fullRaw, summaryInput);

  return { profile, skillLevels };
}
