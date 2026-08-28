import { memo } from "react";
import { CheckSquare, BrainCircuit, Target, Rocket, Lightbulb, Compass } from "lucide-react";

export const PlacementPlaybookSection = memo(function PlacementPlaybookSection() {
  const steps = [
    {
      step: "01",
      title: "Core Foundation & DSA",
      timing: "Semester 5 (May – Nov)",
      icon: BrainCircuit,
      bg: "bg-neo-cyan",
      description:
        "Master Arrays, Trees, Graphs, Dynamic Programming and Complexity. Practice 250+ curated LeetCode/CodeChef problems.",
      checkpoints: ["Master C++ STL or Java Collections", "Solve 150 Medium & 30 Hard DSA questions", "Solidify OS, DBMS & Computer Networks theory"],
    },
    {
      step: "02",
      title: "Projects & System Design",
      timing: "Semester 6 (Dec – Apr)",
      icon: Target,
      bg: "bg-neo-pink",
      description:
        "Build 2 end-to-end full stack / distributed projects. Understand Low-Level Design (LLD), OOP design patterns, and REST APIs.",
      checkpoints: ["Deploy 1 production application on AWS/GCP", "Implement caching (Redis) & indexing", "Create clean architecture design documents"],
    },
    {
      step: "03",
      title: "Company Intelligence",
      timing: "Semester 7 (May – Aug)",
      icon: Compass,
      bg: "bg-neo-yellow",
      description:
        "Use this SVCE Intelligence Platform to dissect recruiter hiring rubrics, required skill levels, tech stacks, and interview rounds.",
      checkpoints: ["Study company leadership principles (e.g. Amazon STAR)", "Solve company-specific past coding patterns", "Prepare domain-specific case studies & projects"],
    },
    {
      step: "04",
      title: "Mock Drives & Offers",
      timing: "Semester 7–8 (Aug onwards)",
      icon: Rocket,
      bg: "bg-neo-green",
      description:
        "Participate in peer mock interviews, placement cell pre-assessment bootcamps, and live on-campus recruitment cycles.",
      checkpoints: ["Conduct 5+ live peer coding mock interviews", "Refine STAR method for behavioral & HR rounds", "Maintain high energy & post-round reviews"],
    },
  ];

  return (
    <section id="placement-playbook" className="border-t-3 border-black bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="neo-sticker bg-neo-green text-black">
            <CheckSquare className="h-3.5 w-3.5 stroke-[2.5]" />
            SVCE PREP ROADMAP
          </span>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-black sm:text-4xl">
            The 4-Phase Roadmap to Super Dream Placements
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-700 sm:text-base">
            Curated strategy formulated by SVCE alumni and placement directors to guide students from semester 5 to dream campus offers.
          </p>
        </div>

        {/* Step Timeline Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative flex flex-col rounded-xl border-3 border-black bg-[#FFFDF5] p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-black">{s.step}</span>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black ${s.bg} text-black shadow-neo-sm`}>
                    <Icon className="h-6 w-6 stroke-[2.5]" />
                  </div>
                </div>

                <h3 className="mt-4 font-heading text-lg font-black text-black leading-snug">{s.title}</h3>
                <span className="mt-1 inline-block font-mono text-[10px] font-black text-black bg-neo-yellow border border-black px-2 py-0.5 rounded-sm w-fit uppercase">
                  {s.timing}
                </span>

                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-700">{s.description}</p>

                <div className="mt-4 space-y-2 border-t-2 border-black pt-3">
                  <span className="text-[11px] font-black text-black uppercase font-heading">Key Milestones</span>
                  {s.checkpoints.map((cp, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] font-medium text-slate-800">
                      <div className="mt-1 h-2 w-2 rounded-sm bg-black shrink-0" />
                      <span>{cp}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro-Tips Neo-Banner */}
        <div className="mt-12 rounded-2xl border-4 border-black bg-neo-yellow p-6 sm:p-8 text-black shadow-neo-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-neo-sm">
                <Lightbulb className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-heading text-xl font-black text-black">
                  Pro-Tip: Recruiter Intelligence is Your Unfair Advantage
                </h4>
                <p className="mt-1 text-xs font-bold text-slate-800 leading-relaxed max-w-2xl">
                  Recruiters evaluate not just generic coding, but whether you understand their engineering culture, architectural stack, and leadership principles. Review the intelligence profile of your target company before the interview!
                </p>
              </div>
            </div>
            <a
              href="#company-directory"
              className="neo-btn-cyan rounded-xl px-5 py-3 text-xs font-black shadow-neo whitespace-nowrap"
            >
              Explore Profiles &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
