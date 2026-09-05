import React, { useState } from "react";
import type { StudentPreferences } from "@/types/studentProfile";
import {
  POPULAR_DREAM_COMPANIES,
  POPULAR_LOCATIONS,
  PACKAGE_OPTIONS,
} from "@/types/studentProfile";
import { Briefcase, Building2, MapPin, DollarSign, Check } from "lucide-react";

interface StepProps {
  preferences: StudentPreferences;
  onChange: (preferences: StudentPreferences) => void;
  errors: Record<string, string>;
}

export const PlacementPreferencesStep: React.FC<StepProps> = ({
  preferences,
  onChange,
  errors,
}) => {
  const [customCompany, setCustomCompany] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  const toggleCompany = (company: string) => {
    const current = preferences.dream_companies || [];
    if (current.includes(company)) {
      onChange({ ...preferences, dream_companies: current.filter((c) => c !== company) });
    } else {
      onChange({ ...preferences, dream_companies: [...current, company] });
    }
  };

  const addCustomCompany = () => {
    const trimmed = customCompany.trim();
    if (!trimmed) return;
    const current = preferences.dream_companies || [];
    if (!current.includes(trimmed)) {
      onChange({ ...preferences, dream_companies: [...current, trimmed] });
    }
    setCustomCompany("");
  };

  const toggleLocation = (loc: string) => {
    const current = preferences.preferred_locations || [];
    if (current.includes(loc)) {
      onChange({ ...preferences, preferred_locations: current.filter((l) => l !== loc) });
    } else {
      onChange({ ...preferences, preferred_locations: [...current, loc] });
    }
  };

  const addCustomLocation = () => {
    const trimmed = customLocation.trim();
    if (!trimmed) return;
    const current = preferences.preferred_locations || [];
    if (!current.includes(trimmed)) {
      onChange({ ...preferences, preferred_locations: [...current, trimmed] });
    }
    setCustomLocation("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-200 pb-4">
        <h2 className="font-heading text-xl font-black text-black">Step 6: Placement Preferences & Aspirations</h2>
        <p className="mt-1 text-xs font-bold text-slate-700">
          State your career targets and relocation readiness to match with campus placement drives and shortlist algorithms.
        </p>
      </div>

      <div className="space-y-6">
        {/* Preferred Role */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
            Preferred Primary Role *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              value={preferences.preferred_role}
              onChange={(e) => onChange({ ...preferences, preferred_role: e.target.value })}
              placeholder="e.g. Software Development Engineer (SDE), Cloud Engineer, AI/ML Specialist"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.preferred_role ? "border-red-500 bg-red-50" : "border-black"
              }`}
            />
          </div>
          {errors.preferred_role && (
            <p className="mt-1 text-[11px] font-bold text-red-600">{errors.preferred_role}</p>
          )}
        </div>

        {/* Dream Companies */}
        <div className="rounded-xl border-2 border-black bg-slate-50 p-4 shadow-neo-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-black" />
              Dream Companies (Select or Type) *
            </label>
            <span className="font-mono text-[11px] font-bold text-slate-600">
              {preferences.dream_companies?.length || 0} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {POPULAR_DREAM_COMPANIES.map((company) => {
              const selected = preferences.dream_companies?.includes(company);
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => toggleCompany(company)}
                  className={`flex items-center gap-1 rounded-lg border-2 border-black px-2.5 py-1 text-xs font-heading font-black transition-all cursor-pointer ${
                    selected
                      ? "bg-neo-purple text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {selected && <Check className="h-3 w-3 stroke-[3]" />}
                  <span>{company}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other dream companies..."
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomCompany();
                }
              }}
              className="flex-1 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
            />
            <button
              type="button"
              onClick={addCustomCompany}
              className="rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-slate-100 cursor-pointer"
            >
              + Add
            </button>
          </div>
          {errors.dream_companies && (
            <p className="mt-1.5 text-[11px] font-bold text-red-600">{errors.dream_companies}</p>
          )}
        </div>

        {/* Preferred Locations */}
        <div className="rounded-xl border-2 border-black bg-slate-50 p-4 shadow-neo-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-black" />
              Preferred Job Locations *
            </label>
            <span className="font-mono text-[11px] font-bold text-slate-600">
              {preferences.preferred_locations?.length || 0} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {POPULAR_LOCATIONS.map((loc) => {
              const selected = preferences.preferred_locations?.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleLocation(loc)}
                  className={`flex items-center gap-1 rounded-lg border-2 border-black px-2.5 py-1 text-xs font-heading font-black transition-all cursor-pointer ${
                    selected
                      ? "bg-neo-cyan text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {selected && <Check className="h-3 w-3 stroke-[3]" />}
                  <span>{loc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other location..."
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomLocation();
                }
              }}
              className="flex-1 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
            />
            <button
              type="button"
              onClick={addCustomLocation}
              className="rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-slate-100 cursor-pointer"
            >
              + Add
            </button>
          </div>
          {errors.preferred_locations && (
            <p className="mt-1.5 text-[11px] font-bold text-red-600">{errors.preferred_locations}</p>
          )}
        </div>

        {/* Expected Package & Relocation */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Expected Package */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              Expected Package Band *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <select
                value={preferences.expected_package}
                onChange={(e) => onChange({ ...preferences, expected_package: e.target.value })}
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.expected_package ? "border-red-500 bg-red-50" : "border-black"
                }`}
              >
                <option value="">Select Expected Package...</option>
                {PACKAGE_OPTIONS.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
            </div>
            {errors.expected_package && (
              <p className="mt-1 text-[11px] font-bold text-red-600">{errors.expected_package}</p>
            )}
          </div>

          {/* Willing To Relocate */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              Willing to Relocate? *
            </label>
            <div className="flex h-10 items-center gap-4 rounded-lg border-2 border-black bg-white px-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relocate"
                  checked={preferences.willing_to_relocate === true}
                  onChange={() => onChange({ ...preferences, willing_to_relocate: true })}
                  className="h-4 w-4 accent-black"
                />
                <span className="font-heading text-xs font-black uppercase text-black">
                  Yes, Anywhere
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relocate"
                  checked={preferences.willing_to_relocate === false}
                  onChange={() => onChange({ ...preferences, willing_to_relocate: false })}
                  className="h-4 w-4 accent-black"
                />
                <span className="font-heading text-xs font-black uppercase text-slate-700">
                  No, Preferred Cities Only
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
