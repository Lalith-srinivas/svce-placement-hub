import React, { useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/AuthContext";
import {
  calculateCompanyMatch,
  getVerifiedDefaultRecruiters,
} from "@/lib/studentMatrix";
import { CompanyLogo } from "@/components/company/CompanyLogo";
import { CircularReadinessGauge } from "@/components/matrix/CircularReadinessGauge";
import { CategoryProgressBar } from "@/components/matrix/CategoryProgressBar";
import { PriorityMissingSkills } from "@/components/matrix/PriorityMissingSkills";
import { SkillMatrixCard } from "@/components/matrix/SkillMatrixCard";
import { MatrixEligibilityBadge } from "@/components/matrix/MatrixEligibilityBadge";
import { MatrixMetricCard } from "@/components/matrix/MatrixMetricCard";
import type { CompleteStudentProfile, StudentSkill } from "@/types/studentProfile";
import {
  Building2,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

// Standard demo profile for seamless offline/guest access
const DEMO_FALLBACK_PROFILE: CompleteStudentProfile = {
  id: "demo-student-svce-2026",
  personal: {
    full_name: "Lalith Srinivas",
    register_number: "2127210501001",
    college_email: "lalith.student@svce.ac.in",
    personal_email: "lalith@gmail.com",
    phone_number: "+91 9876543210",
    branch: "Computer Science and Engineering (CSE)",
    year: "4th Year (Final Year)",
    section: "A",
    cgpa: 8.92,
    active_backlogs: 0,
  },
  links: {
    github_url: "https://github.com/lalith",
    linkedin_url: "https://linkedin.com/in/lalith",
    portfolio_url: "https://lalith.dev",
    leetcode_url: "https://leetcode.com/u/lalith",
    hackerrank_url: "https://hackerrank.com/profile/lalith",
  },
  resume: null,
  skills: [
    { category: "Programming Languages", skill_name: "Java", proficiency: 9 },
    { category: "Programming Languages", skill_name: "Python", proficiency: 8 },
    { category: "DSA", skill_name: "Data Structures & Algorithms", proficiency: 8 },
    { category: "Frontend", skill_name: "React", proficiency: 8 },
    { category: "Frontend", skill_name: "HTML/CSS", proficiency: 9 },
    { category: "Frontend", skill_name: "TypeScript", proficiency: 7 },
    { category: "Backend", skill_name: "Node.js", proficiency: 7 },
    { category: "Database", skill_name: "SQL & Relational Databases", proficiency: 8 },
    { category: "Database", skill_name: "PostgreSQL", proficiency: 8 },
    { category: "Cloud", skill_name: "AWS", proficiency: 6 },
    { category: "DevOps", skill_name: "Git & GitHub", proficiency: 8 },
    { category: "DevOps", skill_name: "Docker", proficiency: 6 },
    { category: "Soft Skills", skill_name: "Aptitude & Logical Reasoning", proficiency: 8 },
    { category: "Soft Skills", skill_name: "Business Communication", proficiency: 8 },
  ],
  projects: [],
  certifications: [],
  preferences: {
    preferred_role: "Software Development Engineer (SDE)",
    dream_companies: ["Google", "Microsoft", "Amazon", "Zoho", "Accenture"],
    preferred_locations: ["Chennai", "Bangalore", "Hyderabad"],
    expected_package: "15 - 25 LPA (Super Dream)",
    willing_to_relocate: true,
  },
};

export default function CompanyStudentMatrixPage() {
  const { company, selectCompany, companiesList } = useCompany();
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();

  // If query parameter ?id=... is present and differs from selected company, hydrate it
  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      const parsedId = parseInt(idParam, 10);
      if (parsedId && (!company || company.companyId !== parsedId)) {
        selectCompany(parsedId);
      }
    }
  }, [searchParams, company, selectCompany]);

  // Active student profile: user's profile if available with skills, else fallback to verified demo
  const activeProfile: CompleteStudentProfile = useMemo(() => {
    if (profile && profile.skills && profile.skills.length > 0) {
      return profile;
    }
    return DEMO_FALLBACK_PROFILE;
  }, [profile]);

  const studentSkills: StudentSkill[] = useMemo(() => {
    return activeProfile.skills || [];
  }, [activeProfile]);

  // If no company is selected, fallback to the first recruiter
  const targetCompany = useMemo(() => {
    if (company) return company;
    if (companiesList && companiesList.length > 0) return companiesList[0];
    const defaultRecruiters = getVerifiedDefaultRecruiters();
    return defaultRecruiters[0];
  }, [company, companiesList]);

  // Compute deterministic match metrics for this company
  const matchResult = useMemo(() => {
    return calculateCompanyMatch(targetCompany, studentSkills, activeProfile);
  }, [targetCompany, studentSkills, activeProfile]);

  if (!targetCompany) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-center bg-[#FFFDF5]">
        <div className="rounded-xl border-3 border-black bg-white p-8 shadow-neo max-w-md">
          <Building2 className="h-10 w-10 mx-auto text-black mb-3 stroke-[1.5]" />
          <h2 className="font-heading text-lg font-black text-black">No Recruiter Selected</h2>
          <p className="mt-1 font-mono text-xs text-slate-600 font-bold">
            Please choose a recruiter from the matrix ranking or directory.
          </p>
          <Link
            to="/matrix"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-neo-cyan px-4 py-2 font-mono text-xs font-black text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            <span>Go to My Matrix</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Recruiter Header Bar */}
        <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <CompanyLogo
                name={targetCompany.name}
                logoUrl={targetCompany.logoUrl}
                websiteUrl={targetCompany.websiteUrl}
                className="h-16 w-16 shrink-0 rounded-xl border-3 border-black bg-white p-2 shadow-neo-sm"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-black text-black">
                    {targetCompany.name}
                  </h1>
                  <span className="rounded-md border-2 border-black bg-neo-cyan px-2.5 py-0.5 font-mono text-[11px] font-black text-black shadow-neo-sm">
                    {targetCompany.companyType}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-600 font-bold">
                  {targetCompany.category} • Student Matrix Compatibility Assessment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/matrix"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3.5 py-2 font-mono text-xs font-black text-black hover:bg-neo-yellow transition-colors shadow-neo-sm"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                <span>All Companies</span>
              </Link>

              {targetCompany.websiteUrl && (
                <a
                  href={targetCompany.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3.5 py-2 font-mono text-xs font-black text-black hover:bg-slate-100 transition-colors shadow-neo-sm"
                >
                  <Globe className="h-4 w-4 stroke-[2.5]" />
                  <span>Careers</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Overall Match % with Circular Gauge */}
          <div className="rounded-xl border-3 border-black bg-white p-5 shadow-neo flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-black block mb-1">
                Overall Match %
              </span>
              <span
                className={`font-heading text-3xl font-black ${
                  matchResult.matchPercentage >= 85
                    ? "text-emerald-700"
                    : matchResult.matchPercentage >= 60
                    ? "text-amber-700"
                    : "text-rose-700"
                }`}
              >
                {matchResult.matchPercentage}%
              </span>
              <p className="font-mono text-[10px] text-slate-600 mt-1 font-bold">
                Required vs Student proficiency
              </p>
            </div>

            <CircularReadinessGauge
              percentage={matchResult.matchPercentage}
              size="sm"
              showLabel={false}
            />
          </div>

          {/* Eligibility Badge */}
          <div className="rounded-xl border-3 border-black bg-white p-5 shadow-neo flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-black block mb-2">
                Placement Eligibility
              </span>
              <MatrixEligibilityBadge
                isEligible={matchResult.isEligible}
                reason={matchResult.eligibilityReason}
                showReason={true}
              />
            </div>
            <p className="font-mono text-[10px] text-slate-600 font-bold mt-2 border-t-2 border-slate-200 pt-2">
              Based on active backlogs, CGPA &amp; screening bar
            </p>
          </div>

          {/* Matched vs Missing Skills */}
          <MatrixMetricCard
            label="Matched Skills"
            value={`${matchResult.matchedSkillsCount} / ${matchResult.totalEvaluatedSkills}`}
            subtext={`${matchResult.missingSkillsCount} skill(s) currently missing`}
            icon={CheckCircle2}
            iconColor="text-black"
            iconBg="bg-neo-green"
            badge="Proficiency Met"
          />

          {/* Total Skill Gap */}
          <MatrixMetricCard
            label="Cumulative Skill Gap"
            value={`${matchResult.totalSkillGap} pts`}
            subtext="Required Level − Student Level"
            icon={AlertTriangle}
            iconColor="text-black"
            iconBg={matchResult.totalSkillGap === 0 ? "bg-neo-green" : "bg-neo-yellow"}
            badge={matchResult.totalSkillGap === 0 ? "Zero Gap" : "Focus Areas"}
          />
        </div>

        {/* 2-Column Section: 8 Categories Progress + Priority Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Skill Categories Progress Bars (7 Cols) */}
          <div className="lg:col-span-7">
            <CategoryProgressBar
              categories={matchResult.categoryProgress}
              title={`${targetCompany.shortName || targetCompany.name} Skill Category Fit`}
            />
          </div>

          {/* Priority Section: Sort missing skills by highest gap (5 Cols) */}
          <div className="lg:col-span-5">
            <PriorityMissingSkills
              skills={matchResult.priorityMissingSkills}
              title="Priority Focus For This Recruiter"
              description="Missing or below-benchmark skills sorted by largest gap. Closing these gaps yields the highest readiness bump."
            />
          </div>
        </div>

        {/* Evaluated Skills Grid: Every Skill Card */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-4 border-black pb-3">
            <div>
              <h3 className="font-heading text-xl font-black uppercase tracking-wide text-black">
                Detailed Skill Breakdown ({matchResult.skills.length})
              </h3>
              <p className="font-mono text-xs text-slate-600 font-bold">
                Every skill evaluated with Company Required Level, Student Level, Gap, and Status.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-black">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-neo-green border border-black" />
                {matchResult.matchedSkillsCount} Completed
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="h-2 w-2 rounded-full bg-neo-yellow border border-black" />
                {matchResult.needsImprovementCount} Needs Imp.
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="h-2 w-2 rounded-full bg-neo-pink border border-black" />
                {matchResult.missingSkillsCount} Missing
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchResult.skills.map((skill) => (
              <SkillMatrixCard key={skill.skillName} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
