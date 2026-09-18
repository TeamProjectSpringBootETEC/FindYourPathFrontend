import React from "react";
import { GraduationCap, Briefcase, School, FileText, Settings, Sparkles, Bookmark, CalendarDays } from "lucide-react";

const items = [
  { id: "personal", label: "Personal & Academic", icon: GraduationCap },
  { id: "experience", label: "Work Experiences", icon: Briefcase },
  { id: "education", label: "Education History", icon: School },
  { id: "skills", label: "My Skills", icon: Sparkles },
  { id: "applications", label: "My Applications", icon: FileText },
  { id: "saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { id: "saved-events", label: "Saved Events", icon: CalendarDays },
  { id: "account", label: "Account Settings", icon: Settings },
];

export default function StudentSidebar({ active, onSelect }) {
  return (
    <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-500"}`} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}