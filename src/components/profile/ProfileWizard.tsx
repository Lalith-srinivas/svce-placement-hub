import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { saveCompleteStudentProfile } from "@/lib/profileApi";
import type {
  CompleteStudentProfile,
  StudentPersonalDetails,
  StudentLinks,
  ResumeData,
  StudentSkill,
  StudentProject,
  StudentCertification,
  StudentPreferences,
} from "@/types/studentProfile";
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep";
import { ProfessionalLinksStep } from "./steps/ProfessionalLinksStep";
import { TechnicalSkillsStep } from "./steps/TechnicalSkillsStep";
import { ProjectsStep } from "./steps/ProjectsStep";
import { CertificationsStep } from "./steps/CertificationsStep";
import { PlacementPreferencesStep } from "./steps/PlacementPreferencesStep";
import {
  User,
  Link2,
  Cpu,
  FolderGit2,
  Award,
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface WizardProps {
  initialProfile?: CompleteStudentProfile | null;
  isEditMode?: boolean;
}

const STEPS = [
  { id: 1, title: "Personal Details", short: "Personal", icon: User },
  { id: 2, title: "Links & Resume", short: "Links & Resume", icon: Link2 },
  { id: 3, title: "Technical Skills", short: "Skills", icon: Cpu },
  { id: 4, title: "Projects", short: "Projects", icon: FolderGit2 },
  { id: 5, title: "Certifications", short: "Certifications", icon: Award },
  { id: 6, title: "Preferences", short: "Preferences", icon: Compass },
];

export const ProfileWizard: React.FC<WizardProps> = ({ initialProfile, isEditMode = false }) => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State initialized with either initialProfile or clean defaults
  const [personal, setPersonal] = useState<StudentPersonalDetails>(
    initialProfile?.personal || {
      full_name: user?.full_name || "",
      register_number: "",
      college_email: user?.email?.includes("svce.ac.in") ? user.email : "",
      personal_email: !user?.email?.includes("svce.ac.in") ? user?.email || "" : "",
      phone_number: "",
      branch: "",
      year: "",
      section: "",
      cgpa: "",
      active_backlogs: 0,
    }
  );

  const [links, setLinks] = useState<StudentLinks>(
    initialProfile?.links || {
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
      leetcode_url: "",
      hackerrank_url: "",
    }
  );

  const [resume, setResume] = useState<ResumeData | null>(initialProfile?.resume || null);

  const [skills, setSkills] = useState<StudentSkill[]>(
    initialProfile?.skills || [
      { category: "Programming Languages", skill_name: "Java", proficiency: 8 },
      { category: "Programming Languages", skill_name: "Python", proficiency: 7 },
      { category: "Frontend", skill_name: "React", proficiency: 8 },
      { category: "Database", skill_name: "PostgreSQL", proficiency: 7 },
    ]
  );

  const [projects, setProjects] = useState<StudentProject[]>(
    initialProfile?.projects || []
  );

  const [certifications, setCertifications] = useState<StudentCertification[]>(
    initialProfile?.certifications || []
  );

  const [preferences, setPreferences] = useState<StudentPreferences>(
    initialProfile?.preferences || {
      preferred_role: "Software Development Engineer (SDE)",
      dream_companies: ["Accenture", "Google", "Amazon", "Zoho"],
      preferred_locations: ["Chennai", "Bangalore", "Hyderabad"],
      expected_package: "10 - 15 LPA (Dream)",
      willing_to_relocate: true,
    }
  );

  // Validation functions
  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!personal.full_name.trim()) errs.full_name = "Full Name is required";
      if (!personal.register_number.trim()) errs.register_number = "Register Number is required";
      if (!personal.college_email.trim()) {
        errs.college_email = "College email is required";
      } else if (!personal.college_email.includes("@")) {
        errs.college_email = "Enter a valid email address";
      }
      if (!personal.personal_email.trim()) {
        errs.personal_email = "Personal email is required";
      } else if (!personal.personal_email.includes("@")) {
        errs.personal_email = "Enter a valid email address";
      }
      if (!personal.phone_number.trim()) errs.phone_number = "Phone number is required";
      if (!personal.branch) errs.branch = "Please select your department";
      if (!personal.year) errs.year = "Please select year of study";
      if (!personal.section) errs.section = "Please select section";

      const cgpaNum = parseFloat(String(personal.cgpa));
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        errs.cgpa = "CGPA must be a valid number between 0.0 and 10.0";
      }

      const backlogsNum = parseInt(String(personal.active_backlogs), 10);
      if (isNaN(backlogsNum) || backlogsNum < 0) {
        errs.active_backlogs = "Active backlogs cannot be negative";
      }
    }

    if (step === 2) {
      if (links.github_url && !isValidUrl(links.github_url)) {
        errs.github_url = "Please enter a valid URL (starting with https://)";
      }
      if (links.linkedin_url && !isValidUrl(links.linkedin_url)) {
        errs.linkedin_url = "Please enter a valid URL (starting with https://)";
      }
      if (links.portfolio_url && !isValidUrl(links.portfolio_url)) {
        errs.portfolio_url = "Please enter a valid URL";
      }
      if (links.leetcode_url && !isValidUrl(links.leetcode_url)) {
        errs.leetcode_url = "Please enter a valid URL";
      }
      if (links.hackerrank_url && !isValidUrl(links.hackerrank_url)) {
        errs.hackerrank_url = "Please enter a valid URL";
      }
    }

    if (step === 3) {
      if (skills.length === 0) {
        errs.skills = "Please select at least 1 technical skill to proceed";
      }
    }

    if (step === 4) {
      for (let i = 0; i < projects.length; i++) {
        if (!projects[i].name.trim()) {
          errs.projects = `Project #${i + 1} is missing a name`;
          break;
        }
        if (!projects[i].description.trim()) {
          errs.projects = `Project #${i + 1} is missing a description`;
          break;
        }
        if (projects[i].github_url && !isValidUrl(projects[i].github_url)) {
          errs.projects = `Project #${i + 1} has an invalid GitHub URL`;
          break;
        }
        if (projects[i].demo_url && !isValidUrl(projects[i].demo_url)) {
          errs.projects = `Project #${i + 1} has an invalid Demo URL`;
          break;
        }
      }
    }

    if (step === 5) {
      for (let i = 0; i < certifications.length; i++) {
        if (!certifications[i].name.trim()) {
          errs.certifications = `Certification #${i + 1} is missing a name`;
          break;
        }
        if (!certifications[i].organization.trim()) {
          errs.certifications = `Certification #${i + 1} is missing an organization`;
          break;
        }
      }
    }

    if (step === 6) {
      if (!preferences.preferred_role.trim()) {
        errs.preferred_role = "Preferred role is required";
      }
      if (!preferences.expected_package) {
        errs.expected_package = "Please select an expected package tier";
      }
      if (!preferences.dream_companies || preferences.dream_companies.length === 0) {
        errs.dream_companies = "Please select or add at least 1 dream company";
      }
      if (!preferences.preferred_locations || preferences.preferred_locations.length === 0) {
        errs.preferred_locations = "Please select at least 1 preferred job location";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please resolve the highlighted fields to continue.");
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    // Validate current and previous steps
    for (let s = 1; s <= 6; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        toast.error(`Please complete Step ${s} before saving.`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const studentId = user?.id || "demo-student-svce-2026";
      await saveCompleteStudentProfile(studentId, {
        personal,
        links,
        resume,
        skills,
        projects,
        certifications,
        preferences,
      });

      await refreshProfile();
      toast.success(
        isEditMode
          ? "Profile updated successfully!"
          : "🎉 Student Profile created successfully!"
      );
      navigate("/profile", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border-3 border-black bg-white shadow-neo">
      {/* Stepper Progress Header */}
      <div className="border-b-3 border-black bg-slate-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="rounded-md border border-black bg-neo-yellow px-2.5 py-0.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </span>
          <span className="font-mono text-xs font-bold text-slate-600">
            {Math.round((currentStep / STEPS.length) * 100)}% Complete
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (validateStep(currentStep) || step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 border-black p-2 font-heading transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-neo-yellow text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                    : isDone
                    ? "bg-neo-green/30 text-black hover:bg-neo-green/40"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-white text-xs font-black">
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3] text-black" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="truncate text-[10px] font-black uppercase tracking-tight sm:text-[11px]">
                  {step.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Body */}
      <div className="p-6 sm:p-8">
        {currentStep === 1 && (
          <PersonalDetailsStep
            data={personal}
            onChange={(upd) => setPersonal((p) => ({ ...p, ...upd }))}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <ProfessionalLinksStep
            links={links}
            resume={resume}
            onLinksChange={(upd) => setLinks((l) => ({ ...l, ...upd }))}
            onResumeChange={(res) => setResume(res)}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <TechnicalSkillsStep
            skills={skills}
            onChange={(s) => setSkills(s)}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <ProjectsStep
            projects={projects}
            onChange={(p) => setProjects(p)}
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <CertificationsStep
            certifications={certifications}
            onChange={(c) => setCertifications(c)}
            errors={errors}
          />
        )}

        {currentStep === 6 && (
          <PlacementPreferencesStep
            preferences={preferences}
            onChange={(pr) => setPreferences(pr)}
            errors={errors}
          />
        )}
      </div>

      {/* Footer Navigation Controls */}
      <div className="flex items-center justify-between border-t-3 border-black bg-slate-50 p-4 sm:p-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1 || isSaving}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-2 font-heading text-xs font-black uppercase text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          Previous Step
        </button>

        <div className="flex items-center gap-3">
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-neo-yellow px-5 py-2 font-heading text-xs font-black uppercase text-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Next Step
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-neo-green px-6 py-2.5 font-heading text-xs font-black uppercase text-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 stroke-[2.5]" />
                  {isEditMode ? "Save Changes" : "Create & Save Profile"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
