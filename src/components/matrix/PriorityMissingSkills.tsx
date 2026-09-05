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
      badge: "bg-neo-pink text-black border-2 border-black shadow-neo-sm",
      gapColor: "text-rose-600",
    },
    High: {
      badge: "bg-neo-orange text-black border-2 border-black shadow-neo-sm",
      gapColor: "text-orange-600",
    },
    Medium: {
      badge: "bg-neo-yellow text-black border-2 border-black shadow-neo-sm",
      gapColor: "text-amber-600",
    },
    Low: {
      badge: "bg-slate-100 text-black border-2 border-black shadow-neo-sm",
      gapColor: "text-slate-600",
    },
  };

  if (sortedSkills.length === 0) {
    return (
      <div className={`rounded-xl border-3 border-black bg-white p-6 shadow-neo text-center ${className}`}>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg border-2 border-black bg-neo-green shadow-neo-sm mb-3">
          <Flame className="h-6 w-6 text-black stroke-[2.5]" />
        </div>
        <h4 className="font-heading text-base font-black text-black">
          Zero Skill Gaps Detected!
        </h4>
        <p className="font-mono text-xs text-slate-600 mt-1">
          Your current skill proficiencies meet or exceed all evaluated screening benchmarks.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-3 border-black bg-white p-5 sm:p-6 shadow-neo ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-black pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-neo-pink shadow-neo-sm">
              <AlertTriangle className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-lg font-black tracking-wide text-black">
              {title}
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-600 mt-1">
            {description}
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-md border-2 border-black bg-neo-pink px-3 py-1 font-mono text-[11px] font-black text-black shadow-neo-sm">
          {sortedSkills.length} High-Gap Skills
        </span>
      </div>

      <div className="space-y-3">
        {sortedSkills.slice(0, 8).map((skill, index) => {
          const meta = priorityMeta[skill.priority] || priorityMeta.Medium;

          return (
            <div
              key={`${skill.skillName}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border-2 border-black bg-slate-50 p-3.5 shadow-neo-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-black bg-neo-yellow font-mono text-xs font-black text-black shadow-neo-sm">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-sm font-black text-black">
                      {skill.skillName}
                    </span>
                    <span className="rounded border border-black bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 mt-0.5">
                    <span>Target: Level {skill.companyRequiredLevel}/10</span>
                    <span>Current: {skill.studentLevel > 0 ? `Level ${skill.studentLevel}/10` : "Not acquired"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Gap */}
                <div className="text-right">
                  <span className={`font-mono text-xs font-black block ${meta.gapColor}`}>
                    Gap +{skill.gap}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 uppercase">
                    Level Diff
                  </span>
                </div>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${meta.badge}`}
                >
                  {skill.priority}
                </span>

                {/* Quick Link to Skills Roadmap */}
                <Link
                  to="/skills"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-black hover:bg-neo-yellow transition-colors shadow-neo-sm"
                  title="View Topic Roadmap"
                >
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
