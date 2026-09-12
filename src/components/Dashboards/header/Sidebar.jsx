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
} from "lucide-react";

const mainNavItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutGrid, end: true },
  { name: "Users", path: "/dashboard/users", icon: Users },
  { name: "Companies", path: "/dashboard/companies", icon: Building2 },
  { name: "Universities", path: "/dashboard/universities", icon: GraduationCap },
  { name: "Jobs", path: "/dashboard/jobs", icon: BriefcaseIcon },
  { name: "Job categories", path: "/dashboard/categories", icon: FolderTree },
  { name: "Events", path: "/dashboard/events", icon: CalendarDays },
  { name: "Scholarships", path: "/dashboard/scholarships", icon: Award },
  { name: "Applications", path: "/dashboard/applications", icon: FileText },
];

const footerNavItems = [
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
  { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
];

const SidebarNavLink = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.end}
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

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
      <div className="space-y-4">
        {/* Top Header */}
        <header className="flex items-center gap-2.5 px-3 py-2">
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
        </header>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <SidebarNavLink key={item.path} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <footer className="pt-3 border-t border-slate-200 space-y-1 mt-auto">
        {footerNavItems.map((item) => (
          <SidebarNavLink key={item.path} item={item} />
        ))}
      </footer>
    </aside>
  );
};

export default Sidebar;