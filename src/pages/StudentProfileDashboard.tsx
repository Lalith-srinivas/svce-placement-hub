import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { calculateProfileCompletion } from "@/lib/profileApi";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import {
  User,
  Award,
  FolderGit2,
  FileText,
  Globe,
  Code2,
  Terminal,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Compass,
  LogOut,
  Sparkles,
  Activity,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

export default function StudentProfileDashboard() {
  const { user, profile, hasProfile, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but profile doesn't exist -> redirect to onboarding
  if (!hasProfile) {
    return <Navigate to="/profile/onboarding" replace />;
  }

  const completion = calculateProfileCompletion(profile);
  const cgpaValue = parseFloat(String(profile?.personal?.cgpa || "0"));

  // Derive placement eligibility category based on SVCE criteria
  const getEligibilityTier = (cgpa: number, backlogs: number) => {
    if (backlogs > 0) return { label: "Restricted (Active Backlogs)", color: "bg-neo-red text-black" };
    if (cgpa >= 8.5) return { label: "Super Dream Tier (15+ LPA Eligible)", color: "bg-neo-purple text-black" };
    if (cgpa >= 7.5) return { label: "Dream Tier (8-15 LPA Eligible)", color: "bg-neo-cyan text-black" };
    if (cgpa >= 6.5) return { label: "Standard Tier (6-8 LPA Eligible)", color: "bg-neo-green text-black" };
    return { label: "Regular Tier (4-6 LPA)", color: "bg-neo-yellow text-black" };
  };

  const backlogsCount = parseInt(String(profile?.personal?.active_backlogs || "0"), 10);
  const tierInfo = getEligibilityTier(cgpaValue, backlogsCount);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      {/* Profile Header Bar */}
      <section className="border-b-4 border-black bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-3 border-black bg-neo-yellow text-black shadow-neo font-heading text-2xl font-black">
                {profile?.personal?.full_name?.charAt(0) || "S"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-2xl font-black uppercase text-black sm:text-3xl">
                    {profile?.personal?.full_name}
                  </h1>
                  <span className={`rounded-md border-2 border-black px-2.5 py-0.5 font-mono text-xs font-black shadow-neo-sm ${tierInfo.color}`}>
                    {tierInfo.label}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-slate-700">
                  Reg No: <span className="text-black">{profile?.personal?.register_number}</span> • {profile?.personal?.branch} • {profile?.personal?.year} (Sec {profile?.personal?.section})
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-yellow px-4 py-2 font-heading text-xs font-black uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Edit3 className="h-4 w-4 stroke-[2.5]" />
                Edit Profile
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-2 font-heading text-xs font-bold text-slate-700 shadow-neo-sm hover:bg-slate-50 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Metric Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* CGPA */}
          <div className="rounded-xl border-3 border-black bg-white p-4 shadow-neo sm:p-5">
            <span className="font-mono text-[11px] font-black uppercase text-slate-500">
              Academic CGPA
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-black sm:text-4xl">
                {profile?.personal?.cgpa}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">/ 10.0</span>
            </div>
            <p className="mt-1 font-mono text-[11px] font-bold text-slate-600">
              {backlogsCount === 0 ? "0 Active Backlogs (Clean)" : `${backlogsCount} Active Backlogs`}
            </p>
          </div>

          {/* Skills Count */}
          <div className="rounded-xl border-3 border-black bg-white p-4 shadow-neo sm:p-5">
            <span className="font-mono text-[11px] font-black uppercase text-slate-500">
              Skills Calibrated
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-black sm:text-4xl">
                {profile?.skills?.length || 0}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">verified</span>
            </div>
            <p className="mt-1 font-mono text-[11px] font-bold text-slate-600">
              Across 7 tech domains
            </p>
          </div>

          {/* Projects Count */}
          <div className="rounded-xl border-3 border-black bg-white p-4 shadow-neo sm:p-5">
            <span className="font-mono text-[11px] font-black uppercase text-slate-500">
              Portfolio Projects
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-black sm:text-4xl">
                {profile?.projects?.length || 0}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">built</span>
            </div>
            <p className="mt-1 font-mono text-[11px] font-bold text-slate-600">
              With GitHub & live links
            </p>
          </div>

          {/* Certifications Count */}
          <div className="rounded-xl border-3 border-black bg-white p-4 shadow-neo sm:p-5">
            <span className="font-mono text-[11px] font-black uppercase text-slate-500">
              Certifications
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-black sm:text-4xl">
                {profile?.certifications?.length || 0}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">credentials</span>
            </div>
            <p className="mt-1 font-mono text-[11px] font-bold text-slate-600">
              Industry verified
            </p>
          </div>
        </div>

        {/* 2-Column Grid: Left (Profile & Resume & Completion), Right (Preferences & Links & Activity) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card & Details */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black">
                    <User className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h2 className="font-heading text-lg font-black uppercase text-black">
                    Student Information Card
                  </h2>
                </div>
                <span className="rounded border border-black bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                  Verified Candidate
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
                <div>
                  <span className="text-slate-500">Institutional Email:</span>
                  <p className="font-bold text-black mt-0.5">{profile?.personal?.college_email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Personal Email:</span>
                  <p className="font-bold text-black mt-0.5">{profile?.personal?.personal_email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Contact Number:</span>
                  <p className="font-bold text-black mt-0.5">{profile?.personal?.phone_number}</p>
                </div>
                <div>
                  <span className="text-slate-500">Academic Standing:</span>
                  <p className="font-bold text-black mt-0.5">
                    {profile?.personal?.branch} — {profile?.personal?.year}
                  </p>
                </div>
              </div>

              {/* Social & Coding Links Row */}
              <div className="mt-6 border-t-2 border-slate-100 pt-4">
                <span className="font-mono text-[11px] font-black uppercase text-slate-500 block mb-2">
                  Connected Coding & Professional Handles
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile?.links?.github_url && (
                    <a
                      href={profile.links.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-slate-100 transition-all"
                    >
                      <GithubIcon className="h-4 w-4" />
                      GitHub Profile
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}

                  {profile?.links?.linkedin_url && (
                    <a
                      href={profile.links.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#0077B5]/10 px-3 py-1.5 font-heading text-xs font-bold text-[#0077B5] border-[#0077B5] shadow-neo-sm hover:bg-[#0077B5]/20 transition-all"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}

                  {profile?.links?.leetcode_url && (
                    <a
                      href={profile.links.leetcode_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FFA116]/10 px-3 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-[#FFA116]/20 transition-all"
                    >
                      <Code2 className="h-4 w-4 text-[#FFA116]" />
                      LeetCode
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}

                  {profile?.links?.hackerrank_url && (
                    <a
                      href={profile.links.hackerrank_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-slate-100 transition-all"
                    >
                      <Terminal className="h-4 w-4 text-emerald-600" />
                      HackerRank
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}

                  {profile?.links?.portfolio_url && (
                    <a
                      href={profile.links.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-slate-100 transition-all"
                    >
                      <Globe className="h-4 w-4 text-blue-600" />
                      Portfolio
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Skills Calibrated */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-purple text-black">
                    <Sparkles className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h2 className="font-heading text-lg font-black uppercase text-black">
                    Calibrated Technical Skills ({profile?.skills?.length || 0})
                  </h2>
                </div>
                <Link
                  to="/profile/edit"
                  className="text-xs font-mono font-bold text-blue-700 hover:underline"
                >
                  Adjust Proficiency
                </Link>
              </div>

              {profile?.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {profile.skills.map((skill) => {
                    const pct = skill.proficiency * 10;
                    return (
                      <div
                        key={skill.skill_name}
                        className="rounded-lg border-2 border-black bg-slate-50 p-3 shadow-neo-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-xs font-black text-black">
                              {skill.skill_name}
                            </span>
                            <span className="font-mono text-[9px] text-slate-500">
                              ({skill.category})
                            </span>
                          </div>
                          <span className="rounded bg-black px-1.5 py-0.5 font-mono text-[10px] font-black text-white">
                            {skill.proficiency}/10
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full border border-black bg-slate-200">
                          <div
                            className="h-full bg-neo-yellow transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-mono text-xs text-slate-500">No skills added yet.</p>
              )}
            </div>

            {/* Projects Showcase */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-black">
                    <FolderGit2 className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h2 className="font-heading text-lg font-black uppercase text-black">
                    Technical Projects ({profile?.projects?.length || 0})
                  </h2>
                </div>
                <Link
                  to="/profile/edit"
                  className="text-xs font-mono font-bold text-blue-700 hover:underline"
                >
                  + Add Project
                </Link>
              </div>

              {profile?.projects && profile.projects.length > 0 ? (
                <div className="space-y-4">
                  {profile.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="rounded-lg border-2 border-black bg-slate-50 p-4 shadow-neo-sm"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-heading text-base font-black text-black">
                            {proj.name}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-slate-700">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {proj.github_url && (
                            <a
                              href={proj.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-black bg-white px-2 py-1 font-mono text-[11px] font-bold text-black hover:bg-slate-100"
                            >
                              <GithubIcon className="h-3 w-3" />
                              Repo
                            </a>
                          )}
                          {proj.demo_url && (
                            <a
                              href={proj.demo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-black bg-neo-cyan px-2 py-1 font-mono text-[11px] font-black text-black hover:bg-sky-300"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.tech_stack && proj.tech_stack.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
                          {proj.tech_stack.map((t) => (
                            <span
                              key={t}
                              className="rounded border border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-slate-500">
                  No projects added yet. Add projects to strengthen your placement resume.
                </p>
              )}
            </div>

            {/* Certifications Grid */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-green text-black">
                    <Award className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h2 className="font-heading text-lg font-black uppercase text-black">
                    Verified Certifications ({profile?.certifications?.length || 0})
                  </h2>
                </div>
                <Link
                  to="/profile/edit"
                  className="text-xs font-mono font-bold text-blue-700 hover:underline"
                >
                  Manage
                </Link>
              </div>

              {profile?.certifications && profile.certifications.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {profile.certifications.map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      className="rounded-lg border-2 border-black bg-slate-50 p-3 shadow-neo-sm flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-heading text-xs font-black text-black">
                          {cert.name}
                        </h4>
                        <p className="font-mono text-[11px] font-bold text-slate-600 mt-0.5">
                          {cert.organization} • {cert.year}
                        </p>
                      </div>
                      {cert.credential_url && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-black text-blue-700 hover:underline"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-slate-500">No certifications recorded yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Completion %, Resume, Preferences & Activity */}
          <div className="space-y-8">
            {/* Profile Completion Card */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-black uppercase text-slate-700">
                  Profile Completion
                </span>
                <span className="rounded-md border border-black bg-neo-yellow px-2 py-0.5 font-mono text-xs font-black text-black">
                  {completion.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full overflow-hidden rounded-full border-2 border-black bg-slate-100 mb-4">
                <div
                  className="h-full bg-neo-green transition-all duration-700"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[11px] font-black uppercase text-slate-500">
                  Checklist:
                </p>
                {completion.completedTasks.map((task) => (
                  <div key={task} className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
                {completion.pendingTasks.map((task) => (
                  <div key={task} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-400 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Uploaded Card */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-pink text-black">
                  <FileText className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="font-heading text-sm font-black uppercase text-black">
                  Resume Document
                </h3>
              </div>

              {profile?.resume?.file_url ? (
                <div className="rounded-lg border-2 border-black bg-slate-50 p-4 shadow-neo-sm">
                  <p className="font-heading text-xs font-black text-black truncate">
                    {profile.resume.file_name}
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                    Uploaded: {new Date(profile.resume.uploaded_at).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={profile.resume.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded border-2 border-black bg-neo-yellow py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-yellow-300"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Resume
                    </a>
                    <Link
                      to="/profile/edit"
                      className="rounded border-2 border-black bg-white px-2.5 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-slate-100"
                      title="Update Resume"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                  <p className="font-heading text-xs font-bold text-slate-800">
                    No Resume Uploaded
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Recruiters require an ATS-formatted PDF resume.
                  </p>
                  <Link
                    to="/profile/edit"
                    className="mt-3 inline-flex rounded-md border-2 border-black bg-neo-yellow px-3 py-1 font-heading text-xs font-black uppercase shadow-neo-sm"
                  >
                    Upload PDF
                  </Link>
                </div>
              )}
            </div>

            {/* Placement Preferences Card */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-orange text-black">
                  <Compass className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="font-heading text-sm font-black uppercase text-black">
                  Placement Preferences
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-500">Target Role:</span>
                  <p className="font-bold text-black mt-0.5">
                    {profile?.preferences?.preferred_role || "Not specified"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Expected CTC:</span>
                  <p className="font-bold text-black mt-0.5">
                    {profile?.preferences?.expected_package || "Not specified"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Relocation Readiness:</span>
                  <p className="font-bold text-black mt-0.5">
                    {profile?.preferences?.willing_to_relocate ? "✅ Willing to Relocate Anywhere" : "📍 Preferred Locations Only"}
                  </p>
                </div>

                {profile?.preferences?.dream_companies && profile.preferences.dream_companies.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Dream Companies:</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.preferences.dream_companies.map((co) => (
                        <span
                          key={co}
                          className="rounded border border-black bg-neo-purple/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-950"
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile?.preferences?.preferred_locations && profile.preferences.preferred_locations.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Preferred Locations:</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.preferences.preferred_locations.map((loc) => (
                        <span
                          key={loc}
                          className="rounded border border-black bg-neo-cyan/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-950"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-green text-black">
                  <Activity className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="font-heading text-sm font-black uppercase text-black">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2 border-l-2 border-black pl-3 py-1">
                  <div>
                    <p className="font-bold text-black">Profile Synced with Placement Hub</p>
                    <p className="text-[10px] text-slate-500">Live & verified for drives</p>
                  </div>
                </div>

                {profile?.resume?.uploaded_at && (
                  <div className="flex items-start gap-2 border-l-2 border-black pl-3 py-1">
                    <div>
                      <p className="font-bold text-black">Resume PDF Uploaded</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(profile.resume.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 border-l-2 border-black pl-3 py-1">
                  <div>
                    <p className="font-bold text-black">Placement Preferences Set</p>
                    <p className="text-[10px] text-slate-500">{profile?.preferences?.preferred_role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
