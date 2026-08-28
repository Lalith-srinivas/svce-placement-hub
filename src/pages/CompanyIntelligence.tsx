import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Globe, Link2, Building2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/company/CompanyLogo";
import { buildIntelligenceSections, type SectionDef } from "@/data/intelligenceData";
import { FieldRow } from "@/components/company/FieldRow";
import { CATEGORY_HEX, asString, isNullish } from "@/lib/companyData";

const SectionCard = memo(function SectionCard({
  section,
  raw,
  registerRef,
}: {
  section: SectionDef;
  raw: Record<string, unknown>;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const Icon = section.icon;

  // Filter only fields that actually have a non-null, non-empty value in the database
  const populatedFields = section.fields.filter((field) => !isNullish(raw[field.key]));

  if (populatedFields.length === 0) {
    return null;
  }

  return (
    <div
      id={section.id}
      ref={(el) => registerRef(section.id, el)}
      className="scroll-mt-40 rounded-xl border-3 border-black bg-white p-5 sm:p-6 shadow-neo"
    >
      <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-label font-bold text-slate-600">
        <span>Section {String(section.index).padStart(2, "0")}</span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-black shadow-neo-sm">
          <Icon className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-black text-black">{section.title}</h2>
          <p className="text-xs font-bold text-slate-600">{section.eyebrow}</p>
        </div>
        <span className="ml-auto rounded-md border border-black bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-black text-black">
          {populatedFields.length} {populatedFields.length === 1 ? "field" : "fields"}
        </span>
      </div>
      <div className="divide-y-2 divide-slate-100">
        {populatedFields.map((field) => (
          <FieldRow key={field.key} field={field} value={raw[field.key]} />
        ))}
      </div>
    </div>
  );
});

export default function CompanyIntelligence() {
  const { company } = useCompany();
  const rawData = (company?.raw as Record<string, unknown>) || {};

  // Build only sections that have at least one populated field
  const sections = useMemo(() => {
    const allSections = buildIntelligenceSections(company?.raw);
    return allSections.filter((sec) =>
      sec.fields.some((field) => !isNullish(rawData[field.key]))
    );
  }, [company?.raw, rawData]);

  const [activeId, setActiveId] = useState(sections[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabRailRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const registerRef = (id: string, el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  useEffect(() => {
    if (sections.length > 0 && !sections.some((s) => s.id === activeId)) {
      setActiveId(sections[0].id);
    }
  }, [sections, activeId]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      let closestId = sections[0]?.id;
      let closestDistance = Infinity;
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        const distance = Math.abs(el.getBoundingClientRect().top - 160);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = s.id;
        }
      }
      if (closestId) setActiveId(closestId);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  useEffect(() => {
    const tab = tabRefs.current[activeId];
    const rail = tabRailRef.current;
    if (tab && rail) {
      const railRect = rail.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const offset = tabRect.left - railRect.left - railRect.width / 2 + tabRect.width / 2;
      rail.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, [activeId]);

  if (!company) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-center">
        <div className="rounded-xl border-3 border-black bg-white p-8 shadow-neo">
          <Building2 className="h-10 w-10 mx-auto stroke-[2.5] text-black" />
          <h2 className="mt-3 font-heading text-lg font-black text-black">No Recruiter Selected</h2>
          <p className="mt-1 text-xs font-bold text-slate-600">Please choose a recruiter from the directory.</p>
        </div>
      </div>
    );
  }

  const hex = CATEGORY_HEX[company.companyType] || "#334155";
  const websiteDomain = company.websiteUrl
    ? company.websiteUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : "";

  const scrollTo = (id: string) => {
    setActiveId(id);
    isScrollingRef.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    scrollTimeout.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      {/* Header card */}
      <div className="border-b-4 border-black bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <CompanyLogo
                name={company.name}
                logoUrl={company.logoUrl}
                websiteUrl={company.websiteUrl}
                accentHex={hex}
                className="h-16 w-16 shrink-0 rounded-xl border-3 border-black bg-white p-1.5 shadow-neo-sm"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-2xl font-black text-black sm:text-3xl">
                    {company.name}
                  </h1>
                  <span className="rounded-md border-2 border-black bg-neo-yellow px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black shadow-neo-sm">
                    {company.companyType}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-700">
                  {company.category} · Est. {company.incorporationYear ?? "N/A"}
                </p>
              </div>
            </div>

            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-white rounded-lg px-3.5 py-2 text-xs font-black shadow-neo-sm w-fit"
              >
                <Globe className="h-4 w-4 mr-1 stroke-[2.5]" />
                {websiteDomain || "Visit Website"}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      {sections.length > 0 && (
        <div className="sticky top-0 z-30 border-b-3 border-black bg-white shadow-neo-sm">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div
              ref={tabRailRef}
              className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none"
            >
              {sections.map((s) => {
                const active = s.id === activeId;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabRefs.current[s.id] = el;
                    }}
                    onClick={() => scrollTo(s.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                      active
                        ? "bg-neo-yellow text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                        : "bg-white text-black hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {sections.length === 0 ? (
          <div className="rounded-xl border-3 border-black bg-white p-8 text-center shadow-neo">
            <Building2 className="h-10 w-10 mx-auto stroke-[2.5] text-black" />
            <p className="mt-3 font-heading text-base font-black text-black">No Structured Profile Recorded</p>
            <p className="mt-1 text-xs font-bold text-slate-600">
              Basic company details are available in the directory.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                raw={rawData}
                registerRef={registerRef}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
