import React from "react";
import { NavLink } from "react-router-dom";
import {
  Briefcase,
  LayoutGrid,
  Users,
  Building2,
  GraduationCap,
  BriefcaseIcon,
  FolderTree,
  Award,
  FileText,
  Settings,
  Bell,
  CalendarDays,
  BarChart3,
  X,
} from "lucide-react";

const mainNavItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutGrid, end: true },
  { name: "Users", path: "/dashboard/users", icon: Users },
  { name: "Companies", path: "/dashboard/companies", icon: Building2 },
  { name: "Jobs", path: "/dashboard/jobs", icon: BriefcaseIcon },
  { name: "Job categories", path: "/dashboard/categories", icon: FolderTree },
  { name: "Events", path: "/dashboard/events", icon: CalendarDays },
  { name: "Applications", path: "/dashboard/applications", icon: FileText },
  { name: "Report & Analytics", path: "/dashboard/reports", icon: BarChart3 },
];

const footerNavItems = [
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
  { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
];

const SidebarNavLink = ({ item, onClose }) => {
  const Icon = item.icon;
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
          <Icon
            size={18}
            className={isActive ? "text-indigo-600" : "text-slate-400"}
          />
          {item.name}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200 shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <h1 className="font-bold text-indigo-900 leading-tight text-xl tracking-tight">
              Management
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Enterprise Suite
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-1 mt-4">
        {mainNavItems.map((item) => (
          <SidebarNavLink key={item.path} item={item} onClose={onClose} />
        ))}
      </nav>

      <footer className="pt-3 border-t border-slate-200 space-y-1 mt-auto">
        {footerNavItems.map((item) => (
          <SidebarNavLink key={item.path} item={item} onClose={onClose} />
        ))}
      </footer>
    </>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop: static sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-[#F8FAFC] border-r border-slate-200 flex-col p-4 shrink-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile/tablet: slide-in sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-[#F8FAFC] border-r border-slate-200 flex flex-col p-4 overflow-y-auto transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;