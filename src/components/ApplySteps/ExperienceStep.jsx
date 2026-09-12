import React from "react";
import { Plus, Trash2, Building2, Briefcase, Calendar } from "lucide-react";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

function ExpRow({ row, index, onChange, onRemove }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Company Name *
          </label>
          <input
            className={inputCls}
            placeholder="Acme Inc."
            value={row.companyName}
            onChange={(e) => onChange(index, "companyName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Position *
          </label>
          <input
            className={inputCls}
            placeholder="Software Engineer"
            value={row.position}
            onChange={(e) => onChange(index, "position", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Start Date
          </label>
          <input
            type="date"
            className={inputCls}
            value={row.startDate}
            onChange={(e) => onChange(index, "startDate", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> End Date
          </label>
          <input
            type="date"
            className={inputCls}
            value={row.endDate}
            onChange={(e) => onChange(index, "endDate", e.target.value)}
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

export default function ExperienceStep({ rows, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Add your past work experience. You can skip this section if you have none.
      </p>
      {rows.map((row, index) => (
        <ExpRow
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
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}