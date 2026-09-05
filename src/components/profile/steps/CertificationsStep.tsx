import React from "react";
import type { StudentCertification } from "@/types/studentProfile";
import { Award, Plus, Trash2, Building, Calendar, LinkIcon } from "lucide-react";

interface StepProps {
  certifications: StudentCertification[];
  onChange: (certifications: StudentCertification[]) => void;
  errors: Record<string, string>;
}

export const CertificationsStep: React.FC<StepProps> = ({ certifications, onChange, errors }) => {
  const addCertification = () => {
    onChange([
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        name: "",
        organization: "",
        year: new Date().getFullYear().toString(),
        credential_url: "",
      },
    ]);
  };

  const updateCertification = (index: number, updated: Partial<StudentCertification>) => {
    const next = [...certifications];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-black text-black">Step 5: Professional Certifications</h2>
          <p className="mt-1 text-xs font-bold text-slate-700">
            Add recognized certifications (AWS, Azure, Coursera, NPTEL, Cisco, Google, etc.) to validate your skill claims.
          </p>
        </div>
        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border-2 border-black bg-neo-yellow px-3 py-2 font-heading text-xs font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Certification
        </button>
      </div>

      {errors.certifications && (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-3 font-mono text-xs font-bold text-red-700">
          {errors.certifications}
        </div>
      )}

      {certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-black shadow-neo-sm">
            <Award className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="font-heading text-sm font-black text-black">No certifications added</h3>
          <p className="mt-1 max-w-sm text-xs font-bold text-slate-600">
            Include certificates from AWS, Google Cloud, Oracle, NPTEL, or Hackathons to stand out to enterprise recruiters.
          </p>
          <button
            type="button"
            onClick={addCertification}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-yellow px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-yellow-300"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Add First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id || idx}
              className="relative rounded-xl border-3 border-black bg-white p-5 shadow-neo flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 mb-3">
                  <span className="rounded border border-black bg-neo-green px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black">
                    Cert #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeCertification(idx)}
                    className="text-xs font-mono font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Certificate Name */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      Certificate Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cert.name}
                      onChange={(e) => updateCertification(idx, { name: e.target.value })}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                    />
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      Issuing Organization *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={cert.organization}
                        onChange={(e) => updateCertification(idx, { organization: e.target.value })}
                        placeholder="e.g. Amazon Web Services, NPTEL, Coursera"
                        className="w-full rounded-lg border-2 border-black bg-white py-1.5 pl-8 pr-3 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      Year Issued *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={cert.year}
                        onChange={(e) => updateCertification(idx, { year: e.target.value })}
                        placeholder="2025"
                        className="w-full rounded-lg border-2 border-black bg-white py-1.5 pl-8 pr-3 text-xs font-mono font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                      />
                    </div>
                  </div>

                  {/* Credential URL */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      Verification / Credential URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="url"
                        value={cert.credential_url}
                        onChange={(e) => updateCertification(idx, { credential_url: e.target.value })}
                        placeholder="https://credly.com/badges/..."
                        className="w-full rounded-lg border-2 border-black bg-white py-1.5 pl-8 pr-3 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
