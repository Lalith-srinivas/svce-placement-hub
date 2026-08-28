import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { normalizeCompanyProfile, type CompanyProfile, type CompanySummary } from "@/lib/companyData";
import { isSupabaseConfigured, fetchCompaniesFromSupabase, fetchCompanyProfileFromSupabase } from "@/lib/supabase";

const STORAGE_KEY = "selected-company";

interface SelectedCompanyRef {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  company: CompanyProfile | null;
  companiesList: CompanySummary[];
  loadingCompanies: boolean;
  isBackendConnected: boolean;
  error: string | null;
  selectCompany: (companyId: number) => void;
  clearCompany: () => void;
  refetchCompanies: () => Promise<void>;
  hydrated: boolean;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [companiesList, setCompaniesList] = useState<CompanySummary[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        const list = await fetchCompaniesFromSupabase();
        setCompaniesList(list);
      } else {
        // No Supabase backend connected yet
        setCompaniesList([]);
      }
    } catch (err: any) {
      console.error("Failed to load companies from backend:", err);
      setError(err?.message || "Failed to load companies from Supabase");
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Hydrate selected company from storage
  useEffect(() => {
    async function hydrate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const ref: SelectedCompanyRef = JSON.parse(raw);
          if (isSupabaseConfigured) {
            const res = await fetchCompanyProfileFromSupabase(ref.companyId);
            if (res?.profile) {
              setCompany(res.profile);
            }
          }
        }
      } catch (e) {
        console.error("Error hydrating selected company:", e);
      } finally {
        setHydrated(true);
      }
    }
    hydrate();
  }, []);

  const selectCompany = async (companyId: number) => {
    try {
      if (isSupabaseConfigured) {
        const res = await fetchCompanyProfileFromSupabase(companyId);
        if (res?.profile) {
          setCompany(res.profile);
          const ref: SelectedCompanyRef = {
            companyId: res.profile.companyId,
            companyName: res.profile.name,
            logoUrl: res.profile.logoUrl,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ref));
          return;
        }
      }
      
      // If company summary already exists in loaded list
      const found = companiesList.find((c) => c.companyId === companyId);
      if (found) {
        const fallbackProfile = normalizeCompanyProfile({}, { ...found, company_id: found.companyId });
        setCompany(fallbackProfile);
        const ref: SelectedCompanyRef = {
          companyId: found.companyId,
          companyName: found.name,
          logoUrl: found.logoUrl,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ref));
      }
    } catch (err) {
      console.error("Error selecting company:", err);
    }
  };

  const clearCompany = () => {
    setCompany(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  const value = useMemo(
    () => ({
      company,
      companiesList,
      loadingCompanies,
      isBackendConnected: isSupabaseConfigured,
      error,
      selectCompany,
      clearCompany,
      refetchCompanies: loadCompanies,
      hydrated,
    }),
    [company, companiesList, loadingCompanies, error, hydrated, selectCompany]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
