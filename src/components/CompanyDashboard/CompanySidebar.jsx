import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Building2,
  Briefcase,
  Users,
  CalendarDays,
  Tags,
  X,
} from "lucide-react";

const mainNavItems = [
  { name: "Overview", path: "/company-dashboard", icon: LayoutGrid, end: true },
  { name: "Company Profile", path: "/company-dashboard/profile", icon: Building2 },
  { name: "Jobs", path: "/company-dashboard/jobs", icon: Briefcase },
  { name: "Applicants", path: "/company-dashboard/applicants", icon: Users },
  { name: "Events", path: "/company-dashboard/events", icon: CalendarDays },
  { name: "Categories", path: "/company-dashboard/categories", icon: Tags },
];

function SidebarNavLink({ item, onClose }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={18}
            className={isActive ? "text-indigo-600" : "text-slate-400"}
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

export default function CompanySidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-[#F8FAFC] border-r border-slate-200 flex flex-col p-4 overflow-y-auto transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CompanySidebarContent onClose={onClose} />
      </aside>
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-[#F8FAFC] border-r border-slate-200 flex-col p-4 shrink-0 overflow-y-auto">
        <CompanySidebarContent />
      </aside>
    </>
  );
}

function CompanySidebarContent({ onClose }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200 shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="font-bold text-indigo-900 leading-tight text-xl tracking-tight">
              Employer
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Company Portal
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="space-y-1 mt-6">
        {mainNavItems.map((item) => (
          <SidebarNavLink
            key={item.path}
            item={item}
            onClose={onClose}
          />
        ))}
      </nav>

      <footer className="pt-3 border-t border-slate-200 space-y-1 mt-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            E
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-700 text-sm truncate">
              Employer Portal
            </p>
            <p className="text-[11px] text-slate-400">Company role</p>
          </div>
        </div>
      </footer>
    </>
  );
}