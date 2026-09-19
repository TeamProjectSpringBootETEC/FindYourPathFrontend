import React, { useState } from "react";
import { X, Plus, CheckCircle2, Circle } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

function SkillChip({ skill, onToggle, onRemove }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
        skill.required
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {skill.name}
      <button
        type="button"
        onClick={onToggle}
        title={skill.required ? "Required skill" : "Optional skill"}
        className={skill.required ? "text-blue-500 hover:text-blue-700" : "text-slate-400 hover:text-slate-600"}
      >
        {skill.required ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-rose-500 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function SkillEditor({ label, value, onChange, placeholder = "Add a skill and press Enter" }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const name = input.trim();
    if (!name || value.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...value, { name, required: true }]);
    setInput("");
  };

  const toggleSkill = (name) =>
    onChange(
      value.map((s) =>
        s.name === name ? { ...s, required: !s.required } : s
      )
    );

  const removeSkill = (name) => onChange(value.filter((s) => s.name !== name));

  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          className={inputClass}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addSkill}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((skill) => (
            <SkillChip
              key={skill.name}
              skill={skill}
              onToggle={() => toggleSkill(skill.name)}
              onRemove={() => removeSkill(skill.name)}
            />
          ))}
        </div>
      )}
      <p className="text-[11px] text-slate-400 mt-1.5">
        Click the check icon to switch a skill between <span className="text-blue-600 font-semibold">Required</span> and{" "}
        <span className="text-slate-500 font-semibold">Optional</span>.
      </p>
    </div>
  );
}