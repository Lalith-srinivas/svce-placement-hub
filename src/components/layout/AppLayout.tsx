import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, ChevronRight } from "lucide-react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { AppSidebar } from "./AppSidebar";
import { useCompany } from "@/context/CompanyContext";

function Header() {
  const { setMobileOpen } = useSidebar();
  const { company } = useCompany();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:hidden">
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
        <span className="font-mono text-[11px] uppercase tracking-label">Hub</span>
        {company && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate font-medium text-foreground">{company.shortName}</span>
          </>
        )}
      </div>
    </header>
  );
}

function LayoutShell() {
  const navigate = useNavigate();
  const { company, hydrated } = useCompany();

  useEffect(() => {
    if (hydrated && !company) {
      navigate("/", { replace: true });
    }
  }, [hydrated, company, navigate]);

  if (!hydrated) {
    return <div className="flex min-h-screen items-center justify-center bg-background" />;
  }

  if (!company) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  );
}
