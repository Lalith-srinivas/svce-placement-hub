import React from "react";
import type { StudentPersonalDetails } from "@/types/studentProfile";
import { BRANCH_OPTIONS, YEAR_OPTIONS, SECTION_OPTIONS } from "@/types/studentProfile";
import { User, Hash, Mail, Phone, GraduationCap, Calendar, Layers, Award, AlertTriangle } from "lucide-react";

interface StepProps {
  data: StudentPersonalDetails;
  onChange: (updated: Partial<StudentPersonalDetails>) => void;
  errors: Record<string, string>;
}

export const PersonalDetailsStep: React.FC<StepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-200 pb-4">
        <h2 className="font-heading text-xl font-black text-black">Step 1: Personal & Academic Details</h2>
        <p className="mt-1 text-xs font-bold text-slate-700">
          Enter your official institutional registration and contact details required by campus recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={data.full_name}
              onChange={(e) => onChange({ full_name: e.target.value })}
              placeholder="e.g. Lalith Srinivas"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.full_name ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.full_name && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.full_name}</p>}
        </div>

        {/* Register Number */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Register Number *
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={data.register_number}
              onChange={(e) => onChange({ register_number: e.target.value.toUpperCase() })}
              placeholder="e.g. 2127210501001"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-mono font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.register_number ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.register_number && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.register_number}</p>}
        </div>

        {/* College Email */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            College Email (@svce.ac.in) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={data.college_email}
              onChange={(e) => onChange({ college_email: e.target.value.toLowerCase() })}
              placeholder="student@svce.ac.in"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.college_email ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.college_email && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.college_email}</p>}
        </div>

        {/* Personal Email */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Personal Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={data.personal_email}
              onChange={(e) => onChange({ personal_email: e.target.value.toLowerCase() })}
              placeholder="personal.email@gmail.com"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.personal_email ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.personal_email && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.personal_email}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="tel"
              value={data.phone_number}
              onChange={(e) => onChange({ phone_number: e.target.value })}
              placeholder="+91 9876543210"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-mono font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.phone_number ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.phone_number && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.phone_number}</p>}
        </div>

        {/* Branch */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Department / Branch *
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
            <select
              value={data.branch}
              onChange={(e) => onChange({ branch: e.target.value })}
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.branch ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            >
              <option value="">Select Branch...</option>
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          {errors.branch && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.branch}</p>}
        </div>

        {/* Year */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Year of Study *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
            <select
              value={data.year}
              onChange={(e) => onChange({ year: e.target.value })}
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.year ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            >
              <option value="">Select Year...</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {errors.year && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.year}</p>}
        </div>

        {/* Section */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Section *
          </label>
          <div className="relative">
            <Layers className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
            <select
              value={data.section}
              onChange={(e) => onChange({ section: e.target.value })}
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.section ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            >
              <option value="">Select Section...</option>
              {SECTION_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>
          {errors.section && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.section}</p>}
        </div>

        {/* CGPA */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Current CGPA (0.00 - 10.00) *
          </label>
          <div className="relative">
            <Award className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={data.cgpa}
              onChange={(e) => onChange({ cgpa: e.target.value })}
              placeholder="e.g. 8.75"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-mono font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.cgpa ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.cgpa && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.cgpa}</p>}
        </div>

        {/* Active Backlogs */}
        <div>
          <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1.5">
            Active Backlogs Count *
          </label>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="number"
              min="0"
              max="20"
              value={data.active_backlogs}
              onChange={(e) => onChange({ active_backlogs: e.target.value })}
              placeholder="0"
              className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-mono font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                errors.active_backlogs ? "border-red-500 bg-red-50/50" : "border-black"
              }`}
            />
          </div>
          {errors.active_backlogs && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.active_backlogs}</p>}
        </div>
      </div>
    </div>
  );
};
