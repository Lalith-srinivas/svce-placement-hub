import type { CompleteStudentProfile, StudentSkill } from "@/types/studentProfile";
import type { CompanySummary } from "@/lib/companyData";
import { SKILL_NAMES } from "@/lib/supabase";

export type MatrixSkillStatus = "Completed" | "Needs Improvement" | "Missing";
export type MatrixPriority = "Critical" | "High" | "Medium" | "Low";

export interface EvaluatedSkill {
  skillId?: number | string;
  skillName: string;
  category: MatrixCategory;
  companyRequiredLevel: number; // 1-10
  studentLevel: number; // 0-10
  gap: number; // Required - Student
  status: MatrixSkillStatus;
  priority: MatrixPriority;
  criticality?: "Critical" | "Important" | "Baseline";
}

export type MatrixCategory =
  | "Programming"
  | "DSA"
  | "Frontend"
  | "Backend"
  | "Database"
  | "Cloud"
  | "DevOps"
  | "Soft Skills";

export const MATRIX_CATEGORIES: MatrixCategory[] = [
  "Programming",
  "DSA",
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Soft Skills",
];

export interface CategoryProgress {
  category: MatrixCategory;
  studentPoints: number;
  requiredPoints: number;
  percentage: number;
  studentSkillCount: number;
  requiredSkillCount: number;
}

export interface CompanyMatchResult {
  companyId: number;
  companyName: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: string;
  websiteUrl: string;
  matchPercentage: number;
  isEligible: boolean;
  eligibilityReason: string;
  matchedSkillsCount: number; // Completed
  needsImprovementCount: number;
  missingSkillsCount: number; // Missing
  totalSkillGap: number;
  totalEvaluatedSkills: number;
  skills: EvaluatedSkill[];
  categoryProgress: CategoryProgress[];
  priorityMissingSkills: EvaluatedSkill[];
}

export interface GlobalMatrixMetrics {
  overallReadiness: number; // 0-100
  readinessColor: "green" | "yellow" | "red";
  totalEligibleCompanies: number;
  totalCompanies: number;
  averageSkillScore: number; // e.g. 7.8 / 10
  totalSkills: number;
  missingSkillsCount: number;
  highestPrioritySkills: EvaluatedSkill[];
  categoryProgress: CategoryProgress[];
  rankedCompanies: CompanyMatchResult[];
}

// -----------------------------------------------------------------------------
// Category & Skill Taxonomy Mapping
// -----------------------------------------------------------------------------

/**
 * Classify any skill name into one of the 8 standard categories
 */
export function classifySkillCategory(skillName: string): MatrixCategory {
  const norm = skillName.toLowerCase().trim();
  const words = norm.split(/[\s,./\\&()+-]+/);

  // 1. DSA (Prioritized to avoid collisions)
  if (
    norm.includes("data structure") ||
    norm.includes("algorithm") ||
    norm.includes("dsa") ||
    norm.includes("problem solving") ||
    norm.includes("dynamic programming") ||
    norm.includes("competitive programming") ||
    words.includes("trees") ||
    words.includes("graphs")
  ) {
    return "DSA";
  }

  // 2. Database
  if (
    norm.includes("database") ||
    norm.includes("sql") ||
    norm.includes("postgres") ||
    norm.includes("mysql") ||
    norm.includes("mongodb") ||
    norm.includes("redis") ||
    norm.includes("firebase")
  ) {
    return "Database";
  }

  // 3. Cloud
  if (
    norm.includes("cloud") ||
    norm.includes("aws") ||
    norm.includes("azure") ||
    norm.includes("gcp")
  ) {
    return "Cloud";
  }

  // 4. DevOps
  if (
    norm.includes("devops") ||
    norm.includes("docker") ||
    norm.includes("kubernetes") ||
    norm.includes("ci/cd") ||
    norm.includes("software engineering") ||
    words.includes("git") ||
    words.includes("github") ||
    words.includes("linux")
  ) {
    return "DevOps";
  }

  // 5. Soft Skills
  if (
    norm.includes("communication") ||
    norm.includes("aptitude") ||
    norm.includes("logical reasoning") ||
    norm.includes("verbal") ||
    norm.includes("interpersonal") ||
    words.includes("hr") ||
    norm.includes("soft skills")
  ) {
    return "Soft Skills";
  }

  // 6. Frontend
  if (
    norm.includes("frontend") ||
    norm.includes("html") ||
    norm.includes("css") ||
    norm.includes("react") ||
    norm.includes("next.js") ||
    norm.includes("angular") ||
    norm.includes("vue") ||
    norm.includes("tailwind") ||
    norm.includes("web tech") ||
    norm.includes("ui/ux")
  ) {
    return "Frontend";
  }

  // 7. Backend
  if (
    norm.includes("backend") ||
    norm.includes("node") ||
    norm.includes("express") ||
    norm.includes("fastapi") ||
    norm.includes("spring") ||
    norm.includes("django") ||
    norm.includes("system design") ||
    norm.includes("distributed") ||
    norm.includes("microservices") ||
    norm.includes("rest api")
  ) {
    return "Backend";
  }

  // 8. Programming Languages (Java, Python, C++, TypeScript, OS, Concurrency, etc.)
  return "Programming";
}

/**
 * Normalizes skill strings for robust, deterministic matching
 */
function normalizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if a student skill matches a company required skill
 */
function isSkillMatch(studentSkillName: string, companySkillName: string): boolean {
  const sNorm = normalizeSkillName(studentSkillName);
  const cNorm = normalizeSkillName(companySkillName);

  if (sNorm === cNorm) return true;
  if (cNorm.includes(sNorm) || sNorm.includes(cNorm)) return true;

  // Specific semantic pairings
  const DSA_SET = new Set(["dsa", "data structures", "algorithms", "data structures algorithms"]);
  if (DSA_SET.has(sNorm) && DSA_SET.has(cNorm)) return true;

  const OOP_SET = new Set(["java", "python", "c++", "object oriented programming", "oop"]);
  if (cNorm.includes("object oriented") && OOP_SET.has(sNorm)) return true;

  const WEB_SET = new Set(["react", "node js", "frontend", "backend", "web technologies", "web technologies full stack", "html", "css"]);
  if (cNorm.includes("web technologies") && WEB_SET.has(sNorm)) return true;

  const SQL_SET = new Set(["sql", "mysql", "postgresql", "sql relational databases", "database"]);
  if (cNorm.includes("sql") && SQL_SET.has(sNorm)) return true;

  const CLOUD_SET = new Set(["aws", "azure", "gcp", "cloud computing fundamentals", "cloud fundamentals", "cloud"]);
  if (cNorm.includes("cloud") && CLOUD_SET.has(sNorm)) return true;

  const DEVOPS_SET = new Set(["git", "github", "docker", "linux", "git software engineering practices"]);
  if ((cNorm.includes("git") || cNorm.includes("software engineering")) && DEVOPS_SET.has(sNorm)) return true;

  const SOFT_SET = new Set(["communication", "business communication", "business communication hr", "aptitude", "aptitude logical reasoning"]);
  if ((cNorm.includes("communication") || cNorm.includes("aptitude")) && SOFT_SET.has(sNorm)) return true;

  return false;
}

/**
 * Finds the student's proficiency for a given company skill requirement.
 * If multiple student skills match, takes the highest proficiency.
 */
export function getStudentLevelForSkill(
  companySkillName: string,
  studentSkills: StudentSkill[]
): number {
  if (!studentSkills || studentSkills.length === 0) return 0;

  let maxProficiency = 0;

  for (const s of studentSkills) {
    if (isSkillMatch(s.skill_name, companySkillName)) {
      if (s.proficiency > maxProficiency) {
        maxProficiency = s.proficiency;
      }
    }
  }

  return Math.min(10, Math.max(0, maxProficiency));
}

// -----------------------------------------------------------------------------
// Core Calculations
// -----------------------------------------------------------------------------

/**
 * Calculate Gap: Gap = Required Level - Student Level
 */
export function calculateSkillGap(
  requiredLevel: number,
  studentLevel: number
): { gap: number; status: MatrixSkillStatus; priority: MatrixPriority } {
  const req = Math.max(1, Math.min(10, Math.round(requiredLevel)));
  const stu = Math.max(0, Math.min(10, Math.round(studentLevel)));

  const gap = req - stu;

  let status: MatrixSkillStatus;
  if (stu === 0) {
    status = "Missing";
  } else if (gap <= 0) {
    status = "Completed";
  } else {
    status = "Needs Improvement";
  }

  // Determine priority based on gap magnitude
  let priority: MatrixPriority;
  if (gap >= 6) {
    priority = "Critical";
  } else if (gap >= 4) {
    priority = "High";
  } else if (gap >= 1) {
    priority = "Medium";
  } else {
    priority = "Low";
  }

  return { gap, status, priority };
}

/**
 * Check placement eligibility based on SVCE criteria:
 * - Active backlogs must be 0
 * - CGPA threshold for tier: Super Dream >= 8.0, Dream >= 7.0, Regular >= 6.0
 * - Skill match percentage >= 60%
 */
export function checkEligibility(
  matchPercentage: number,
  companyType: string,
  profile: CompleteStudentProfile | null
): { isEligible: boolean; reason: string } {
  if (!profile) {
    const isEligible = matchPercentage >= 60;
    return {
      isEligible,
      reason: isEligible ? "Skill match criteria satisfied (≥ 60%)" : "Skill match below minimum 60% threshold",
    };
  }

  const backlogs = parseInt(String(profile.personal?.active_backlogs ?? 0), 10);
  if (backlogs > 0) {
    return {
      isEligible: false,
      reason: `Ineligible: ${backlogs} active backlog(s) recorded`,
    };
  }

  const cgpa = parseFloat(String(profile.personal?.cgpa ?? 0));
  const normType = (companyType || "").toLowerCase();

  let requiredCgpa = 6.0;
  if (normType.includes("super dream")) requiredCgpa = 8.0;
  else if (normType.includes("dream")) requiredCgpa = 7.0;

  if (cgpa > 0 && cgpa < requiredCgpa) {
    return {
      isEligible: false,
      reason: `CGPA ${cgpa.toFixed(2)} below ${companyType} requirement (${requiredCgpa.toFixed(1)}+)`,
    };
  }

  if (matchPercentage < 60) {
    return {
      isEligible: false,
      reason: `Match score (${matchPercentage}%) below minimum 60% screening cutoff`,
    };
  }

  return {
    isEligible: true,
    reason: `Eligible: Meets ${companyType} CGPA, zero backlogs & skill benchmark`,
  };
}

/**
 * Get readiness gauge color:
 * - Green: Above 85%
 * - Yellow: 60-84%
 * - Red: Below 60%
 */
export function getReadinessColor(percentage: number): "green" | "yellow" | "red" {
  if (percentage >= 85) return "green";
  if (percentage >= 60) return "yellow";
  return "red";
}

/**
 * Standard default company skill requirements if a company row doesn't have explicit skill_levels
 */
export function getDefaultCompanySkillRequirements(companyType: string): Array<{
  skill_set_id: number;
  skill_set_name: string;
  required_level: number;
  criticality: "Critical" | "Important" | "Baseline";
}> {
  const isSuperDream = companyType === "Super Dream";
  const isDream = companyType === "Dream";

  const baseLevel = isSuperDream ? 8 : isDream ? 7 : 6;

  return [
    { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: isSuperDream ? 9 : isDream ? 8 : 6, criticality: "Critical" },
    { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: baseLevel, criticality: "Critical" },
    { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: Math.max(5, baseLevel - 1), criticality: "Important" },
    { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: Math.max(5, baseLevel - 1), criticality: "Important" },
    { skill_set_id: 9, skill_set_name: "Web Technologies & Full Stack", required_level: baseLevel, criticality: "Important" },
    { skill_set_id: 11, skill_set_name: "Git & Software Engineering Practices", required_level: 6, criticality: "Baseline" },
    { skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: isSuperDream ? 8 : 7, criticality: "Critical" },
    { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 7, criticality: "Important" },
  ];
}

/**
 * Evaluates a student against a specific company's required skills
 */
export function calculateCompanyMatch(
  company: {
    companyId?: number;
    company_id?: number;
    name: string;
    shortName?: string;
    short_name?: string;
    logoUrl?: string;
    logo_url?: string;
    category?: string;
    companyType?: string;
    company_type?: string;
    websiteUrl?: string;
    website_url?: string;
    skill_levels?: any[];
    raw?: Record<string, unknown>;
  },
  studentSkills: StudentSkill[],
  profile: CompleteStudentProfile | null
): CompanyMatchResult {
  const companyId = Number(company.companyId ?? company.company_id ?? 1);
  const companyName = company.name || "Company";
  const shortName = company.shortName || company.short_name || companyName;
  const logoUrl = company.logoUrl || company.logo_url || "";
  const category = company.category || "Enterprise Tech";
  const companyType = company.companyType || company.company_type || "Dream";
  const websiteUrl = company.websiteUrl || company.website_url || "";

  // Extract raw skill levels from company object
  let rawSkills: any[] = (company.skill_levels || company.raw?.skill_levels || company.raw?.skills) as any[];
  if (!Array.isArray(rawSkills) || rawSkills.length === 0) {
    rawSkills = getDefaultCompanySkillRequirements(companyType);
  }

  let totalRequiredPoints = 0;
  let totalFulfilledPoints = 0;
  let matchedSkillsCount = 0;
  let needsImprovementCount = 0;
  let missingSkillsCount = 0;
  let totalSkillGap = 0;

  const evaluatedSkills: EvaluatedSkill[] = rawSkills.map((req: any) => {
    const skillId = req.skill_set_id || req.id;
    const skillName = req.skill_set_name || req.name || SKILL_NAMES[skillId] || `Skill #${skillId}`;
    const requiredLevel = Number(req.required_level || 6);
    const criticality = req.criticality || (requiredLevel >= 7 ? "Critical" : requiredLevel >= 5 ? "Important" : "Baseline");

    const studentLevel = getStudentLevelForSkill(skillName, studentSkills);
    const { gap, status, priority } = calculateSkillGap(requiredLevel, studentLevel);

    totalRequiredPoints += requiredLevel;
    totalFulfilledPoints += Math.min(studentLevel, requiredLevel);

    if (status === "Completed") {
      matchedSkillsCount++;
    } else if (status === "Needs Improvement") {
      needsImprovementCount++;
      totalSkillGap += gap;
    } else {
      missingSkillsCount++;
      totalSkillGap += gap;
    }

    return {
      skillId,
      skillName,
      category: classifySkillCategory(skillName),
      companyRequiredLevel: requiredLevel,
      studentLevel,
      gap,
      status,
      priority,
      criticality,
    };
  });

  // Calculate Match %
  const matchPercentage = totalRequiredPoints > 0
    ? Math.min(100, Math.max(0, Math.round((totalFulfilledPoints / totalRequiredPoints) * 100)))
    : 100;

  // Eligibility
  const { isEligible, reason } = checkEligibility(matchPercentage, companyType, profile);

  // Category progress for this company
  const categoryProgress = calculateCategoryProgress(evaluatedSkills, studentSkills);

  // Priority missing skills: sorted by highest gap descending
  const priorityMissingSkills = evaluatedSkills
    .filter((s) => s.status === "Missing" || s.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  return {
    companyId,
    companyName,
    shortName,
    logoUrl,
    category,
    companyType,
    websiteUrl,
    matchPercentage,
    isEligible,
    eligibilityReason: reason,
    matchedSkillsCount,
    needsImprovementCount,
    missingSkillsCount,
    totalSkillGap,
    totalEvaluatedSkills: evaluatedSkills.length,
    skills: evaluatedSkills,
    categoryProgress,
    priorityMissingSkills,
  };
}

/**
 * Calculates progress for all 8 skill categories
 */
export function calculateCategoryProgress(
  evaluatedSkills: EvaluatedSkill[],
  studentSkills: StudentSkill[]
): CategoryProgress[] {
  return MATRIX_CATEGORIES.map((cat) => {
    const inCategory = evaluatedSkills.filter((s) => s.category === cat);
    const studentInCategory = studentSkills.filter((s) => classifySkillCategory(s.skill_name) === cat);

    if (inCategory.length > 0) {
      const requiredPoints = inCategory.reduce((acc, s) => acc + s.companyRequiredLevel, 0);
      const studentPoints = inCategory.reduce((acc, s) => acc + Math.min(s.studentLevel, s.companyRequiredLevel), 0);
      const percentage = requiredPoints > 0 ? Math.min(100, Math.round((studentPoints / requiredPoints) * 100)) : 100;

      return {
        category: cat,
        studentPoints,
        requiredPoints,
        percentage,
        studentSkillCount: studentInCategory.length,
        requiredSkillCount: inCategory.length,
      };
    }

    // If company does not have this category explicitly, benchmark student's existing skills
    const totalStudentPoints = studentInCategory.reduce((acc, s) => acc + s.proficiency, 0);
    const benchmarkTarget = Math.max(10, studentInCategory.length * 10);
    const percentage = studentInCategory.length > 0
      ? Math.min(100, Math.round((totalStudentPoints / benchmarkTarget) * 100))
      : 0;

    return {
      category: cat,
      studentPoints: totalStudentPoints,
      requiredPoints: benchmarkTarget,
      percentage,
      studentSkillCount: studentInCategory.length,
      requiredSkillCount: 0,
    };
  });
}

/**
 * Calculates global matrix metrics and ranks all companies descending by Match %
 */
export function calculateGlobalMatrix(
  companies: CompanySummary[] | any[],
  studentSkills: StudentSkill[],
  profile: CompleteStudentProfile | null
): GlobalMatrixMetrics {
  // If no companies are passed, construct benchmark recruiters
  const effectiveCompanies = (companies && companies.length > 0)
    ? companies
    : getVerifiedDefaultRecruiters();

  // Evaluate every company
  const companyResults: CompanyMatchResult[] = effectiveCompanies.map((comp) =>
    calculateCompanyMatch(comp, studentSkills, profile)
  );

  // Automatically rank descending by match percentage
  const rankedCompanies = [...companyResults].sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.totalSkillGap - b.totalSkillGap;
  });

  // Calculate Overall Readiness %
  const totalMatches = companyResults.reduce((acc, c) => acc + c.matchPercentage, 0);
  const overallReadiness = companyResults.length > 0
    ? Math.min(100, Math.max(0, Math.round(totalMatches / companyResults.length)))
    : 0;

  const readinessColor = getReadinessColor(overallReadiness);
  const totalEligibleCompanies = companyResults.filter((c) => c.isEligible).length;

  // Average student skill score
  const avgScore = studentSkills.length > 0
    ? Number((studentSkills.reduce((acc, s) => acc + s.proficiency, 0) / studentSkills.length).toFixed(1))
    : 0;

  // Priority missing skills aggregated across companies
  const missingMap = new Map<string, EvaluatedSkill>();
  for (const c of companyResults) {
    for (const skill of c.priorityMissingSkills) {
      const existing = missingMap.get(skill.skillName);
      if (!existing || skill.gap > existing.gap) {
        missingMap.set(skill.skillName, skill);
      }
    }
  }

  const highestPrioritySkills = Array.from(missingMap.values())
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 10);

  // Global category progress across all evaluated companies
  const allEvaluatedSkills = companyResults.flatMap((c) => c.skills);
  const categoryProgress = calculateCategoryProgress(allEvaluatedSkills, studentSkills);

  return {
    overallReadiness,
    readinessColor,
    totalEligibleCompanies,
    totalCompanies: effectiveCompanies.length,
    averageSkillScore: avgScore,
    totalSkills: studentSkills.length,
    missingSkillsCount: missingMap.size,
    highestPrioritySkills,
    categoryProgress,
    rankedCompanies,
  };
}

// -----------------------------------------------------------------------------
// Verified Recruiters Seed Dataset (10 Real Recruiters for Offline/Demo Mode)
// -----------------------------------------------------------------------------
export function getVerifiedDefaultRecruiters(): any[] {
  return [
    {
      company_id: 1,
      name: "Accenture plc",
      short_name: "Accenture",
      category: "Enterprise Tech Consulting",
      company_type: "Dream",
      logo_url: "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg",
      website_url: "https://www.accenture.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 8, criticality: "Critical" },
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 7, criticality: "Important" },
        { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: 7, criticality: "Important" },
        { skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: 8, criticality: "Critical" },
        { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 8, criticality: "Important" },
      ],
    },
    {
      company_id: 2,
      name: "Google LLC",
      short_name: "Google",
      category: "Big Tech & AI",
      company_type: "Super Dream",
      logo_url: "https://www.google.com/favicon.ico",
      website_url: "https://about.google",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 9, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 9, criticality: "Critical" },
        { skill_set_id: 10, skill_set_name: "System Design & Distributed Systems", required_level: 9, criticality: "Critical" },
        { skill_set_id: 5, skill_set_name: "Operating Systems & Concurrency", required_level: 8, criticality: "Important" },
        { skill_set_id: 6, skill_set_name: "Computer Networks & Distributed Protocols", required_level: 8, criticality: "Important" },
        { skill_set_id: 11, skill_set_name: "Git & Software Engineering Practices", required_level: 8, criticality: "Important" },
      ],
    },
    {
      company_id: 3,
      name: "Microsoft Corporation",
      short_name: "Microsoft",
      category: "Cloud & Enterprise Software",
      company_type: "Super Dream",
      logo_url: "https://www.microsoft.com/favicon.ico",
      website_url: "https://www.microsoft.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 9, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 9, criticality: "Critical" },
        { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: 8, criticality: "Important" },
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 8, criticality: "Important" },
        { skill_set_id: 10, skill_set_name: "System Design & Distributed Systems", required_level: 8, criticality: "Critical" },
        { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 8, criticality: "Important" },
      ],
    },
    {
      company_id: 4,
      name: "Amazon.com Inc.",
      short_name: "Amazon",
      category: "E-Commerce & Cloud Infrastructure",
      company_type: "Super Dream",
      logo_url: "https://www.amazon.com/favicon.ico",
      website_url: "https://www.amazon.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 9, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 9, criticality: "Critical" },
        { skill_set_id: 10, skill_set_name: "System Design & Distributed Systems", required_level: 9, criticality: "Critical" },
        { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: 8, criticality: "Important" },
        { skill_set_id: 11, skill_set_name: "Git & Software Engineering Practices", required_level: 8, criticality: "Baseline" },
        { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 8, criticality: "Important" },
      ],
    },
    {
      company_id: 5,
      name: "Zoho Corporation",
      short_name: "Zoho",
      category: "SaaS & Product",
      company_type: "Dream",
      logo_url: "https://www.zoho.com/favicon.ico",
      website_url: "https://www.zoho.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 8, criticality: "Critical" },
        { skill_set_id: 9, skill_set_name: "Web Technologies & Full Stack", required_level: 8, criticality: "Critical" },
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 7, criticality: "Important" },
        { skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: 8, criticality: "Critical" },
      ],
    },
    {
      company_id: 6,
      name: "Cisco Systems Inc.",
      short_name: "Cisco",
      category: "Networking & Security",
      company_type: "Dream",
      logo_url: "https://www.cisco.com/favicon.ico",
      website_url: "https://www.cisco.com",
      skill_levels: [
        { skill_set_id: 6, skill_set_name: "Computer Networks & Distributed Protocols", required_level: 9, criticality: "Critical" },
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 8, criticality: "Critical" },
        { skill_set_id: 5, skill_set_name: "Operating Systems & Concurrency", required_level: 8, criticality: "Important" },
        { skill_set_id: 11, skill_set_name: "Git & Software Engineering Practices", required_level: 7, criticality: "Baseline" },
      ],
    },
    {
      company_id: 7,
      name: "Tata Consultancy Services",
      short_name: "TCS",
      category: "IT Services & Consulting",
      company_type: "Regular",
      logo_url: "https://www.tcs.com/favicon.ico",
      website_url: "https://www.tcs.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 6, criticality: "Important" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 6, criticality: "Important" },
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 6, criticality: "Important" },
        { skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: 7, criticality: "Critical" },
        { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 7, criticality: "Critical" },
      ],
    },
    {
      company_id: 8,
      name: "Cognizant Technology Solutions",
      short_name: "Cognizant",
      category: "IT Consulting",
      company_type: "Regular",
      logo_url: "https://www.cognizant.com/favicon.ico",
      website_url: "https://www.cognizant.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 6, criticality: "Important" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 6, criticality: "Important" },
        { skill_set_id: 9, skill_set_name: "Web Technologies & Full Stack", required_level: 6, criticality: "Important" },
        { skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: 7, criticality: "Critical" },
        { skill_set_id: 8, skill_set_name: "Business Communication & HR", required_level: 7, criticality: "Important" },
      ],
    },
    {
      company_id: 9,
      name: "Oracle Corporation",
      short_name: "Oracle",
      category: "Database & Cloud Infrastructure",
      company_type: "Dream",
      logo_url: "https://www.oracle.com/favicon.ico",
      website_url: "https://www.oracle.com",
      skill_levels: [
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 9, criticality: "Critical" },
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 8, criticality: "Critical" },
        { skill_set_id: 10, skill_set_name: "System Design & Distributed Systems", required_level: 8, criticality: "Important" },
        { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: 7, criticality: "Important" },
      ],
    },
    {
      company_id: 10,
      name: "Qualcomm Incorporated",
      short_name: "Qualcomm",
      category: "Semiconductors & Wireless",
      company_type: "Super Dream",
      logo_url: "https://www.qualcomm.com/favicon.ico",
      website_url: "https://www.qualcomm.com",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 9, criticality: "Critical" },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 9, criticality: "Critical" },
        { skill_set_id: 5, skill_set_name: "Operating Systems & Concurrency", required_level: 9, criticality: "Critical" },
        { skill_set_id: 6, skill_set_name: "Computer Networks & Distributed Protocols", required_level: 8, criticality: "Important" },
        { skill_set_id: 11, skill_set_name: "Git & Software Engineering Practices", required_level: 7, criticality: "Baseline" },
      ],
    },
  ];
}
