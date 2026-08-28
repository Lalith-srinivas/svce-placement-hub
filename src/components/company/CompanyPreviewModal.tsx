import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, MapPin, Users, TrendingUp, TrendingDown, Building, ShieldCheck, Sparkles, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { CATEGORY_HEX, type CompanySummary, type CompanyProfile } from "@/lib/companyData";
import { useCompany } from "@/context/CompanyContext";
import { fetchCompanyProfileFromSupabase } from "@/lib/supabase";

interface PreviewModalProps {
  company: CompanySummary | null;
  onClose: () => void;
}

export const CompanyPreviewModal = memo(function CompanyPreviewModal({ company, onClose }: PreviewModalProps) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [profileData, setProfileData] = useState<CompanyProfile | null>(null);
  const [skillList, setSkillList] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    if (company) {
      fetchCompanyProfileFromSupabase(company.companyId).then((res) => {
        if (active && res) {
          setProfileData(res.profile);
          setSkillList(res.skillLevels || []);
        }
      });
    } else {
      setProfileData(null);
      setSkillList([]);
    }
    return () => {
      active = false;
    };
  }, [company]);

  if (!company) return null;

  const hex = CATEGORY_HEX[company.companyType] || "#334155";
  const growthIsNegative = company.yoyGrowthRate?.trim().startsWith("-");
  const rawData = (profileData?.raw as Record<string, unknown>) || {};

  const overviewText = (rawData.overview_text as string) || (rawData.overview as string) || "";
  const techStack = (rawData.tech_stack as string) || "";
  const ceoName = (rawData.ceo_name as string) || "";

  const handleFullView = (tab: "intelligence" | "skills" = "intelligence") => {
    selectCompany(company.companyId);
    navigate(`/company/${tab}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-none animate-fade-up">
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-neo-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Stripe */}
        <div className="flex items-center justify-between border-b-3 border-black bg-neo-yellow p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <CompanyLogo
              name={company.name}
              logoUrl={company.logoUrl}
              websiteUrl={company.websiteUrl}
              accentHex={hex}
              className="h-12 w-12 shrink-0 rounded-lg border-2 border-black bg-white p-1 shadow-neo-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-black text-black sm:text-2xl">
                  {company.name}
                </h2>
                <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                  {company.companyType}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-slate-800">
                {company.category} · Est. {company.incorporationYear ?? "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-neo-sm hover:bg-neo-pink transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#FFFDF5]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border-2 border-black bg-white p-3 shadow-neo-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-black shrink-0 stroke-[2.5]" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-mono font-bold text-slate-500">Headquarters</p>
                <p className="truncate text-xs font-black text-black">{company.headquarters || "Global"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l-2 border-black pl-3">
              <Users className="h-4 w-4 text-black shrink-0 stroke-[2.5]" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-mono font-bold text-slate-500">Workforce</p>
                <p className="truncate text-xs font-black text-black">{company.employeeSize || "Enterprise"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l-2 border-black pl-3">
              {growthIsNegative ? (
                <TrendingDown className="h-4 w-4 text-rose-600 shrink-0 stroke-[2.5]" />
              ) : (
                <TrendingUp className="h-4 w-4 text-emerald-700 shrink-0 stroke-[2.5]" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-mono font-bold text-slate-500">YoY Growth</p>
                <p className={`truncate text-xs font-black ${growthIsNegative ? "text-rose-600" : "text-emerald-700"}`}>
                  {company.yoyGrowthRate}
                </p>
              </div>
            </div>
          </div>

          {/* Overview text */}
          {overviewText && (
            <div>
              <h4 className="flex items-center gap-1.5 font-heading text-xs font-black uppercase tracking-wider text-black">
                <Building className="h-4 w-4 stroke-[2.5]" />
                Company Overview
              </h4>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-800 bg-white rounded-xl p-3.5 border-2 border-black shadow-neo-sm">
                {overviewText}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          {techStack && (
            <div>
              <h4 className="flex items-center gap-1.5 font-heading text-xs font-black uppercase tracking-wider text-black">
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
                Tech Stack & Platforms
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techStack
                  .split(";")
                  .map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border-2 border-black bg-neo-cyan px-2.5 py-1 font-mono text-[11px] font-black text-black shadow-neo-sm"
                    >
                      {t.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Required Skills Matrix Snapshot */}
          {skillList.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-1.5 font-heading text-xs font-black uppercase tracking-wider text-black">
                  <Award className="h-4 w-4 stroke-[2.5]" />
                  Evaluated Competencies ({skillList.length})
                </h4>
                <button
                  onClick={() => handleFullView("skills")}
                  className="font-mono text-[11px] font-black text-blue-700 underline cursor-pointer"
                >
                  Full Roadmap &rarr;
                </button>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {skillList.slice(0, 6).map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-2.5 text-xs shadow-neo-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span className="truncate font-bold text-black">{skill.skill_set_name}</span>
                    </div>
                    <span className="font-mono text-[10px] font-black text-black bg-neo-purple border border-black px-2 py-0.5 rounded-md shrink-0">
                      Lvl {skill.required_level}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leadership Banner */}
          {ceoName && (
            <div className="flex items-center justify-between rounded-xl border-2 border-black bg-neo-pink p-3 text-xs font-bold text-black shadow-neo-sm">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                <span>CEO: {ceoName}</span>
              </div>
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono font-black underline hover:text-white"
                >
                  Official Site <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t-3 border-black bg-white p-4 sm:p-5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto neo-btn-white rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleFullView("skills")}
              className="flex-1 sm:flex-none neo-btn-primary rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Skill Matrix
            </button>
            <button
              onClick={() => handleFullView("intelligence")}
              className="flex-1 sm:flex-none neo-btn-cyan rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Full Profile <ArrowRight className="h-3.5 w-3.5 ml-1 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
