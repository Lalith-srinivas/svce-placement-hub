import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { ProfileWizard } from "@/components/profile/ProfileWizard";
import { GraduationCap, CheckCircle2 } from "lucide-react";

export default function ProfileOnboardingPage() {
  const { user, hasProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  // If unauthenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If profile already exists, skip the onboarding form and go to dashboard
  if (hasProfile) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      {/* Header Banner */}
      <section className="border-b-4 border-black bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="neo-sticker bg-neo-yellow text-black">
                  <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                  MANDATORY ONBOARDING
                </span>
                <span className="rounded-md border-2 border-black bg-neo-pink px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-neo-sm">
                  ⚡ PLACEMENT 2026
                </span>
              </div>
              <h1 className="mt-3 font-heading text-2xl font-black uppercase tracking-tight text-black sm:text-4xl">
                Create Your Official Placement Profile
              </h1>
              <p className="mt-2 text-xs font-bold text-slate-700 sm:text-sm">
                SVCE Placement Cell requires all pre-final & final year students to configure their verified academic credentials, resume, skills, and placement preferences.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1 rounded-xl border-2 border-black bg-neo-green/20 p-4 shadow-neo-sm">
              <span className="font-mono text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                Single Sign-On Verified
              </span>
              <span className="font-mono text-xs font-black text-black">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard Form Section */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ProfileWizard isEditMode={false} />
      </main>
    </div>
  );
}
