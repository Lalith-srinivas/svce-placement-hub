import React from "react";
import type { EvaluatedSkill } from "@/lib/studentMatrix";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface SkillMatrixCardProps {
  skill: EvaluatedSkill;
  className?: string;
}

export const SkillMatrixCard: React.FC<SkillMatrixCardProps> = ({ skill, className = "" }) => {
  const statusStyles = {
    Completed: {
      badge: "bg-emerald-950/70 text-emerald-400 border-emerald-800/80",
      icon: CheckCircle2,
      cardBorder: "border-slate-800 hover:border-emerald-800/60",
      studentBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
      label: "Completed",
    },
    "Needs Improvement": {
      badge: "bg-amber-950/70 text-amber-400 border-amber-800/80",
      icon: AlertCircle,
      cardBorder: "border-slate-800 hover:border-amber-800/60",
      studentBar: "bg-gradient-to-r from-amber-500 to-yellow-400",
      label: "Needs Improvement",
    },
    Missing: {
      badge: "bg-rose-950/70 text-rose-400 border-rose-800/80",
      icon: XCircle,
      cardBorder: "border-slate-800 hover:border-rose-800/60",
      studentBar: "bg-rose-500",
      label: "Missing",
    },
  }[skill.status];

  const StatusIcon = statusStyles.icon;
  const studentPct = skill.studentLevel * 10;
  const requiredPct = skill.companyRequiredLevel * 10;

  return (
    <div
      className={`rounded-xl border bg-slate-900/90 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all ${statusStyles.cardBorder} ${className}`}
    >
      {/* Top Header: Skill Name & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-sm sm:text-base font-black text-white">
              {skill.skillName}
            </h4>
            <span className="rounded-md border border-slate-700 bg-slate-800/90 px-2 py-0.5 font-mono text-[10px] text-slate-300">
              {skill.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${statusStyles.badge}`}
          >
            <StatusIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{statusStyles.label}</span>
          </span>
        </div>
      </div>

      {/* Metrics Row: Company Required Level, Student Level, Gap */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 mb-3.5 text-center font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Company Req
          </span>
          <span className="font-black text-slate-200 text-sm">
            {skill.companyRequiredLevel}/10
          </span>
        </div>

        <div className="border-x border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Student Level
          </span>
          <span
            className={`font-black text-sm ${
              skill.studentLevel > 0 ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            {skill.studentLevel}/10
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Gap
          </span>
          <span
            className={`font-black text-sm ${
              skill.gap <= 0
                ? "text-emerald-400"
                : skill.gap >= 5
                ? "text-rose-400"
                : "text-amber-400"
            }`}
          >
            {skill.gap <= 0 ? "0 (Met)" : `+${skill.gap}`}
          </span>
        </div>
      </div>

      {/* Dual Progress Comparison Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>Student: {skill.studentLevel}/10</span>
          <span>Target: {skill.companyRequiredLevel}/10</span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
          {/* Student Proficiency Bar */}
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${statusStyles.studentBar}`}
            style={{ width: `${studentPct}%` }}
          />

          {/* Company Target Indicator Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-sm"
            style={{ left: `calc(${requiredPct}% - 2px)` }}
            title={`Required Level: ${skill.companyRequiredLevel}/10`}
          />
        </div>
      </div>
    </div>
  );
};
