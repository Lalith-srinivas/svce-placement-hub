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
  iconColor = "text-black",
  iconBg = "bg-neo-yellow",
  trend,
  badge,
  className = "",
}) => {
  return (
    <div
      className={`rounded-xl border-3 border-black bg-white p-5 shadow-neo transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider font-black text-slate-600">
          {label}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black ${iconBg} shadow-neo-sm`}>
          <Icon className={`h-4 w-4 ${iconColor} stroke-[2.5]`} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-heading text-2xl sm:text-3xl font-black text-black tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="rounded-md border border-black bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-neo-sm">
            {badge}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-600 border-t-2 border-slate-200 pt-2">
          <span>{subtext}</span>
          {trend && <span className="font-black text-black">{trend}</span>}
        </div>
      )}
    </div>
  );
};
