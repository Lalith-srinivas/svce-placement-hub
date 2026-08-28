import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { PlacementAnalyticsSection } from "@/components/home/PlacementAnalyticsSection";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tiers() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      {/* Page Header */}
      <section className="border-b-4 border-black bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="neo-sticker bg-neo-green text-black mb-3">
              <Crown className="h-3.5 w-3.5 stroke-[2.5]" />
              OFFICIAL CTC &amp; PLACEMENT TIERS
            </span>
            <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-black sm:text-5xl">
              Campus Placement Tiers &amp; Package Benchmarks
            </h1>
            <p className="mt-4 text-sm font-bold text-slate-800 leading-relaxed sm:text-base">
              Detailed breakdown of recruitment criteria, CTC bands, eligibility rules, and evaluation stages set by the SVCE Training &amp; Placement Cell for the 2025–26 academic year.
            </p>
          </div>
        </div>
      </section>

      {/* Tier Matrix Content */}
      <main className="py-8">
        <PlacementAnalyticsSection />
      </main>

      {/* Call to action */}
      <section className="border-t-3 border-black bg-neo-yellow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-2xl font-black text-black">Ready to explore recruiter profiles?</h3>
            <p className="text-xs font-bold text-slate-800 mt-1">
              Browse company dossiers, tech stacks, and required competencies in the directory.
            </p>
          </div>
          <Link to="/" className="neo-btn-cyan rounded-xl px-6 py-3 text-xs font-black shadow-neo">
            Go to Recruiter Directory <ArrowRight className="h-4 w-4 ml-1 stroke-[3]" />
          </Link>
        </div>
      </section>

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
