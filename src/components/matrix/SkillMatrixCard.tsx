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
      badge: "bg-neo-green text-black border-2 border-black shadow-neo-sm",
      icon: CheckCircle2,
      cardBg: "bg-white",
      studentBar: "bg-neo-green",
      gapColor: "text-emerald-700",
      label: "Completed",
    },
    "Needs Improvement": {
      badge: "bg-neo-yellow text-black border-2 border-black shadow-neo-sm",
      icon: AlertCircle,
      cardBg: "bg-white",
      studentBar: "bg-neo-yellow",
      gapColor: "text-amber-700",
      label: "Needs Work",
    },
    Missing: {
      badge: "bg-neo-pink text-black border-2 border-black shadow-neo-sm",
      icon: XCircle,
      cardBg: "bg-white",
      studentBar: "bg-neo-pink",
      gapColor: "text-rose-700",
      label: "Missing",
    },
  }[skill.status];

  const StatusIcon = statusStyles.icon;
  const studentPct = skill.studentLevel * 10;
  const requiredPct = skill.companyRequiredLevel * 10;

  return (
    <div
      className={`rounded-xl border-3 border-black ${statusStyles.cardBg} p-4 sm:p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all ${className}`}
    >
      {/* Top Header: Skill Name & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-sm sm:text-base font-black text-black">
              {skill.skillName}
            </h4>
            <span className="rounded-md border border-black bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-black text-black">
              {skill.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 font-mono text-[11px] font-black ${statusStyles.badge}`}
          >
            <StatusIcon className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>{statusStyles.label}</span>
          </span>
        </div>
      </div>

      {/* Metrics Row: Company Required Level, Student Level, Gap */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border-2 border-black bg-slate-50 p-2.5 mb-3.5 text-center font-mono text-xs shadow-neo-sm">
        <div>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider block font-black">
            Company Req
          </span>
          <span className="font-black text-black text-sm">
            {skill.companyRequiredLevel}/10
          </span>
        </div>

        <div className="border-x-2 border-black">
          <span className="text-[10px] text-slate-600 uppercase tracking-wider block font-black">
            Student Level
          </span>
          <span
            className={`font-black text-sm ${
              skill.studentLevel > 0 ? "text-black" : "text-slate-400"
            }`}
          >
            {skill.studentLevel}/10
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider block font-black">
            Gap
          </span>
          <span
            className={`font-black text-sm ${statusStyles.gapColor}`}
          >
            {skill.gap <= 0 ? "0 (Met)" : `+${skill.gap}`}
          </span>
        </div>
      </div>

      {/* Dual Progress Comparison Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-600 font-bold">
          <span>Student: {skill.studentLevel}/10</span>
          <span>Target: {skill.companyRequiredLevel}/10</span>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-md border-2 border-black bg-slate-200 shadow-neo-sm">
          {/* Student Proficiency Bar */}
          <div
            className={`h-full transition-all duration-700 ease-out ${statusStyles.studentBar}`}
            style={{ width: `${studentPct}%` }}
          />

          {/* Company Target Indicator Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-black"
            style={{ left: `calc(${requiredPct}% - 2px)` }}
            title={`Required Level: ${skill.companyRequiredLevel}/10`}
          />
        </div>
      </div>
    </div>
  );
};
