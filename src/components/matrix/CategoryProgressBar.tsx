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
  { icon: React.ElementType; barColor: string; iconBg: string }
> = {
  Programming: {
    icon: Code2,
    barColor: "bg-neo-purple",
    iconBg: "bg-neo-purple",
  },
  DSA: {
    icon: GitBranch,
    barColor: "bg-neo-pink",
    iconBg: "bg-neo-pink",
  },
  Frontend: {
    icon: Layout,
    barColor: "bg-neo-cyan",
    iconBg: "bg-neo-cyan",
  },
  Backend: {
    icon: Server,
    barColor: "bg-neo-green",
    iconBg: "bg-neo-green",
  },
  Database: {
    icon: Database,
    barColor: "bg-neo-yellow",
    iconBg: "bg-neo-yellow",
  },
  Cloud: {
    icon: Cloud,
    barColor: "bg-neo-cyan",
    iconBg: "bg-neo-cyan",
  },
  DevOps: {
    icon: Terminal,
    barColor: "bg-neo-orange",
    iconBg: "bg-neo-orange",
  },
  "Soft Skills": {
    icon: Users,
    barColor: "bg-neo-purple",
    iconBg: "bg-neo-purple",
  },
};

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  categories,
  className = "",
  title = "Skill Domain Competency Roadmap",
}) => {
  return (
    <div className={`rounded-xl border-3 border-black bg-white p-5 sm:p-6 shadow-neo ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-black pb-4 mb-5">
        <div>
          <h3 className="font-heading text-lg font-black tracking-wide text-black">
            {title}
          </h3>
          <p className="font-mono text-xs text-slate-600">
            Categorical breakdown across 8 core placement pillars
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-md border-2 border-black bg-neo-yellow px-3 py-1 font-mono text-[11px] font-black text-black shadow-neo-sm">
          8 Categories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.category] || {
            icon: Code2,
            barColor: "bg-neo-purple",
            iconBg: "bg-neo-purple",
          };
          const Icon = meta.icon;
          const pct = Math.min(100, Math.max(0, cat.percentage));

          return (
            <div
              key={cat.category}
              className="rounded-lg border-2 border-black bg-slate-50 p-3.5 shadow-neo-sm"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black ${meta.iconBg} shadow-neo-sm`}>
                    <Icon className="h-4 w-4 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs sm:text-sm font-black text-black">
                      {cat.category}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-600">
                      {cat.studentSkillCount} skill{cat.studentSkillCount === 1 ? "" : "s"} logged
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-heading text-xs sm:text-sm font-black text-black">
                    {pct}%
                  </span>
                  <p className="font-mono text-[10px] text-slate-600">
                    {cat.studentPoints}/{cat.requiredPoints} pts
                  </p>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-full overflow-hidden rounded-md border border-black bg-slate-200 shadow-neo-sm">
                <div
                  className={`h-full border-r border-black transition-all duration-700 ease-out ${meta.barColor}`}
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
