import { NavLink, useNavigate } from "react-router-dom";
import { BookOpenText, Radar, PanelLeftClose, PanelLeftOpen, LayoutGrid, X, Sparkles } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/company/intelligence", label: "Company Intelligence", icon: Radar },
  { to: "/company/skills", label: "Skill Intelligence", icon: BookOpenText },
  { to: "/company/matrix", label: "Student Matrix", icon: Sparkles },
];

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      <div className={cn("flex h-16 items-center gap-2 border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy font-heading text-xs font-bold text-white">
          SV
        </div>
        {!collapsed && (
          <span className="truncate font-mono text-[11px] font-medium uppercase tracking-label text-sidebar-foreground">
            Intelligence Hub
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => {
            navigate("/");
            onNavigate?.();
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "All Companies" : undefined}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          {!collapsed && <span>All Companies</span>}
        </button>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border transition-all duration-200 md:block",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarInner />
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar-background shadow-xl animate-fade-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-4 flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
