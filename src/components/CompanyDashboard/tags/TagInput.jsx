import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

export default function TagInput({ label, value, onChange, placeholder = "Type and press Enter" }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

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
              addTag();
            }
          }}
          className={inputClass}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-semibold"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-indigo-400 hover:text-rose-500 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}