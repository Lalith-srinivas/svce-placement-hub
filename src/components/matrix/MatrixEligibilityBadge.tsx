import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface MatrixEligibilityBadgeProps {
  isEligible: boolean;
  reason?: string;
  size?: "sm" | "md";
  showReason?: boolean;
}

export const MatrixEligibilityBadge: React.FC<MatrixEligibilityBadgeProps> = ({
  isEligible,
  reason,
  size = "md",
  showReason = false,
}) => {
  const isSm = size === "sm";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-bold transition-colors ${
          isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        } ${
          isEligible
            ? "border-emerald-700/80 bg-emerald-950/70 text-emerald-400"
            : "border-rose-700/80 bg-rose-950/70 text-rose-400"
        }`}
        title={reason}
      >
        {isEligible ? (
          <CheckCircle2 className={`${isSm ? "h-3 w-3" : "h-3.5 w-3.5"} shrink-0`} />
        ) : (
          <XCircle className={`${isSm ? "h-3 w-3" : "h-3.5 w-3.5"} shrink-0`} />
        )}
        <span>{isEligible ? "Eligible" : "Not Eligible"}</span>
      </span>

      {showReason && reason && (
        <span className="font-mono text-[10px] text-slate-400 max-w-xs leading-tight">
          {reason}
        </span>
      )}
    </div>
  );
};
