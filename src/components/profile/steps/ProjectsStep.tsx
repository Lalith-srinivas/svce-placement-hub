import React, { useState } from "react";
import type { StudentProject } from "@/types/studentProfile";
import { FolderGit2, Plus, Trash2, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

interface StepProps {
  projects: StudentProject[];
  onChange: (projects: StudentProject[]) => void;
  errors: Record<string, string>;
}

export const ProjectsStep: React.FC<StepProps> = ({ projects, onChange, errors }) => {
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const addProject = () => {
    onChange([
      ...projects,
      {
        id: `proj-${Date.now()}`,
        name: "",
        description: "",
        tech_stack: [],
        github_url: "",
        demo_url: "",
      },
    ]);
  };

  const updateProject = (index: number, updated: Partial<StudentProject>) => {
    const next = [...projects];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const addTechTag = (index: number) => {
    const raw = techInput[index]?.trim();
    if (!raw) return;
    const current = projects[index].tech_stack || [];
    if (!current.includes(raw)) {
      updateProject(index, { tech_stack: [...current, raw] });
    }
    setTechInput({ ...techInput, [index]: "" });
  };

  const removeTechTag = (projIndex: number, tag: string) => {
    const current = projects[projIndex].tech_stack || [];
    updateProject(projIndex, {
      tech_stack: current.filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-black text-black">Step 4: Technical Projects (Unlimited)</h2>
          <p className="mt-1 text-xs font-bold text-slate-700">
            Showcase your best software, full stack, machine learning, or hardware projects with live URLs and GitHub repositories.
          </p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border-2 border-black bg-neo-yellow px-3 py-2 font-heading text-xs font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Project
        </button>
      </div>

      {errors.projects && (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-3 font-mono text-xs font-bold text-red-700">
          {errors.projects}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black shadow-neo-sm">
            <FolderGit2 className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="font-heading text-sm font-black text-black">No projects added yet</h3>
          <p className="mt-1 max-w-sm text-xs font-bold text-slate-600">
            Adding at least 1 or 2 portfolio projects significantly enhances your placement profile readiness for tech rounds.
          </p>
          <button
            type="button"
            onClick={addProject}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-neo-yellow px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-yellow-300"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Add First Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="relative rounded-xl border-3 border-black bg-white p-5 shadow-neo"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <span className="rounded-md border border-black bg-neo-purple px-2 py-0.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
                  Project #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="flex items-center gap-1 text-xs font-mono font-bold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>

              <div className="space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={proj.name}
                    onChange={(e) => updateProject(idx, { name: e.target.value })}
                    placeholder="e.g. Distributed Task Orchestrator"
                    className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={proj.description}
                    onChange={(e) => updateProject(idx, { description: e.target.value })}
                    placeholder="Briefly describe the objective, architecture, and impact of the project..."
                    className="w-full rounded-lg border-2 border-black bg-white p-3 text-sm font-medium text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                    Technology Stack
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {proj.tech_stack?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded border border-black bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-black shadow-neo-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTechTag(idx, tag)}
                          className="text-slate-400 hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type tech (e.g. React, PostgreSQL, Docker) and hit Enter or Add"
                      value={techInput[idx] || ""}
                      onChange={(e) => setTechInput({ ...techInput, [idx]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechTag(idx);
                        }
                      }}
                      className="flex-1 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                    />
                    <button
                      type="button"
                      onClick={() => addTechTag(idx)}
                      className="rounded-lg border-2 border-black bg-slate-100 px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-slate-200"
                    >
                      + Tag
                    </button>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      GitHub Repository Link
                    </label>
                    <div className="relative">
                      <GithubIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="url"
                        value={proj.github_url}
                        onChange={(e) => updateProject(idx, { github_url: e.target.value })}
                        placeholder="https://github.com/user/project"
                        className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-slate-800 mb-1">
                      Live Demo / Deployment Link
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="url"
                        value={proj.demo_url}
                        onChange={(e) => updateProject(idx, { demo_url: e.target.value })}
                        placeholder="https://project-demo.vercel.app"
                        className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
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
