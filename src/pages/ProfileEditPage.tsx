import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { ProfileWizard } from "@/components/profile/ProfileWizard";
import { ArrowLeft, UserCheck } from "lucide-react";

export default function ProfileEditPage() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      {/* Header Banner */}
      <section className="border-b-4 border-black bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-slate-600 hover:text-black hover:underline mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="neo-sticker bg-neo-cyan text-black">
                  <UserCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                  EDIT PROFILE MODE
                </span>
              </div>
              <h1 className="mt-2 font-heading text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                Update Your Placement Profile
              </h1>
              <p className="mt-1 text-xs font-bold text-slate-700">
                Modify your CGPA, newly acquired skills, projects, certifications, or upload an updated resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard Form Section */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ProfileWizard initialProfile={profile} isEditMode={true} />
      </main>
    </div>
  );
}
