import React, { useState, useRef } from "react";
import type { StudentLinks, ResumeData } from "@/types/studentProfile";
import { uploadResumeToSupabase } from "@/lib/profileApi";
import { useAuth } from "@/context/AuthContext";
import {
  Globe,
  Code2,
  Terminal,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { toast } from "sonner";

interface StepProps {
  links: StudentLinks;
  resume: ResumeData | null;
  onLinksChange: (updated: Partial<StudentLinks>) => void;
  onResumeChange: (resume: ResumeData | null) => void;
  errors: Record<string, string>;
}

export const ProfessionalLinksStep: React.FC<StepProps> = ({
  links,
  resume,
  onLinksChange,
  onResumeChange,
  errors,
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Invalid file format. Please upload a PDF file only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit. Please upload a smaller PDF.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadResumeToSupabase(user?.id || "demo-student", file);
      onResumeChange(uploaded);
      toast.success("Resume PDF uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-200 pb-4">
        <h2 className="font-heading text-xl font-black text-black">Step 2: Professional Profiles & Resume</h2>
        <p className="mt-1 text-xs font-bold text-slate-700">
          Provide your coding profiles, professional presence, and upload your verified PDF resume for recruiter screening.
        </p>
      </div>

      {/* Resume Upload Section */}
      <div className="rounded-xl border-2 border-black bg-slate-50 p-5 shadow-neo-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 stroke-[2.5] text-neo-pink" />
            Resume Upload (PDF Only) *
          </label>
          <span className="rounded border border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
            Max 10MB
          </span>
        </div>

        {resume ? (
          <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-4 shadow-neo-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-neo-pink text-black">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-sm font-black text-black truncate max-w-[200px] sm:max-w-xs">
                  {resume.file_name}
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500">
                  <span>{formatFileSize(resume.file_size)}</span>
                  <span>•</span>
                  <span className="text-green-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3 w-3" /> Ready for Recruiters
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resume.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-bold text-black shadow-neo-sm hover:bg-slate-50 transition-all"
              >
                <span>View</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => onResumeChange(null)}
                className="inline-flex items-center justify-center rounded-md border-2 border-black bg-neo-red px-2.5 py-1.5 text-black shadow-neo-sm hover:opacity-90 transition-all cursor-pointer"
                title="Remove resume"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-black bg-neo-yellow/20"
                : "border-slate-400 bg-white hover:border-black hover:bg-slate-100/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
                <p className="font-heading text-xs font-bold text-black">Uploading Resume PDF...</p>
              </div>
            ) : (
              <>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black shadow-neo-sm">
                  <UploadCloud className="h-6 w-6 stroke-[2.5]" />
                </div>
                <p className="font-heading text-sm font-black text-black">
                  Click to upload or drag & drop resume PDF
                </p>
                <p className="mt-1 font-mono text-[11px] font-bold text-slate-500">
                  Accepted format: .PDF only (ATS-friendly single or 2-page format recommended)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Professional Profile Links */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-black uppercase tracking-wider text-slate-800">
          Competitive Coding & Professional Links
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GitHub */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              GitHub Profile *
            </label>
            <div className="relative">
              <GithubIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
              <input
                type="url"
                value={links.github_url}
                onChange={(e) => onLinksChange({ github_url: e.target.value })}
                placeholder="https://github.com/username"
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.github_url ? "border-red-500 bg-red-50/50" : "border-black"
                }`}
              />
            </div>
            {errors.github_url && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.github_url}</p>}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              LinkedIn Profile *
            </label>
            <div className="relative">
              <LinkedinIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
              <input
                type="url"
                value={links.linkedin_url}
                onChange={(e) => onLinksChange({ linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.linkedin_url ? "border-red-500 bg-red-50/50" : "border-black"
                }`}
              />
            </div>
            {errors.linkedin_url && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.linkedin_url}</p>}
          </div>

          {/* Portfolio */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              Personal Portfolio Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
              <input
                type="url"
                value={links.portfolio_url}
                onChange={(e) => onLinksChange({ portfolio_url: e.target.value })}
                placeholder="https://yourname.dev"
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.portfolio_url ? "border-red-500 bg-red-50/50" : "border-black"
                }`}
              />
            </div>
            {errors.portfolio_url && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.portfolio_url}</p>}
          </div>

          {/* LeetCode */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              LeetCode Profile
            </label>
            <div className="relative">
              <Code2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
              <input
                type="url"
                value={links.leetcode_url}
                onChange={(e) => onLinksChange({ leetcode_url: e.target.value })}
                placeholder="https://leetcode.com/u/username"
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.leetcode_url ? "border-red-500 bg-red-50/50" : "border-black"
                }`}
              />
            </div>
            {errors.leetcode_url && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.leetcode_url}</p>}
          </div>

          {/* HackerRank */}
          <div className="sm:col-span-2">
            <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
              HackerRank Profile
            </label>
            <div className="relative">
              <Terminal className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
              <input
                type="url"
                value={links.hackerrank_url}
                onChange={(e) => onLinksChange({ hackerrank_url: e.target.value })}
                placeholder="https://hackerrank.com/profile/username"
                className={`w-full rounded-lg border-2 bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow ${
                  errors.hackerrank_url ? "border-red-500 bg-red-50/50" : "border-black"
                }`}
              />
            </div>
            {errors.hackerrank_url && <p className="mt-1 text-[11px] font-bold text-red-600">{errors.hackerrank_url}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
