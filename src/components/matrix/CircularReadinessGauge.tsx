import React from "react";
import { getReadinessColor } from "@/lib/studentMatrix";

interface CircularReadinessGaugeProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularReadinessGauge: React.FC<CircularReadinessGaugeProps> = ({
  percentage,
  size = "md",
  showLabel = true,
  label,
  className = "",
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const color = getReadinessColor(clamped);

  const dimensions = {
    sm: { size: 76, stroke: 6, textClass: "text-lg", labelClass: "text-[9px]" },
    md: { size: 120, stroke: 9, textClass: "text-2xl", labelClass: "text-[11px]" },
    lg: { size: 168, stroke: 12, textClass: "text-4xl", labelClass: "text-xs" },
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const colorStyles = {
    green: {
      stroke: "#10b981", // emerald-500
      glow: "rgba(16, 185, 129, 0.35)",
      textColor: "text-emerald-400",
      badgeBg: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
      statusText: "Optimal Readiness (≥ 85%)",
    },
    yellow: {
      stroke: "#f59e0b", // amber-500
      glow: "rgba(245, 158, 11, 0.35)",
      textColor: "text-amber-400",
      badgeBg: "bg-amber-950/60 text-amber-400 border-amber-800/60",
      statusText: "Moderate Readiness (60-84%)",
    },
    red: {
      stroke: "#ef4444", // rose-500
      glow: "rgba(239, 68, 68, 0.35)",
      textColor: "text-rose-400",
      badgeBg: "bg-rose-950/60 text-rose-400 border-rose-800/60",
      statusText: "Preparation Needed (< 60%)",
    },
  }[color];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90 transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 12px ${colorStyles.glow})` }}
        >
          {/* Background Track */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="#1e293b" // slate-800
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Active Progress Ring */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke={colorStyles.stroke}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black ${dimensions.textClass} ${colorStyles.textColor}`}>
            {clamped}%
          </span>
          {size !== "sm" && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Readiness
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono ${dimensions.labelClass} font-bold ${colorStyles.badgeBg}`}
          >
            {label || colorStyles.statusText}
          </span>
        </div>
      )}
    </div>
  );
};
