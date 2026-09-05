import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Building2,
  BookOpen,
  BarChart3,
  ExternalLink,
  GraduationCap,
  Zap,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b-3 border-black transition-colors duration-150 ${
        scrolled ? "bg-neo-yellow shadow-neo-sm" : "bg-[#FFFDF5]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black shadow-neo-sm group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-sm sm:text-base font-black tracking-tight text-black whitespace-nowrap">
                SVCE PLACEMENT HUB
              </span>
              <span className="rounded border border-black bg-neo-pink px-1.5 py-0.2 font-mono text-[9px] font-black text-black shadow-neo-sm">
                ⚡ LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 truncate max-w-[210px] sm:max-w-xs leading-tight">
              Sri Venkateswara College of Engineering
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Tabs (Visible on XL screens to prevent overcrowding) */}
        <nav className="hidden xl:flex items-center gap-2">
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

          {/* My Matrix Navigation Item */}
          <NavLink
            to="/matrix"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-pink text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-pink hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <Target className="h-3.5 w-3.5 stroke-[2.5]" />
            My Matrix
          </NavLink>

          {/* Profile Navigation Item */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer shadow-neo-sm",
                isActive
                  ? "bg-neo-cyan text-black translate-x-0.5 translate-y-0.5 shadow-neo-active"
                  : "bg-white text-black hover:bg-neo-cyan hover:translate-x-0.5 hover:translate-y-0.5"
              )
            }
          >
            <User className="h-3.5 w-3.5 stroke-[2.5]" />
            Profile
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Drives active tag - visible on 2XL */}
          <div className="hidden 2xl:flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-green px-2.5 py-1 text-xs font-mono font-bold text-black shadow-neo-sm">
            <Zap className="h-3.5 w-3.5 fill-black" />
            2025–26 DRIVES
          </div>

          {/* Student Status or Profile Quick Link */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-yellow px-2.5 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                {profile?.personal?.full_name?.charAt(0) || "S"}
              </div>
              <span className="hidden sm:inline truncate max-w-[100px]">
                {profile?.personal?.full_name?.split(" ")[0] || "Profile"}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-slate-50 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* SVCE Official Link */}
          <a
            href="https://www.svce.ac.in/placement/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2.5 py-1.5 text-xs font-heading font-black shadow-neo-sm hover:bg-slate-50 transition-all"
          >
            <span>SVCE Official</span>
            <ExternalLink className="h-3 w-3 stroke-[2.5]" />
          </a>

          {/* Hamburger Menu Button (Visible below XL screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex xl:hidden items-center justify-center rounded-lg border-2 border-black bg-white p-2 text-black shadow-neo-sm hover:bg-neo-yellow transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Responsive Slide-out / Hamburger Drawer (Below XL) */}
      {mobileMenuOpen && (
        <div className="border-t-3 border-black bg-[#FFFDF5] p-4 xl:hidden shadow-neo-lg animate-in fade-in slide-in-from-top-3">
          {/* User Status Bar in Drawer */}
          {user ? (
            <div className="mb-3 flex items-center justify-between rounded-xl border-2 border-black bg-neo-yellow/30 p-3 shadow-neo-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-xs font-black">
                  {profile?.personal?.full_name?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="font-heading text-xs font-black text-black">
                    {profile?.personal?.full_name || "Student Account"}
                  </p>
                  <p className="font-mono text-[10px] text-slate-600">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1 rounded border border-black bg-white px-2 py-1 font-mono text-[10px] font-black text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mb-3 flex items-center justify-between rounded-xl border-2 border-black bg-neo-cyan/20 p-3 shadow-neo-sm">
              <div>
                <p className="font-heading text-xs font-black text-black">
                  SVCE Placement Student Portal
                </p>
                <p className="font-mono text-[10px] text-slate-600">
                  Sign in or use Quick Demo access
                </p>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border-2 border-black bg-neo-yellow px-3 py-1 font-heading text-xs font-black uppercase shadow-neo-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-yellow text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 stroke-[2.5]" />
                <span>Recruiters Directory</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>

            <NavLink
              to="/tiers"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-green text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 stroke-[2.5]" />
                <span>Tiers &amp; CTC Analysis</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>

            <NavLink
              to="/skills"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-purple text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
                <span>Skill Matrix Index</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>

            <NavLink
              to="/playbook"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-orange text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 stroke-[2.5]" />
                <span>4-Step Prep Playbook</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>

            <NavLink
              to="/matrix"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-pink text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 stroke-[2.5]" />
                <span>My Matrix (Readiness)</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg border-2 border-black p-2.5 text-xs font-black uppercase transition-all shadow-neo-sm",
                  isActive ? "bg-neo-cyan text-black" : "bg-white text-black hover:bg-slate-50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 stroke-[2.5]" />
                <span>Student Profile &amp; Dashboard</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </NavLink>
          </div>

          {/* Footer inside Drawer */}
          <div className="mt-3 flex items-center justify-between pt-3 border-t-2 border-slate-200">
            <div className="flex items-center gap-1.5 rounded border border-black bg-neo-green px-2 py-0.5 text-[10px] font-mono font-bold text-black">
              <Zap className="h-3 w-3 fill-black" />
              2025–26 DRIVES ACTIVE
            </div>

            <a
              href="https://www.svce.ac.in/placement/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-heading text-xs font-black text-black hover:underline"
            >
              <span>SVCE Official Portal</span>
              <ExternalLink className="h-3 w-3 stroke-[2.5]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
