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
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl max-w-md">
          <Building2 className="h-10 w-10 mx-auto text-slate-500 mb-3" />
          <h2 className="font-heading text-lg font-black">No Recruiter Selected</h2>
          <p className="mt-1 font-mono text-xs text-slate-400">
            Please choose a recruiter from the matrix ranking or directory.
          </p>
          <Link
            to="/matrix"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-600 px-4 py-2 font-mono text-xs font-bold text-white shadow hover:bg-cyan-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to My Matrix</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Recruiter Header Bar */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <CompanyLogo
                name={targetCompany.name}
                logoUrl={targetCompany.logoUrl}
                websiteUrl={targetCompany.websiteUrl}
                className="h-16 w-16 shrink-0 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-lg"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-black text-white">
                    {targetCompany.name}
                  </h1>
                  <span className="rounded-md border border-cyan-800/80 bg-cyan-950/80 px-2.5 py-0.5 font-mono text-[11px] font-bold text-cyan-300">
                    {targetCompany.companyType}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {targetCompany.category} • Student Matrix Compatibility Assessment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/matrix"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 font-mono text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>All Companies</span>
              </Link>

              {targetCompany.websiteUrl && (
                <a
                  href={targetCompany.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span>Careers</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Overall Match % with Circular Gauge */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-1">
                Overall Match %
              </span>
              <span
                className={`font-heading text-3xl font-black ${
                  matchResult.matchPercentage >= 85
                    ? "text-emerald-400"
                    : matchResult.matchPercentage >= 60
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {matchResult.matchPercentage}%
              </span>
              <p className="font-mono text-[10px] text-slate-500 mt-1">
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-2">
                Placement Eligibility
              </span>
              <MatrixEligibilityBadge
                isEligible={matchResult.isEligible}
                reason={matchResult.eligibilityReason}
                showReason={true}
              />
            </div>
            <p className="font-mono text-[10px] text-slate-500 mt-2 border-t border-slate-800/80 pt-2">
              Based on active backlogs, CGPA &amp; screening bar
            </p>
          </div>

          {/* Matched vs Missing Skills */}
          <MatrixMetricCard
            label="Matched Skills"
            value={`${matchResult.matchedSkillsCount} / ${matchResult.totalEvaluatedSkills}`}
            subtext={`${matchResult.missingSkillsCount} skill(s) currently missing`}
            icon={CheckCircle2}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10 border-emerald-500/30"
            badge="Proficiency Met"
          />

          {/* Total Skill Gap */}
          <MatrixMetricCard
            label="Cumulative Skill Gap"
            value={`${matchResult.totalSkillGap} pts`}
            subtext="Required Level − Student Level"
            icon={AlertTriangle}
            iconColor={matchResult.totalSkillGap === 0 ? "text-emerald-400" : "text-amber-400"}
            iconBg={
              matchResult.totalSkillGap === 0
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-amber-500/10 border-amber-500/30"
            }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-heading text-xl font-black uppercase tracking-wide text-white">
                Detailed Skill Breakdown ({matchResult.skills.length})
              </h3>
              <p className="font-mono text-xs text-slate-400">
                Every skill evaluated with Company Required Level, Student Level, Gap, and Status.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {matchResult.matchedSkillsCount} Completed
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                {matchResult.needsImprovementCount} Needs Imp.
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
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
