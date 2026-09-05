import React, { useState } from "react";
import type { StudentSkill } from "@/types/studentProfile";
import { SKILL_CATEGORIES } from "@/types/studentProfile";
import { Sparkles, Check, Plus, Trash2, Sliders } from "lucide-react";

interface StepProps {
  skills: StudentSkill[];
  onChange: (skills: StudentSkill[]) => void;
  errors: Record<string, string>;
}

const PROFICIENCY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "1/10 - Beginner (Basics)", color: "bg-slate-200 text-slate-800" },
  2: { label: "2/10 - Beginner (Syntax)", color: "bg-slate-200 text-slate-800" },
  3: { label: "3/10 - Familiar (Academic)", color: "bg-blue-100 text-blue-800" },
  4: { label: "4/10 - Intermediate (Mini-projects)", color: "bg-blue-100 text-blue-800" },
  5: { label: "5/10 - Competent (Problem Solver)", color: "bg-neo-cyan/30 text-sky-900" },
  6: { label: "6/10 - Competent (Full Projects)", color: "bg-neo-cyan/30 text-sky-900" },
  7: { label: "7/10 - Advanced (Industry Ready)", color: "bg-neo-green/30 text-emerald-900" },
  8: { label: "8/10 - Advanced (Optimized)", color: "bg-neo-green/30 text-emerald-900" },
  9: { label: "9/10 - Expert (Production Architect)", color: "bg-neo-purple/30 text-purple-950" },
  10: { label: "10/10 - Master (System Designer)", color: "bg-neo-yellow text-black" },
};

export const TechnicalSkillsStep: React.FC<StepProps> = ({ skills, onChange, errors }) => {
  const [activeCategory, setActiveCategory] = useState<string>("Programming Languages");
  const [customSkill, setCustomSkill] = useState("");

  const isSkillSelected = (name: string) => {
    return skills.some((s) => s.skill_name.toLowerCase() === name.toLowerCase());
  };

  const toggleSkill = (category: string, skillName: string) => {
    if (isSkillSelected(skillName)) {
      onChange(skills.filter((s) => s.skill_name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      onChange([
        ...skills,
        {
          category,
          skill_name: skillName,
          proficiency: 7, // Default to a good baseline
        },
      ]);
    }
  };

  const handleProficiencyChange = (skillName: string, proficiency: number) => {
    onChange(
      skills.map((s) => (s.skill_name === skillName ? { ...s, proficiency } : s))
    );
  };

  const removeSkill = (skillName: string) => {
    onChange(skills.filter((s) => s.skill_name !== skillName));
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    if (isSkillSelected(trimmed)) {
      setCustomSkill("");
      return;
    }
    onChange([
      ...skills,
      {
        category: activeCategory,
        skill_name: trimmed,
        proficiency: 6,
      },
    ]);
    setCustomSkill("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-200 pb-4">
        <h2 className="font-heading text-xl font-black text-black">Step 3: Categorized Technical Skills</h2>
        <p className="mt-1 text-xs font-bold text-slate-700">
          Select your tech stack across verified categories and calibrate your proficiency score (1–10) for recruiter screening.
        </p>
      </div>

      {errors.skills && (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-3 font-mono text-xs font-bold text-red-700">
          {errors.skills}
        </div>
      )}

      {/* Category Tabs */}
      <div>
        <div className="flex flex-wrap gap-1.5 pb-2">
          {Object.keys(SKILL_CATEGORIES).map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 font-heading text-xs font-black uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-neo-yellow text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-mono text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Skill Pills for Active Category */}
        <div className="mt-3 rounded-xl border-2 border-black bg-white p-4 shadow-neo-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-black uppercase text-slate-600">
              {activeCategory} — Click to Select / Deselect
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-500">
              {skills.length} skills selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES[activeCategory]?.map((skillName) => {
              const selected = isSkillSelected(skillName);
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => toggleSkill(activeCategory, skillName)}
                  className={`flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-2 font-heading text-xs font-black transition-all cursor-pointer ${
                    selected
                      ? "bg-neo-green text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                      : "bg-slate-50 text-slate-800 hover:bg-neo-yellow/30 hover:shadow-neo-sm"
                  }`}
                >
                  {selected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>{skillName}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom skill to category */}
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder={`Add another skill to ${activeCategory}...`}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSkill();
                }
              }}
              className="flex-1 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="rounded-lg border-2 border-black bg-white px-3 py-1.5 font-heading text-xs font-black uppercase shadow-neo-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Selected Skills & Proficiency Sliders */}
      <div className="rounded-xl border-2 border-black bg-slate-50 p-5 shadow-neo-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 stroke-[2.5] text-black" />
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-black">
              Calibrate Proficiency (1 - 10)
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-slate-600">
            {skills.length === 0 ? "No skills chosen yet" : `${skills.length} Selected`}
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-8 text-center">
            <Sparkles className="h-8 w-8 text-slate-400 mb-2" />
            <p className="font-heading text-xs font-bold text-slate-600">
              Click any skill badges above to add them to your profile
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => {
              const profMeta = PROFICIENCY_LABELS[skill.proficiency] || PROFICIENCY_LABELS[5];
              return (
                <div
                  key={skill.skill_name}
                  className="rounded-lg border-2 border-black bg-white p-3 shadow-neo-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-black text-black">
                        {skill.skill_name}
                      </span>
                      <span className="rounded border border-black bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                        {skill.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`rounded-md border border-black px-2 py-0.5 font-mono text-[11px] font-black ${profMeta.color}`}>
                        {profMeta.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.skill_name)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-black text-slate-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={skill.proficiency}
                      onChange={(e) =>
                        handleProficiencyChange(skill.skill_name, parseInt(e.target.value, 10))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-neo-yellow"
                    />
                    <span className="font-mono text-[10px] font-black text-slate-900">10</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
