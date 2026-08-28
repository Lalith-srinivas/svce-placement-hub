import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { Sparkles, BrainCircuit, Code2, Database, Cpu, Network, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { SKILL_TOPICS } from "@/data/skillTopics";

const CORE_SKILLS = [
  { id: 1, name: "Data Structures & Algorithms", icon: Code2, bg: "bg-neo-purple", level: "Expert", pct: 98, desc: "Arrays, Trees, Dynamic Programming, Graphs & Complexity." },
  { id: 2, name: "Object-Oriented Programming", icon: BrainCircuit, bg: "bg-neo-cyan", level: "Expert", pct: 92, desc: "Classes, Polymorphism, SOLID principles & Design Patterns." },
  { id: 3, name: "SQL & Relational Databases", icon: Database, bg: "bg-neo-yellow", level: "Advanced", pct: 88, desc: "Joins, Indexing, Transactions, ACID & Query Tuning." },
  { id: 4, name: "Cloud Computing Fundamentals", icon: Sparkles, bg: "bg-neo-green", level: "Advanced", pct: 85, desc: "AWS, Azure, Compute, Storage & Containerization." },
  { id: 5, name: "Operating Systems & Concurrency", icon: Cpu, bg: "bg-neo-pink", level: "Advanced", pct: 80, desc: "Processes, Threads, Synchronization & Memory Paging." },
  { id: 6, name: "Computer Networks & Protocols", icon: Network, bg: "bg-neo-orange", level: "Advanced", pct: 78, desc: "TCP/IP, OSI, DNS, HTTP/HTTPS & Routing." },
  { id: 10, name: "System Design & Distributed Systems", icon: Terminal, bg: "bg-neo-cyan", level: "Expert", pct: 86, desc: "High-level design, Caching, Load Balancing & Microservices." },
  { id: 12, name: "Generative AI & Modern Tooling", icon: Sparkles, bg: "bg-neo-purple", level: "Proficient", pct: 82, desc: "LLMs, RAG, Prompt Engineering & AI Workflows." },
];

export default function SkillsIndex() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      {/* Header */}
      <section className="border-b-4 border-black bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="neo-sticker bg-neo-purple text-black mb-3">
              <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
              CAMPUS SKILL BENCHMARKS
            </span>
            <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-black sm:text-5xl">
              Recruiter-Calibrated Skill Competency Index
            </h1>
            <p className="mt-4 text-sm font-bold text-slate-800 leading-relaxed sm:text-base">
              Aggregated screening bars and 10-level topic roadmaps mapped to Bloom&apos;s Taxonomy across Super Dream and Dream tech recruiters.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CORE_SKILLS.map((skill) => {
            const Icon = skill.icon;
            const topics = SKILL_TOPICS[skill.id] || [];
            return (
              <div
                key={skill.id}
                className="flex flex-col justify-between rounded-xl border-3 border-black bg-white p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black ${skill.bg} text-black shadow-neo-sm`}>
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className="rounded-md border border-black bg-neo-yellow px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                      {skill.level} ({skill.pct}%)
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-black text-black">{skill.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-700 leading-relaxed">{skill.desc}</p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-3 w-full overflow-hidden rounded-md border-2 border-black bg-slate-100 shadow-neo-sm">
                      <div
                        className={`h-full border-r-2 border-black ${skill.bg}`}
                        style={{ width: `${skill.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Topic sample */}
                  <div className="mt-4 space-y-1.5 border-t-2 border-black pt-3">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-600">Sample Milestones:</span>
                    {topics.slice(0, 3).map((t) => (
                      <div key={t.level_number} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                        <span className="font-mono text-[9px] bg-slate-100 border border-black px-1 rounded-xs">L{t.level_number}</span>
                        <span className="truncate">{t.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black">
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-1 text-xs font-black text-black hover:text-blue-700 font-mono"
                  >
                    View Recruiters Requiring This &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white text-black py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-700">
            Sri Venkateswara College of Engineering (SVCE) · Department of Training &amp; Placement
          </p>
          <p className="text-xs font-mono font-black text-black">
            &copy; {new Date().getFullYear()} SVCE Placement Intelligence Hub
          </p>
        </div>
      </footer>
    </div>
  );
}
