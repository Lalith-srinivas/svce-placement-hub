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
  "Super Dream": "bg-neo-purple text-black border-2 border-black shadow-neo-sm",
  Dream: "bg-neo-cyan text-black border-2 border-black shadow-neo-sm",
  Regular: "bg-neo-yellow text-black border-2 border-black shadow-neo-sm",
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
    <div className={`rounded-xl border-3 border-black bg-white p-5 sm:p-6 shadow-neo ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-2 border-black pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black shadow-neo-sm">
              <Building2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-xl font-black tracking-wide text-black">
              Recruiter Placement Readiness Ranking
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-600 mt-1">
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
              className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 font-mono text-xs text-black placeholder-slate-400 focus:border-black focus:outline-hidden shadow-neo-sm"
            />
          </div>

          {/* Tier Filters */}
          <div className="flex items-center rounded-lg border-2 border-black bg-slate-100 p-1 shadow-neo-sm">
            {["All", "Super Dream", "Dream", "Regular"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTierFilter(t)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-black transition-all cursor-pointer ${
                  tierFilter === t
                    ? "bg-black text-white shadow-sm"
                    : "text-black hover:bg-slate-200"
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
            className={`flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-2 font-mono text-xs font-black transition-all cursor-pointer shadow-neo-sm ${
              eligibleOnly
                ? "bg-neo-green text-black"
                : "bg-white text-black hover:bg-slate-100"
            }`}
          >
            <div
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 border-black ${
                eligibleOnly ? "bg-black text-white" : "bg-white"
              }`}
            >
              {eligibleOnly && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span>Eligible Only</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-slate-600">
        <span>
          Showing <span className="font-black text-black">{filteredCompanies.length}</span> of{" "}
          {companies.length} recruiters
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold">
          <ArrowUpDown className="h-3 w-3 text-black" />
          Sorted: Descending Match %
        </span>
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <div className="rounded-xl border-3 border-black bg-slate-50 p-8 text-center shadow-neo-sm">
          <Building2 className="h-10 w-10 mx-auto text-black mb-2 stroke-[1.5]" />
          <p className="font-heading text-sm font-black text-black">No Matching Recruiters Found</p>
          <p className="font-mono text-xs text-slate-600 mt-1">
            Try adjusting your search criteria or filter tags.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCompanies.map((company, index) => {
            const matchColor =
              company.matchPercentage >= 85
                ? "text-emerald-700"
                : company.matchPercentage >= 60
                ? "text-amber-700"
                : "text-rose-700";

            const tierBadgeStyle =
              TIER_BADGES[company.companyType] ||
              "bg-slate-100 text-black border-2 border-black shadow-neo-sm";

            return (
              <div
                key={company.companyId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border-2 border-black bg-slate-50 p-4 hover:bg-white hover:shadow-neo-sm transition-all"
              >
                {/* Left: Rank, Logo, Name, Tier */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black bg-neo-yellow font-mono text-xs font-black text-black shadow-neo-sm">
                    #{index + 1}
                  </span>

                  <CompanyLogo
                    name={company.companyName}
                    logoUrl={company.logoUrl}
                    websiteUrl={company.websiteUrl}
                    className="h-12 w-12 shrink-0 rounded-xl border-2 border-black bg-white p-1.5 shadow-neo-sm"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading text-base font-black text-black truncate">
                        {company.companyName}
                      </h4>
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-black ${tierBadgeStyle}`}
                      >
                        {company.companyType}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-600 truncate mt-0.5">
                      {company.category} • {company.matchedSkillsCount}/{company.totalEvaluatedSkills} Skills Met
                    </p>
                  </div>
                </div>

                {/* Right: Match %, Eligibility, View Details Button */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t-2 sm:border-t-0 border-black pt-3 sm:pt-0">
                  {/* Match % */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`font-heading text-xl sm:text-2xl font-black ${matchColor}`}>
                        {company.matchPercentage}%
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wider font-bold">
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
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-cyan px-4 py-2 font-heading text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
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

