import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sparkles, Building2, BookOpen, BarChart3, ExternalLink, GraduationCap, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b-2 border-black transition-colors duration-150 ${
        scrolled ? "bg-neo-yellow shadow-neo" : "bg-[#FFFDF5]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black shadow-neo-sm group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-black tracking-tight text-black">
                SVCE PLACEMENT HUB
              </span>
              <span className="hidden rounded-md border-2 border-black bg-neo-pink px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-neo-sm sm:inline-flex">
                ⚡ LIVE
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-700 hidden sm:block">
              Sri Venkateswara College of Engineering (Autonomous)
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-yellow text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-yellow hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <Building2 className="h-3.5 w-3.5 stroke-[2.5]" />
            Recruiters
          </NavLink>

          <NavLink
            to="/tiers"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-green text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-green hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <BarChart3 className="h-3.5 w-3.5 stroke-[2.5]" />
            Tiers &amp; CTC
          </NavLink>

          <NavLink
            to="/skills"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-purple text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-purple hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            Skill Matrix
          </NavLink>

          <NavLink
            to="/playbook"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-orange text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-orange hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
            4-Step Prep
          </NavLink>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-green px-2.5 py-1 text-xs font-mono font-bold text-black shadow-neo-sm">
            <Zap className="h-3.5 w-3.5 fill-black" />
            2025–26 DRIVES ACTIVE
          </div>

          <a
            href="https://www.svce.ac.in/placement/"
            target="_blank"
            rel="noreferrer"
            className="neo-btn-white rounded-lg px-3 py-1.5 text-xs font-bold"
          >
            <span>SVCE Official</span>
            <ExternalLink className="h-3 w-3 ml-1 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </header>
  );
}
