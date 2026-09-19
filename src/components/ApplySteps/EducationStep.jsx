import React from "react";
import { Plus, Trash2, School } from "lucide-react";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

function EduRow({ row, index, onChange, onRemove }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5" /> University Name *
          </label>
          <input
            className={inputCls}
            placeholder="State University"
            value={row.universityName}
            onChange={(e) => onChange(index, "universityName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Degree *</label>
          <input
            className={inputCls}
            placeholder="Bachelor of Science"
            value={row.degree}
            onChange={(e) => onChange(index, "degree", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Major *</label>
          <input
            className={inputCls}
            placeholder="Computer Science"
            value={row.major}
            onChange={(e) => onChange(index, "major", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Start Year</label>
          <input
            type="number"
            min={1900}
            max={2100}
            className={inputCls}
            placeholder="2016"
            value={row.startYear}
            onChange={(e) => onChange(index, "startYear", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Graduation Year</label>
          <input
            type="number"
            min={1900}
            max={2100}
            className={inputCls}
            placeholder="2020"
            value={row.graduationYear}
            onChange={(e) => onChange(index, "graduationYear", e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}

export default function EducationStep({ rows, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Add your education history. You can skip this section if you have none.
      </p>
      {rows.map((row, index) => (
        <EduRow
          key={index}
          row={row}
          index={index}
          onChange={onChange}
          onRemove={() => onRemove(index)}
        />
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}