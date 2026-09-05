import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CompanyMatchResult } from "@/lib/studentMatrix";
import { MatrixEligibilityBadge } from "./MatrixEligibilityBadge";
import { CompanyLogo } from "@/components/company/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { Search, Building2, ArrowUpDown, ChevronRight, Check } from "lucide-react";

interface TopMatchesRankingTableProps {
  companies: CompanyMatchResult[];
  className?: string;
}

const TIER_BADGES: Record<string, string> = {
  "Super Dream": "bg-purple-950/80 text-purple-300 border-purple-800/80",
  Dream: "bg-cyan-950/80 text-cyan-300 border-cyan-800/80",
  Regular: "bg-amber-950/80 text-amber-300 border-amber-800/80",
};

export const TopMatchesRankingTable: React.FC<TopMatchesRankingTableProps> = ({
  companies,
  className = "",
}) => {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        tierFilter === "All" ||
        c.companyType.toLowerCase().includes(tierFilter.toLowerCase());

      const matchesEligibility = !eligibleOnly || c.isEligible;

      return matchesSearch && matchesTier && matchesEligibility;
    });
  }, [companies, searchQuery, tierFilter, eligibleOnly]);

  const handleViewDetails = (company: CompanyMatchResult) => {
    // Select the company in CompanyContext
    selectCompany(company.companyId);
    // Navigate directly to the Student Matrix tab of that company
    navigate("/company/matrix");
  };

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-xl font-black tracking-wide text-white">
              Recruiter Placement Readiness Ranking
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Automatically ranked across all {companies.length} campus recruiters based on your verified skill alignment.
          </p>
        </div>

        {/* Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, tech..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Tier Filters */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
            {["All", "Super Dream", "Dream", "Regular"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTierFilter(t)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  tierFilter === t
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Eligible Only Checkbox */}
          <button
            type="button"
            onClick={() => setEligibleOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
              eligibleOnly
                ? "border-emerald-700 bg-emerald-950/70 text-emerald-400"
                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                eligibleOnly ? "border-emerald-500 bg-emerald-500 text-black" : "border-slate-700"
              }`}
            >
              {eligibleOnly && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span>Eligible Only</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-slate-400">
        <span>
          Showing <span className="font-bold text-white">{filteredCompanies.length}</span> of{" "}
          {companies.length} recruiters
        </span>
        <span className="flex items-center gap-1 text-[11px]">
          <ArrowUpDown className="h-3 w-3 text-cyan-400" />
          Sorted: Descending Match %
        </span>
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
          <Building2 className="h-10 w-10 mx-auto text-slate-600 mb-2" />
          <p className="font-heading text-sm font-bold text-white">No Matching Recruiters Found</p>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or filter tags.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCompanies.map((company, index) => {
            const matchColor =
              company.matchPercentage >= 85
                ? "text-emerald-400"
                : company.matchPercentage >= 60
                ? "text-amber-400"
                : "text-rose-400";

            const tierBadgeStyle =
              TIER_BADGES[company.companyType] ||
              "bg-slate-800 text-slate-300 border-slate-700";

            return (
              <div
                key={company.companyId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 hover:border-slate-700 hover:bg-slate-950 transition-all"
              >
                {/* Left: Rank, Logo, Name, Tier */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 font-mono text-xs font-black text-slate-400">
                    #{index + 1}
                  </span>

                  <CompanyLogo
                    name={company.companyName}
                    logoUrl={company.logoUrl}
                    websiteUrl={company.websiteUrl}
                    className="h-12 w-12 shrink-0 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-sm"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading text-base font-black text-white truncate">
                        {company.companyName}
                      </h4>
                      <span
                        className={`rounded-md border px-2 py-0.2 font-mono text-[10px] font-bold ${tierBadgeStyle}`}
                      >
                        {company.companyType}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-400 truncate mt-0.5">
                      {company.category} • {company.matchedSkillsCount}/{company.totalEvaluatedSkills} Skills Met
                    </p>
                  </div>
                </div>

                {/* Right: Match %, Eligibility, View Details Button */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                  {/* Match % */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`font-mono text-xl sm:text-2xl font-black ${matchColor}`}>
                        {company.matchPercentage}%
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wider">
                      Match Score
                    </span>
                  </div>

                  {/* Eligibility Badge */}
                  <div className="text-center sm:text-left">
                    <MatrixEligibilityBadge
                      isEligible={company.isEligible}
                      reason={company.eligibilityReason}
                      size="sm"
                    />
                  </div>

                  {/* View Details Button */}
                  <button
                    type="button"
                    onClick={() => handleViewDetails(company)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/25 transition-all cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
