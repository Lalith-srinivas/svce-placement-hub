import { memo } from "react";
import { Crown, Sparkles, Shield, CheckCircle2, Zap } from "lucide-react";

export const PlacementAnalyticsSection = memo(function PlacementAnalyticsSection() {
  const tiers = [
    {
      name: "Super Dream",
      badge: "≥₹20 LPA",
      bg: "bg-neo-purple",
      icon: Crown,
      recruiters: "Google, Microsoft, Amazon, Qualcomm",
      eligibility: "CGPA ≥ 8.5 · No standing arrears · Advanced DSA mastery",
      rounds: "Online Assessment (Hard) -> 3–4 Tech Rounds (DS/Algo & System Design) -> Bar Raiser / Managerial",
    },
    {
      name: "Dream",
      badge: "≥₹9 LPA",
      bg: "bg-neo-cyan",
      icon: Sparkles,
      recruiters: "Cisco, Accenture Adv, Zoho MTS, Oracle",
      eligibility: "CGPA ≥ 7.5 · Up to 1 standing history · Core CS Fundamentals",
      rounds: "Aptitude + DS Coding -> 2 Tech Rounds (OOP, SQL, Networks/OS, Projects) -> HR & Core Values",
    },
    {
      name: "Regular",
      badge: "≥₹4 LPA",
      bg: "bg-neo-orange",
      icon: Shield,
      recruiters: "Cognizant GenC, Infosys, Wipro",
      eligibility: "CGPA ≥ 6.0 · All engineering disciplines eligible",
      rounds: "Online Cognitive & Coding Test -> Technical Interview -> HR Round",
    },
  ];

  const topSkills = [
    { name: "Data Structures & Algorithms", importance: 98, level: "Expert", color: "bg-neo-purple" },
    { name: "Object-Oriented Design (Java/C++)", importance: 92, level: "Expert", color: "bg-neo-cyan" },
    { name: "System Design & Distributed Cloud", importance: 88, level: "Advanced", color: "bg-neo-green" },
    { name: "SQL, Indexing & Database Internals", importance: 85, level: "Advanced", color: "bg-neo-yellow" },
    { name: "OS, Linux Internals & Concurrency", importance: 80, level: "Advanced", color: "bg-neo-pink" },
    { name: "Generative AI & LLM Tooling", importance: 78, level: "Proficient", color: "bg-neo-orange" },
  ];

  return (
    <section id="tier-matrix" className="border-t-3 border-black bg-[#FFFDF5] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="neo-sticker bg-neo-yellow text-black">
            <Zap className="h-3.5 w-3.5 fill-black" />
            SVCE PLACEMENT CLASSIFICATION MATRIX
          </span>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-black sm:text-4xl">
            Campus Placement Tiers &amp; Package Benchmarks
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-700 sm:text-base">
            Understand the recruitment criteria, salary brackets, and evaluation stages set by the SVCE Training &amp; Placement Cell.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="flex flex-col rounded-xl border-3 border-black bg-white p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black ${t.bg} text-black shadow-neo-sm`}>
                    <Icon className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <span className={`rounded-md border-2 border-black ${t.bg} px-2.5 py-0.5 font-mono text-[11px] font-black text-black shadow-neo-sm`}>
                    {t.badge}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-xl font-black text-black">{t.name} Tier</h3>
                <p className="mt-1 text-xs font-bold text-slate-600">Recruiters: {t.recruiters}</p>

                <div className="mt-4 space-y-3 text-xs border-t-2 border-black pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-black text-black block mb-1 uppercase tracking-wider text-[11px]">Eligibility Criteria</span>
                    <p className="text-slate-800 font-medium leading-relaxed text-[11px] bg-slate-50 rounded-lg p-2.5 border-2 border-black shadow-neo-sm">
                      {t.eligibility}
                    </p>
                  </div>

                  <div>
                    <span className="font-heading font-black text-black block mb-1 uppercase tracking-wider text-[11px]">Selection Workflow</span>
                    <p className="text-slate-800 font-medium leading-relaxed text-[11px] bg-slate-50 rounded-lg p-2.5 border-2 border-black shadow-neo-sm">
                      {t.rounds}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills Radar & In-Demand Tech Section */}
        <div id="skills-radar" className="mt-16 rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-lg">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="neo-sticker bg-neo-pink text-black">
                <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                CAMPUS SKILL INDEX
              </span>
              <h3 className="mt-4 font-heading text-2xl font-black text-black sm:text-3xl">
                Most In-Demand Competencies Across Top Recruiters
              </h3>
              <p className="mt-3 text-xs font-bold text-slate-700 leading-relaxed sm:text-sm">
                Aggregated from company intelligence profiles across Super Dream and Dream tiers. Master these critical core areas to maximize your selection probability.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-neo-yellow px-2.5 py-1 font-mono font-bold text-black shadow-neo-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  Bloom's Taxonomy
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-neo-cyan px-2.5 py-1 font-mono font-bold text-black shadow-neo-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  Recruiter Calibrated
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {topSkills.map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-black">{s.name}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-600 font-bold">{s.level}</span>
                      <span className="text-black font-black bg-neo-yellow border border-black px-1.5 py-0.2 rounded-sm">{s.importance}%</span>
                    </div>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-md border-2 border-black bg-slate-100 shadow-neo-sm">
                    <div
                      className={`h-full border-r-2 border-black ${s.color}`}
                      style={{ width: `${s.importance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
