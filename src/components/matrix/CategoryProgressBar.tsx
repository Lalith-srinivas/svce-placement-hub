import React from "react";
import type { CategoryProgress } from "@/lib/studentMatrix";
import {
  Code2,
  GitBranch,
  Layout,
  Server,
  Database,
  Cloud,
  Terminal,
  Users,
} from "lucide-react";

interface CategoryProgressBarProps {
  categories: CategoryProgress[];
  className?: string;
  title?: string;
}

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; color: string; barColor: string; bg: string }
> = {
  Programming: {
    icon: Code2,
    color: "text-blue-400",
    barColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  DSA: {
    icon: GitBranch,
    color: "text-purple-400",
    barColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    bg: "bg-purple-500/10 border-purple-500/30",
  },
  Frontend: {
    icon: Layout,
    color: "text-cyan-400",
    barColor: "bg-gradient-to-r from-cyan-500 to-teal-500",
    bg: "bg-cyan-500/10 border-cyan-500/30",
  },
  Backend: {
    icon: Server,
    color: "text-emerald-400",
    barColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  Database: {
    icon: Database,
    color: "text-amber-400",
    barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  Cloud: {
    icon: Cloud,
    color: "text-sky-400",
    barColor: "bg-gradient-to-r from-sky-500 to-blue-500",
    bg: "bg-sky-500/10 border-sky-500/30",
  },
  DevOps: {
    icon: Terminal,
    color: "text-rose-400",
    barColor: "bg-gradient-to-r from-rose-500 to-pink-500",
    bg: "bg-rose-500/10 border-rose-500/30",
  },
  "Soft Skills": {
    icon: Users,
    color: "text-violet-400",
    barColor: "bg-gradient-to-r from-violet-500 to-purple-500",
    bg: "bg-violet-500/10 border-violet-500/30",
  },
};

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  categories,
  className = "",
  title = "Skill Domain Competency Roadmap",
}) => {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
        <div>
          <h3 className="font-heading text-lg font-black tracking-wide text-white">
            {title}
          </h3>
          <p className="font-mono text-xs text-slate-400">
            Categorical breakdown across 8 core placement pillars
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-mono text-[11px] font-bold text-slate-300">
          8 Evaluated Categories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.category] || {
            icon: Code2,
            color: "text-blue-400",
            barColor: "bg-blue-500",
            bg: "bg-blue-500/10 border-blue-500/30",
          };
          const Icon = meta.icon;
          const pct = Math.min(100, Math.max(0, cat.percentage));

          return (
            <div
              key={cat.category}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.bg}`}>
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-200">
                      {cat.category}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-500">
                      {cat.studentSkillCount} skill{cat.studentSkillCount === 1 ? "" : "s"} logged
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs sm:text-sm font-black text-white">
                    {pct}%
                  </span>
                  <p className="font-mono text-[10px] text-slate-400">
                    {cat.studentPoints}/{cat.requiredPoints} pts
                  </p>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${meta.barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
