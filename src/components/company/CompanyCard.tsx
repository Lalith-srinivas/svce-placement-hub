import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight, Eye, Bookmark, Sparkles } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { CATEGORY_HEX, COMPANY_CTC_ESTIMATES, isNullish, type CompanySummary } from "@/lib/companyData";
import { useCompany } from "@/context/CompanyContext";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { cn } from "@/lib/utils";

function ValueOrNA({ value }: { value: string }) {
  if (isNullish(value)) return <span className="italic text-slate-400">N/A</span>;
  return <>{value}</>;
}

const TIER_BG: Record<string, string> = {
  "Super Dream": "bg-neo-purple",
  Dream: "bg-neo-cyan",
  Regular: "bg-neo-orange",
};

interface CompanyCardProps {
  company: CompanySummary;
  onPreview?: (company: CompanySummary) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
  viewMode?: "grid" | "list";
}

export const CompanyCard = memo(function CompanyCard({
  company,
  onPreview,
  isBookmarked,
  onToggleBookmark,
  viewMode = "grid",
}: CompanyCardProps) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const hex = CATEGORY_HEX[company.companyType] || "#334155";
  const growthIsNegative = company.yoyGrowthRate?.trim().startsWith("-");

  const fullData = SEED_COMPANIES.find((c) => c.company_id === company.companyId);
  const techStackList = fullData?.full_json?.tech_stack
    ? String(fullData.full_json.tech_stack)
        .split(";")
        .slice(0, 3)
        .map((s) => s.trim())
    : [];

  const ctcPackage = COMPANY_CTC_ESTIMATES[company.name] || (company.companyType === "Super Dream" ? "≥₹20 LPA" : company.companyType === "Dream" ? "≥₹9 LPA" : "≥₹4 LPA");
  const tierBg = TIER_BG[company.companyType] || "bg-neo-yellow";

  const handleSelect = () => {
    selectCompany(company.companyId);
    navigate("/company/intelligence");
  };

  const handleSkills = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCompany(company.companyId);
    navigate("/company/skills");
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreview) onPreview(company);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(company.companyId);
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleSelect}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border-2 border-black bg-white p-4 text-left shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logoUrl}
            websiteUrl={company.websiteUrl}
            accentHex={hex}
            className="h-12 w-12 shrink-0 rounded-lg border-2 border-black p-1 bg-white shadow-neo-sm"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-base font-extrabold text-black group-hover:text-blue-700 transition-colors truncate">
                {company.name}
              </h3>
              <span className={`rounded-md border-2 border-black ${tierBg} px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm`}>
                {company.companyType}
              </span>
              <span className="rounded-md border-2 border-black bg-neo-yellow px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-neo-sm">
                💰 {ctcPackage}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-slate-700 truncate">{company.category} · {company.headquarters}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t-2 sm:border-t-0 pt-3 sm:pt-0 border-black">
          {techStackList.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              {techStackList.map((t, idx) => (
                <span key={idx} className="rounded-md border border-black bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBookmark}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black transition-all",
                isBookmarked ? "bg-neo-yellow text-black shadow-neo-sm" : "bg-white text-slate-400 hover:text-black"
              )}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Company"}
            >
              <Bookmark className={cn("h-4 w-4 stroke-[2.5]", isBookmarked && "fill-black")} />
            </button>
            <button
              onClick={handlePreview}
              className="flex h-8 items-center gap-1 rounded-lg border-2 border-black bg-white px-2.5 text-xs font-black text-black shadow-neo-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
            <button
              onClick={handleSkills}
              className="flex h-8 items-center gap-1 rounded-lg border-2 border-black bg-neo-purple px-2.5 text-xs font-black text-black shadow-neo-sm hover:bg-purple-300 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Skills
            </button>
            <button
              onClick={handleSelect}
              className="flex h-8 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow px-3 text-xs font-black text-black shadow-neo-sm hover:bg-yellow-400 transition-all cursor-pointer"
            >
              Intelligence &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleSelect}
      className="group relative flex flex-col justify-between rounded-xl border-2 border-black bg-white p-5 text-left shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all duration-150 cursor-pointer"
    >
      <div>
        {/* Card Header */}
        <div className="mb-4 flex items-start justify-between">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logoUrl}
            websiteUrl={company.websiteUrl}
            accentHex={hex}
            className="h-12 w-12 shrink-0 rounded-lg border-2 border-black p-1 bg-white shadow-neo-sm"
          />

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBookmark}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black transition-all",
                isBookmarked
                  ? "bg-neo-yellow text-black shadow-neo-sm"
                  : "bg-white text-slate-300 hover:text-black hover:border-black"
              )}
              title={isBookmarked ? "Bookmarked" : "Bookmark company"}
            >
              <Bookmark className={cn("h-4 w-4 stroke-[2.5]", isBookmarked && "fill-black")} />
            </button>

            <span className={`rounded-lg border-2 border-black ${tierBg} px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm`}>
              {company.companyType}
            </span>
          </div>
        </div>

        {/* Company Title */}
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-black leading-snug text-black group-hover:text-blue-700 transition-colors">
            {company.name}
          </h3>
          <p className="text-xs font-bold text-slate-600">{company.category}</p>
        </div>

        {/* CTC Package Neo-Sticker */}
        <div className="mt-3.5 flex items-center justify-between rounded-lg border-2 border-black bg-neo-yellow p-2 shadow-neo-sm">
          <span className="font-mono text-[10px] font-black uppercase text-black">ESTIMATED CTC</span>
          <span className="font-mono text-xs font-black text-black">{ctcPackage}</span>
        </div>

        {/* Meta details */}
        <div className="mt-4 space-y-2 text-xs font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-black stroke-[2.5]" />
            <span className="truncate">
              <ValueOrNA value={company.headquarters} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-black stroke-[2.5]" />
            <span className="truncate">
              <ValueOrNA value={company.employeeSize} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            {growthIsNegative ? (
              <TrendingDown className="h-3.5 w-3.5 shrink-0 text-rose-600 stroke-[2.5]" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-700 stroke-[2.5]" />
            )}
            <span className={cn("truncate font-bold", growthIsNegative ? "text-rose-600" : "text-emerald-700")}>
              <ValueOrNA value={company.yoyGrowthRate} /> YoY Growth
            </span>
          </div>
        </div>

        {/* Tech Stack Chips */}
        {techStackList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t-2 border-black pt-3">
            {techStackList.map((t, idx) => (
              <span
                key={idx}
                className="rounded-md border border-black bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-black"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t-2 border-black pt-3.5">
        <button
          onClick={handlePreview}
          className="flex h-8 items-center gap-1 rounded-lg border-2 border-black bg-white px-2.5 text-xs font-black text-black shadow-neo-sm hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSkills}
            className="flex h-8 items-center gap-1 rounded-lg border-2 border-black bg-neo-purple px-2 text-xs font-black text-black shadow-neo-sm hover:bg-purple-300 transition-all cursor-pointer"
            title="View Required Skill Matrix"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Skills
          </button>
          <button
            onClick={handleSelect}
            className="flex h-8 items-center gap-1 rounded-lg border-2 border-black bg-neo-cyan px-3 text-xs font-black text-black shadow-neo-sm hover:bg-sky-300 transition-all cursor-pointer"
          >
            Profile
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
});
