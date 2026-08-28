import { useEffect, useMemo, useState } from "react";
import {
  Search, X, RotateCcw, LayoutGrid, List, Bookmark,
  Sparkles, Building2, Crown, Award,
  ArrowUpDown, ShieldCheck, GraduationCap, Zap, Database, RefreshCw
} from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanySummary, type CompanySummary } from "@/lib/companyData";
import { CompanyCard } from "@/components/company/CompanyCard";
import { CompanyPreviewModal } from "@/components/company/CompanyPreviewModal";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCompany } from "@/context/CompanyContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const COLLEGE_NAME = "Sri Venkateswara College of Engineering";
const COLLEGE_SHORT = "SVCE";

const FILTERS = ["All", "Super Dream", "Dream", "Regular"] as const;
const DOMAINS = ["All Domains", "Product & Big Tech", "Cloud & AI", "Semiconductors & Systems", "SaaS & Enterprise", "IT Consulting"] as const;
const SORT_OPTIONS = [
  { id: "tier", label: "Placement Tier (Super Dream First)" },
  { id: "name", label: "Alphabetical (A–Z)" },
  { id: "growth", label: "Highest YoY Growth" },
  { id: "employees", label: "Workforce Scale" },
] as const;

const QUICK_SEARCH_TAGS = [
  "Accenture", "AI & Cloud", "Enterprise", "Java & Spring", "Python / C++", "High Package"
];

const TIER_COLORS: Record<string, string> = {
  All: "bg-white text-black",
  "Super Dream": "bg-neo-purple text-black",
  Dream: "bg-neo-cyan text-black",
  Regular: "bg-neo-orange text-black",
};

function useDebounced<T>(value: T, delay = 100): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const BOOKMARK_STORAGE_KEY = "svce-bookmarked-companies";

export default function Index() {
  const { companiesList, loadingCompanies, isBackendConnected, refetchCompanies } = useCompany();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [domainFilter, setDomainFilter] = useState<(typeof DOMAINS)[number]>("All Domains");
  const [sortBy, setSortBy] = useState<string>("tier");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [previewCompany, setPreviewCompany] = useState<CompanySummary | null>(null);

  const debouncedQuery = useDebounced(query, 100);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      /* noop */
    }
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  // Determine active companies list: live from Supabase if connected, else fallback to verified seed
  const companies = useMemo(() => {
    if (companiesList && companiesList.length > 0) {
      return companiesList;
    }
    // Verified real seed reference (no dummy placeholders)
    return SEED_COMPANIES.map((c) => normalizeCompanySummary({ ...c.short_json, company_id: c.company_id }));
  }, [companiesList]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: companies.length };
    for (const f of FILTERS) {
      if (f === "All") continue;
      map[f] = companies.filter((c) => c.companyType === f).length;
    }
    return map;
  }, [companies]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = companies.filter((c) => {
      const matchesFilter = filter === "All" || c.companyType === filter;
      const matchesBookmark = !onlyBookmarked || bookmarkedIds.includes(c.companyId);

      const matchesDomain =
        domainFilter === "All Domains" ||
        (domainFilter === "Product & Big Tech" && (c.category.includes("Product") || c.category.includes("Big Tech"))) ||
        (domainFilter === "Cloud & AI" && (c.category.includes("Cloud") || c.category.includes("AI"))) ||
        (domainFilter === "Semiconductors & Systems" && c.category.includes("Semiconductor")) ||
        (domainFilter === "SaaS & Enterprise" && (c.category.includes("SaaS") || c.category.includes("Enterprise"))) ||
        (domainFilter === "IT Consulting" && (c.category.includes("Consulting") || c.category.includes("Services")));

      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q) ||
        c.officeLocations.some((loc) => loc.toLowerCase().includes(q));

      return matchesFilter && matchesBookmark && matchesDomain && matchesQuery;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "tier") {
        const order: Record<string, number> = { "Super Dream": 1, Dream: 2, Regular: 3 };
        return (order[a.companyType] || 99) - (order[b.companyType] || 99);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "growth") {
        const ga = parseFloat(a.yoyGrowthRate) || 0;
        const gb = parseFloat(b.yoyGrowthRate) || 0;
        return gb - ga;
      }
      if (sortBy === "employees") {
        const ea = parseInt(a.employeeSize.replace(/\D/g, "")) || 0;
        const eb = parseInt(b.employeeSize.replace(/\D/g, "")) || 0;
        return eb - ea;
      }
      return 0;
    });
  }, [companies, filter, domainFilter, debouncedQuery, onlyBookmarked, bookmarkedIds, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      {/* Neo Navbar */}
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative border-b-4 border-black bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {/* Backend status chip */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="neo-sticker bg-neo-yellow text-black">
                <Zap className="h-4 w-4 fill-black" />
                {COLLEGE_SHORT} · PLACEMENT INTELLIGENCE ENGINE
              </div>

              {isBackendConnected ? (
                <div className="neo-tag bg-neo-green text-black">
                  <Database className="h-3.5 w-3.5" />
                  SUPABASE BACKEND CONNECTED
                </div>
              ) : (
                <div className="neo-tag bg-neo-pink text-black">
                  <Database className="h-3.5 w-3.5" />
                  SUPABASE READY (.env)
                </div>
              )}
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-black sm:text-6xl lg:text-6xl leading-[1.05] sm:leading-[1.05]">
              Crush Your Campus Placements with <span className="bg-neo-cyan px-2 py-0.5 border-2 border-black shadow-neo-sm inline-block rotate-[1deg]">Live Recruiter</span> Intelligence.
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-slate-800 sm:text-base">
              Connected directly to the Supabase backend database to analyze technical requirements, Bloom&apos;s skill matrices, hiring rounds, and company dossiers.
            </p>

            {/* Search Input Box */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black stroke-[3]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by recruiter, tech stack (Python, AWS, Java), location..."
                className="h-14 w-full rounded-xl border-3 border-black bg-[#FFFDF5] pl-12 pr-10 text-sm font-bold text-black placeholder:text-slate-500 shadow-neo focus:bg-white focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-neo-hover transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black font-black hover:opacity-70 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 stroke-[3]" />
                </button>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-bold text-black">
              <span className="font-mono text-[11px] uppercase mr-1">Hot Tags:</span>
              {QUICK_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag === query ? "" : tag)}
                  className={cn(
                    "rounded-md border-2 border-black px-2.5 py-1 text-[11px] font-black uppercase transition-all cursor-pointer",
                    query === tag
                      ? "bg-black text-white shadow-neo-sm"
                      : "bg-white text-black hover:bg-neo-yellow shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-active"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Neo Metric Stat Boxes */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border-3 border-black bg-neo-yellow p-4 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-black uppercase text-black">COMPANIES</span>
                <Building2 className="h-5 w-5 stroke-[2.5]" />
              </div>
              <p className="mt-2 font-heading text-3xl font-black text-black">{companies.length}</p>
              <p className="text-[11px] font-bold text-slate-900">{isBackendConnected ? "Live from Supabase" : "Backend Ready"}</p>
            </div>

            <div className="rounded-xl border-3 border-black bg-neo-purple p-4 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-black uppercase text-black">SUPER DREAM</span>
                <Crown className="h-5 w-5 stroke-[2.5]" />
              </div>
              <p className="mt-2 font-heading text-3xl font-black text-black">{counts["Super Dream"] ?? 0}</p>
              <p className="text-[11px] font-bold text-slate-900">₹20+ LPA Tiers</p>
            </div>

            <div className="rounded-xl border-3 border-black bg-neo-green p-4 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-black uppercase text-black">DREAM TIERS</span>
                <Sparkles className="h-5 w-5 stroke-[2.5]" />
              </div>
              <p className="mt-2 font-heading text-3xl font-black text-black">{counts["Dream"] ?? 0}</p>
              <p className="text-[11px] font-bold text-slate-900">₹10–20 LPA Tiers</p>
            </div>

            <div className="rounded-xl border-3 border-black bg-neo-cyan p-4 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-black uppercase text-black">REGULAR</span>
                <Award className="h-5 w-5 stroke-[2.5]" />
              </div>
              <p className="mt-2 font-heading text-3xl font-black text-black">{counts["Regular"] ?? 0}</p>
              <p className="text-[11px] font-bold text-slate-900">&gt;₹4 LPA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supabase Connection Helper Banner (if not connected or empty) */}
      {!isBackendConnected && (
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-3 border-black bg-neo-yellow p-5 shadow-neo">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-neo-sm">
                  <Database className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-black text-black">
                    Connect Your Supabase Database Backend
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-slate-800">
                    Add your <code className="bg-white px-1.5 py-0.5 border border-black rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-white px-1.5 py-0.5 border border-black rounded font-mono">VITE_SUPABASE_ANON_KEY</code> to <code className="bg-white px-1.5 py-0.5 border border-black rounded font-mono">.env</code>. Use the ready schema at <code className="bg-white px-1.5 py-0.5 border border-black rounded font-mono">supabase/schema.sql</code>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => refetchCompanies()}
                className="neo-btn-white rounded-lg px-3.5 py-2 text-xs font-black whitespace-nowrap cursor-pointer shadow-neo-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Check Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directory Section */}
      <main id="company-directory" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 stroke-[3] text-black" />
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                Recruiters Directory
              </h2>
            </div>
            <p className="mt-1 text-xs font-bold text-slate-700 sm:text-sm">
              Live from Supabase database · Filter by tier, domain, or bookmarks.
            </p>
          </div>

          {/* View mode & saved toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={cn(
                "flex h-10 items-center gap-1.5 rounded-lg border-2 border-black px-3 text-xs font-black transition-all cursor-pointer shadow-neo-sm",
                onlyBookmarked
                  ? "bg-neo-yellow text-black"
                  : "bg-white text-black hover:bg-slate-100"
              )}
            >
              <Bookmark className={cn("h-4 w-4 stroke-[2.5]", onlyBookmarked && "fill-black")} />
              Saved ({bookmarkedIds.length})
            </button>

            <div className="flex rounded-lg border-2 border-black bg-white p-0.5 shadow-neo-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-black transition-colors cursor-pointer",
                  viewMode === "grid" ? "bg-neo-yellow font-black" : "hover:bg-slate-100"
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-black transition-colors cursor-pointer",
                  viewMode === "list" ? "bg-neo-yellow font-black" : "hover:bg-slate-100"
                )}
                title="List View"
              >
                <List className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Neo Filter Toolbar */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl border-3 border-black bg-white p-4 shadow-neo">
          {/* Tier Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = filter === f;
                const tierColor = TIER_COLORS[f] || "bg-white";
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border-2 border-black px-3.5 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                      active
                        ? `${tierColor} translate-x-0.5 translate-y-0.5 shadow-neo-active`
                        : "bg-white text-black hover:bg-slate-100 hover:translate-x-0.5 hover:translate-y-0.5"
                    )}
                  >
                    {f}
                    <span className="rounded-md border border-black bg-white px-1.5 py-0.2 font-mono text-[10px] font-black text-black">
                      {counts[f] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 stroke-[2.5]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-lg border-2 border-black bg-[#FFFDF5] px-2 text-xs font-black text-black focus:outline-none shadow-neo-sm cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-mono text-[11px] font-black uppercase mr-1">DOMAIN:</span>
            {DOMAINS.map((d) => {
              const active = domainFilter === d;
              return (
                <button
                  key={d}
                  onClick={() => setDomainFilter(d)}
                  className={cn(
                    "rounded-md border-2 border-black px-2.5 py-1 text-xs font-bold transition-all cursor-pointer shadow-neo-sm",
                    active
                      ? "bg-black text-white font-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                      : "bg-white text-black hover:bg-neo-yellow"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-800 px-1">
          <span>
            Showing <strong className="text-black font-black text-sm">{filtered.length}</strong> of {companies.length} campus recruiters
          </span>
          {(query || filter !== "All" || domainFilter !== "All Domains" || onlyBookmarked) && (
            <button
              onClick={() => {
                setQuery("");
                setFilter("All");
                setDomainFilter("All Domains");
                setOnlyBookmarked(false);
              }}
              className="flex items-center gap-1 font-mono font-black text-black bg-neo-pink border-2 border-black px-2 py-0.5 rounded-md shadow-neo-sm hover:bg-pink-400 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 stroke-[3]" />
              RESET FILTERS
            </button>
          )}
        </div>

        {/* Company Listings */}
        <div className="mt-6">
          {loadingCompanies ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border-3 border-black bg-white p-5 shadow-neo">
                  <div className="mb-3 flex items-center justify-between">
                    <Skeleton className="h-12 w-12 rounded-lg border-2 border-black" />
                    <Skeleton className="h-6 w-20 rounded-md border border-black" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="mt-2 h-3 w-1/2 rounded-md" />
                  <div className="mt-5 space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-black bg-white py-16 text-center shadow-neo">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow text-black shadow-neo-sm">
                <Building2 className="h-8 w-8 stroke-[3]" />
              </div>
              <p className="mt-4 font-heading text-xl font-black text-black">NO RECRUITERS FOUND</p>
              <p className="mt-1 max-w-sm text-xs font-bold text-slate-700">
                {isBackendConnected
                  ? "No companies match your query or your Supabase 'companies' table is currently empty."
                  : "No companies match your filters. Adjust your search or reset."}
              </p>
              <button
                className="mt-5 neo-btn-primary rounded-lg"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                  setDomainFilter("All Domains");
                  setOnlyBookmarked(false);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-1 stroke-[3]" />
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((company) => (
                <CompanyCard
                  key={company.companyId}
                  company={company}
                  onPreview={setPreviewCompany}
                  isBookmarked={bookmarkedIds.includes(company.companyId)}
                  onToggleBookmark={toggleBookmark}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((company) => (
                <CompanyCard
                  key={company.companyId}
                  company={company}
                  onPreview={setPreviewCompany}
                  isBookmarked={bookmarkedIds.includes(company.companyId)}
                  onToggleBookmark={toggleBookmark}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Placement Hub Navigation Cards */}
      <section className="border-t-4 border-black bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="neo-sticker bg-neo-yellow text-black">
              <Zap className="h-3.5 w-3.5 fill-black" />
              EXPLORE PLACEMENT HUB SECTIONS
            </span>
            <h3 className="mt-3 font-heading text-2xl font-black uppercase text-black sm:text-3xl">
              Comprehensive Placement Preparation
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link
              to="/tiers"
              className="flex flex-col justify-between rounded-xl border-3 border-black bg-[#FFFDF5] p-6 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all group"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-neo-green text-black shadow-neo-sm">
                  <Crown className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h4 className="mt-4 font-heading text-xl font-black text-black group-hover:text-blue-700">
                  Tiers &amp; CTC Packages
                </h4>
                <p className="mt-2 text-xs font-bold text-slate-700 leading-relaxed">
                  Explore Super Dream, Dream, and Regular tier criteria, CTC benchmarks, and eligibility rules.
                </p>
              </div>
              <span className="mt-5 font-mono text-xs font-black text-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Tiers &rarr;
              </span>
            </Link>

            <Link
              to="/skills"
              className="flex flex-col justify-between rounded-xl border-3 border-black bg-[#FFFDF5] p-6 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all group"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-neo-purple text-black shadow-neo-sm">
                  <Sparkles className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h4 className="mt-4 font-heading text-xl font-black text-black group-hover:text-purple-700">
                  Campus Skill Matrix
                </h4>
                <p className="mt-2 text-xs font-bold text-slate-700 leading-relaxed">
                  Review the most in-demand competencies across tech recruiters mapped directly to Bloom&apos;s Taxonomy.
                </p>
              </div>
              <span className="mt-5 font-mono text-xs font-black text-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Skill Matrix &rarr;
              </span>
            </Link>

            <Link
              to="/playbook"
              className="flex flex-col justify-between rounded-xl border-3 border-black bg-[#FFFDF5] p-6 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all group"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-neo-orange text-black shadow-neo-sm">
                  <Award className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h4 className="mt-4 font-heading text-xl font-black text-black group-hover:text-amber-700">
                  4-Phase Prep Roadmap
                </h4>
                <p className="mt-2 text-xs font-bold text-slate-700 leading-relaxed">
                  Systematic Semester 5 to 8 preparation guide curated by SVCE alumni and placement directors.
                </p>
              </div>
              <span className="mt-5 font-mono text-xs font-black text-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Playbook &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Company Quick Preview Modal */}
      <CompanyPreviewModal
        company={previewCompany}
        onClose={() => setPreviewCompany(null)}
      />

      {/* Institutional Neo-Footer */}
      <footer className="border-t-4 border-black bg-white text-black py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-black font-black shadow-neo-sm">
                  <GraduationCap className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-black text-black">
                    {COLLEGE_NAME}
                  </h4>
                  <p className="text-xs font-bold text-slate-700">Department of Training &amp; Placement</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-xs font-semibold leading-relaxed text-slate-700">
                An Autonomous Institution affiliated to Anna University. Accredited by NAAC with &apos;A+&apos; Grade and NBA accredited programs. Pennalur, Sriperumbudur Tk, Tamil Nadu 602117.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="neo-tag bg-neo-green text-black">
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                  NAAC A+ ACCREDITED
                </span>
                <span className="neo-tag bg-neo-cyan text-black">
                  NBA ACCREDITED
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-heading text-xs font-black uppercase tracking-wider text-black">
                Placement Resources
              </h5>
              <ul className="mt-3 space-y-2 text-xs font-bold text-slate-700">
                <li>
                  <Link to="/tiers" className="hover:text-blue-700 underline">
                    Tier Salary Benchmarks
                  </Link>
                </li>
                <li>
                  <Link to="/skills" className="hover:text-blue-700 underline">
                    Bloom&apos;s Skill Index
                  </Link>
                </li>
                <li>
                  <Link to="/playbook" className="hover:text-blue-700 underline">
                    4-Phase Prep Roadmap
                  </Link>
                </li>
                <li>
                  <a href="https://www.svce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 underline">
                    SVCE Official Portal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-heading text-xs font-black uppercase tracking-wider text-black">
                Placement Cell Contact
              </h5>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-700">
                Office of Placement &amp; Training<br />
                Email: placement@svce.ac.in<br />
                Phone: +91 44 2715 2000 / 2715 2111
              </p>
              <p className="mt-4 text-[11px] font-bold text-slate-500">
                &copy; {new Date().getFullYear()} SVCE Placement Intelligence Hub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
