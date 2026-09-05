import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { calculateGlobalMatrix } from "@/lib/studentMatrix";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { CircularReadinessGauge } from "@/components/matrix/CircularReadinessGauge";
import { CategoryProgressBar } from "@/components/matrix/CategoryProgressBar";
import { PriorityMissingSkills } from "@/components/matrix/PriorityMissingSkills";
import { TopMatchesRankingTable } from "@/components/matrix/TopMatchesRankingTable";
import { MatrixMetricCard } from "@/components/matrix/MatrixMetricCard";
import type { CompleteStudentProfile, StudentSkill } from "@/types/studentProfile";
import {
  Sparkles,
  Building2,
  Award,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  Edit3,
} from "lucide-react";

// Standard benchmark demo profile for instant evaluation
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

export default function MyMatrixPage() {
  const { user, profile } = useAuth();
  const { companiesList } = useCompany();

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

  // Compute deterministic placement matrix metrics
  const matrixMetrics = useMemo(() => {
    return calculateGlobalMatrix(companiesList, studentSkills, activeProfile);
  }, [companiesList, studentSkills, activeProfile]);

  const isDemo = !user || !profile || !profile.skills || profile.skills.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      <HomeNavbar />

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Glow ambient decorations */}
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-bold text-cyan-400 mb-3 shadow-inner">
                <Sparkles className="h-3.5 w-3.5" />
                <span>STUDENT MATRIX PLACEMENT READINESS</span>
              </div>

              <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Placement Skill Matrix
              </h1>
              <p className="mt-3 max-w-2xl font-mono text-xs sm:text-sm text-slate-400 leading-relaxed">
                Deterministic skill gap intelligence benchmarked against every campus recruiter. 
                Calculated entirely from verified database thresholds — without generative assumptions.
              </p>

              {/* Student Details Pill */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-mono">
                  <GraduationCap className="h-4 w-4 text-cyan-400" />
                  <span className="text-slate-300 font-bold">{activeProfile.personal.full_name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{activeProfile.personal.branch}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{activeProfile.personal.cgpa} CGPA</span>
                </div>

                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Update Skills</span>
                </Link>
              </div>
            </div>

            {/* Overall Readiness Circular Gauge in Hero */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl shrink-0">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">
                Overall Placement Readiness
              </span>
              <CircularReadinessGauge
                percentage={matrixMetrics.overallReadiness}
                size="lg"
                showLabel={true}
              />
              <span className="mt-2 font-mono text-[10px] text-slate-400">
                Screening Benchmark Score
              </span>
            </div>
          </div>

          {/* Demo Mode Notice Banner if viewing fallback */}
          {isDemo && (
            <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-cyan-800/60 bg-cyan-950/40 p-3.5 text-xs font-mono text-cyan-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  Viewing Demo Student (Lalith Srinivas, CSE). Sign in or customize profile skills to test your personal matrix.
                </span>
              </div>
              <Link
                to="/login"
                className="shrink-0 font-bold underline hover:text-white"
              >
                Sign In &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* KPI Metrics Cards Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Eligible Companies */}
          <MatrixMetricCard
            label="Eligible Recruiters"
            value={`${matrixMetrics.totalEligibleCompanies} / ${matrixMetrics.totalCompanies}`}
            subtext="Companies meeting all criteria"
            icon={Building2}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10 border-emerald-500/30"
            badge="Meets Criteria"
          />

          {/* Average Skill Score */}
          <MatrixMetricCard
            label="Average Skill Score"
            value={`${matrixMetrics.averageSkillScore} / 10`}
            subtext="Across all verified skills"
            icon={Award}
            iconColor="text-cyan-400"
            iconBg="bg-cyan-500/10 border-cyan-500/30"
            badge="Proficiency Level"
          />

          {/* Total Skills */}
          <MatrixMetricCard
            label="Verified Skills"
            value={`${matrixMetrics.totalSkills} Skills`}
            subtext="Logged in student profile"
            icon={Layers}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/10 border-purple-500/30"
            badge="Active Stack"
          />

          {/* Missing Skills Count */}
          <MatrixMetricCard
            label="Missing Skills"
            value={`${matrixMetrics.missingSkillsCount} Skills`}
            subtext="High-demand recruiter gaps"
            icon={AlertTriangle}
            iconColor="text-rose-400"
            iconBg="bg-rose-500/10 border-rose-500/30"
            badge="Action Required"
          />
        </section>

        {/* 2-Column Section: 8 Categories Progress (Left) + Priority Missing Skills (Right) */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 8 Skill Categories Progress (7 Cols) */}
          <div className="lg:col-span-7">
            <CategoryProgressBar
              categories={matrixMetrics.categoryProgress}
              title="8 Skill Category Benchmarks"
            />
          </div>

          {/* Highest Priority Missing Skills (5 Cols) */}
          <div className="lg:col-span-5">
            <PriorityMissingSkills
              skills={matrixMetrics.highestPrioritySkills}
              title="Highest Priority Skills"
              description="Missing skills sorted by largest recruiter gap. Master these to unlock more dream recruiters."
            />
          </div>
        </section>

        {/* Top Matches Ranking Table across all 118 Companies */}
        <section>
          <TopMatchesRankingTable companies={matrixMetrics.rankedCompanies} />
        </section>
      </main>
    </div>
  );
}
