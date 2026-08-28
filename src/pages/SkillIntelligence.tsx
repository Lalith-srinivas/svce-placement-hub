import { useMemo, useState } from "react";
import { ChevronDown, Lock, CheckCircle2, Database } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { normalizeDashboardSkills, BLOOM_META, type DashboardSkill } from "@/lib/companyData";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { CompanyLogo } from "@/components/company/CompanyLogo";
import { cn } from "@/lib/utils";

const CRITICALITY_META = {
  Critical: { hex: "#ef4444", desc: "Non-negotiable — screened first, weighted heaviest" },
  Important: { hex: "#2563eb", desc: "Strongly expected — differentiates strong candidates" },
  Baseline: { hex: "#16a34a", desc: "Good to have — supports the core stack" },
};

function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM_META[skill.bloomLevel] || { hex: "#3b82f6", label: "Understand" };
  const crit = CRITICALITY_META[skill.criticality] || { hex: "#16a34a", desc: "Standard" };
  const topics = SKILL_TOPICS[skill.skillSetId] || [];
  const pct = Math.min(100, Math.round((skill.requiredLevel / 10) * 100));

  return (
    <div className="rounded-xl border-3 border-black bg-white p-4 sm:p-5 shadow-neo">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 text-left cursor-pointer">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-black text-black sm:text-base">{skill.name}</h3>
            <span
              className="rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-label text-white shadow-neo-sm"
              style={{ backgroundColor: bloom.hex }}
              title={bloom.label}
            >
              {skill.bloomLevel}
            </span>
            <span
              className="rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black shadow-neo-sm"
              style={{ color: "#000000", backgroundColor: crit.hex === "#ef4444" ? "#FCA5A5" : crit.hex === "#2563eb" ? "#93C5FD" : "#86EFAC" }}
            >
              {skill.criticality}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <div className="h-3.5 flex-1 overflow-hidden rounded-md border-2 border-black bg-slate-100 shadow-neo-sm">
              <div
                className="h-full border-r-2 border-black transition-all"
                style={{ width: `${pct}%`, backgroundColor: bloom.hex }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs font-black text-black bg-neo-yellow border-2 border-black px-2 py-0.5 rounded-md shadow-neo-sm">
              {skill.requiredLevel}/10
            </span>
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-black stroke-[3] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-4 space-y-2 border-t-2 border-black pt-4">
          <p className="mb-2 font-mono text-[11px] font-black uppercase tracking-label text-slate-700">
            10-Level Competency Roadmap
          </p>
          {topics.map((t) => {
            const locked = t.level_number > skill.requiredLevel;
            return (
              <div
                key={t.level_number}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs font-bold border-2",
                  locked
                    ? "border-slate-200 bg-slate-50 text-slate-400"
                    : "border-black bg-[#FFFDF5] text-black shadow-neo-sm"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-black border",
                    locked ? "bg-slate-200 text-slate-500 border-slate-300" : "border-black text-white"
                  )}
                  style={!locked ? { backgroundColor: bloom.hex } : undefined}
                >
                  {locked ? <Lock className="h-2.5 w-2.5" /> : t.level_number}
                </span>
                <span className="leading-snug">
                  {t.topic}
                  {locked && <span className="ml-2 italic text-slate-400">Beyond scope</span>}
                  {!locked && t.level_number === skill.requiredLevel && (
                    <CheckCircle2 className="ml-2 inline h-4 w-4 text-emerald-600 stroke-[3]" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SkillIntelligence() {
  const { company } = useCompany();

  const skills = useMemo(() => {
    if (!company) return [];
    
    // Check raw skill_levels populated from Supabase company_skill_levels table
    const rawSkillLevels = (company.raw?.skill_levels as any) || (company.raw?.skills as any);
    if (Array.isArray(rawSkillLevels) && rawSkillLevels.length > 0) {
      return normalizeDashboardSkills(rawSkillLevels);
    }
    
    return [];
  }, [company]);

  if (!company) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border-3 border-black bg-white p-5 shadow-neo">
          <div className="flex items-center gap-4">
            <CompanyLogo
              name={company.name}
              logoUrl={company.logoUrl}
              websiteUrl={company.websiteUrl}
              className="h-14 w-14 rounded-lg border-2 border-black bg-white p-1 shadow-neo-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-black text-black sm:text-2xl">{company.name}</h1>
                <span className="rounded-md border-2 border-black bg-neo-yellow px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                  {company.companyType}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">Skill Competency Index &amp; Evaluation Roadmap</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(CRITICALITY_META).map(([key, meta]) => (
            <div key={key} className="rounded-xl border-2 border-black bg-white p-3.5 shadow-neo-sm">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-black" style={{ backgroundColor: meta.hex }} />
                <span className="font-mono text-xs font-black uppercase">{key}</span>
              </div>
              <p className="mt-1 text-[11px] font-bold text-slate-700 leading-snug">{meta.desc}</p>
            </div>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-black uppercase tracking-wider text-black">
              Evaluated Skills ({skills.length})
            </h2>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-xl border-3 border-black bg-white p-8 text-center shadow-neo">
              <Database className="h-8 w-8 mx-auto text-slate-400 stroke-[2.5]" />
              <p className="mt-2 text-sm font-black text-black">No Skill Breakdown Configured</p>
              <p className="mt-1 text-xs text-slate-600 font-semibold">
                No records found in company_skill_levels for this company.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((s) => (
                <SkillCard key={s.skillSetId} skill={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
