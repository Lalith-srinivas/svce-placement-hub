import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { CompanyProvider } from "@/context/CompanyContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "@/pages/Index";
import Tiers from "@/pages/Tiers";
import SkillsIndex from "@/pages/SkillsIndex";
import Playbook from "@/pages/Playbook";
import CompanyIntelligence from "@/pages/CompanyIntelligence";
import SkillIntelligence from "@/pages/SkillIntelligence";
import AuthPage from "@/pages/AuthPage";
import StudentProfileDashboard from "@/pages/StudentProfileDashboard";
import ProfileOnboardingPage from "@/pages/ProfileOnboardingPage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import MyMatrixPage from "@/pages/MyMatrixPage";
import CompanyStudentMatrixPage from "@/pages/CompanyStudentMatrixPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <CompanyProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                {/* Main Multi-Page Navigation */}
                <Route path="/" element={<Index />} />
                <Route path="/tiers" element={<Tiers />} />
                <Route path="/skills" element={<SkillsIndex />} />
                <Route path="/playbook" element={<Playbook />} />

                {/* Student Placement Matrix */}
                <Route path="/matrix" element={<MyMatrixPage />} />
                <Route path="/my-matrix" element={<Navigate to="/matrix" replace />} />

                {/* Student Profile Module */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/profile" element={<StudentProfileDashboard />} />
                <Route path="/profile/onboarding" element={<ProfileOnboardingPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />

                {/* Company Detailed Intelligence & Skills & Student Matrix */}
                <Route path="/company" element={<AppLayout />}>
                  <Route index element={<Navigate to="intelligence" replace />} />
                  <Route path="intelligence" element={<CompanyIntelligence />} />
                  <Route path="skills" element={<SkillIntelligence />} />
                  <Route path="matrix" element={<CompanyStudentMatrixPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CompanyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
