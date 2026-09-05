import React from "react";
import type { EvaluatedSkill } from "@/lib/studentMatrix";
import { AlertTriangle, Flame, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PriorityMissingSkillsProps {
  skills: EvaluatedSkill[];
  className?: string;
  title?: string;
  description?: string;
}

export const PriorityMissingSkills: React.FC<PriorityMissingSkillsProps> = ({
  skills,
  className = "",
  title = "Priority Upskilling Roadmap",
  description = "Target these high-gap competencies first to maximize placement readiness across recruiters.",
}) => {
  // Sort missing skills by highest gap descending
  const sortedSkills = [...skills]
    .filter((s) => s.gap > 0 || s.status === "Missing")
    .sort((a, b) => b.gap - a.gap);

  const priorityMeta = {
    Critical: {
      badge: "bg-rose-950/80 text-rose-400 border-rose-800/80",
      accent: "text-rose-400",
    },
    High: {
      badge: "bg-amber-950/80 text-amber-400 border-amber-800/80",
      accent: "text-amber-400",
    },
    Medium: {
      badge: "bg-blue-950/80 text-blue-400 border-blue-800/80",
      accent: "text-blue-400",
    },
    Low: {
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      accent: "text-slate-400",
    },
  };

  if (sortedSkills.length === 0) {
    return (
      <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md shadow-xl text-center ${className}`}>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 mb-3">
          <Flame className="h-6 w-6" />
        </div>
        <h4 className="font-heading text-base font-black text-white">
          Zero Skill Gaps Detected!
        </h4>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Your current skill proficiencies meet or exceed all evaluated screening benchmarks.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-lg font-black tracking-wide text-white">
              {title}
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-1">
            {description}
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-full border border-rose-800/60 bg-rose-950/60 px-3 py-1 font-mono text-[11px] font-bold text-rose-400">
          {sortedSkills.length} High-Gap Skills
        </span>
      </div>

      <div className="space-y-3">
        {sortedSkills.slice(0, 8).map((skill, index) => {
          const meta = priorityMeta[skill.priority] || priorityMeta.Medium;

          return (
            <div
              key={`${skill.skillName}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 font-mono text-xs font-black text-slate-400">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-sm font-bold text-white">
                      {skill.skillName}
                    </span>
                    <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.2 font-mono text-[10px] text-slate-400">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 mt-0.5">
                    <span>Target: Level {skill.companyRequiredLevel}/10</span>
                    <span>Current: {skill.studentLevel > 0 ? `Level ${skill.studentLevel}/10` : "Not acquired"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Gap */}
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-rose-400 block">
                    Gap +{skill.gap}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 uppercase">
                    Level Difference
                  </span>
                </div>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${meta.badge}`}
                >
                  {skill.priority} Priority
                </span>

                {/* Quick Link to Skills Roadmap */}
                <Link
                  to="/skills"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                  title="View Topic Roadmap"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
