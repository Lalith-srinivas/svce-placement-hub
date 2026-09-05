import React from "react";

interface MatrixMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  badge?: string;
  className?: string;
}

export const MatrixMetricCard: React.FC<MatrixMetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-cyan-400",
  iconBg = "bg-cyan-500/10 border-cyan-500/30",
  trend,
  badge,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl transition-all hover:border-slate-700 hover:translate-y-[-2px] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-300">
            {badge}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>{subtext}</span>
          {trend && <span className="font-bold text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  );
};
