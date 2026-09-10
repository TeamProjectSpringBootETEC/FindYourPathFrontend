import React from "react";
import { NavLink } from "react-router-dom";
import {
  Briefcase,
  LayoutGrid,
  Users,
  Building2,
  GraduationCap,
  BriefcaseIcon,
  Award,
  FileText,
  Settings,
  Bell,
  CalendarDays,
} from "lucide-react";

const Sidebar = () => {
  const mainNavItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutGrid, end: true },
    { name: "Users", path: "/dashboard/users", icon: Users },
    { name: "Companies", path: "/dashboard/companies", icon: Building2 },
    {
      name: "Universities",
      path: "/dashboard/universities",
      icon: GraduationCap,
    },
    { name: "Jobs", path: "/dashboard/jobs", icon: BriefcaseIcon },
    { name: "Job categories", path: "/dashboard/categories", icon: BriefcaseIcon },
    { name: "Events", path: "/dashboard/events", icon: CalendarDays },
    { name: "Scholarships", path: "/dashboard/scholarships", icon: Award },
    { name: "Applications", path: "/dashboard/applications", icon: FileText },
  ];

  const footerNavItems = [
    { name: "Setting", path: "/dashboard/settings", icon: Settings },
    { name: "Notification", path: "/dashboard/notifications", icon: Bell },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between p-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 px-3 py-2 mb-6">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200">
            <Briefcase size={22} />
          </div>
          <div>
            <h1 className="font-bold text-indigo-900 leading-tight text-2xl">
              Management
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Enterprise Management
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
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
                      className={
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-4 border-t border-slate-200 space-y-1">
        {footerNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
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
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
