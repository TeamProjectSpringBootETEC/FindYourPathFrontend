import React, { useState } from "react";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "@/components/Dashboards/header/Sidebar";
import Home from "../pages/Home";
import Overview from "@/components/Dashboards/contants/Overview";
import CategoryJob from "@/components/Dashboards/contants/CategoryJob";
import Company from "@/components/Dashboards/contants/Company";
import Users from "@/components/Dashboards/contants/Users";
import Jobs from "@/components/Dashboards/contants/Jobs";
import Events from "@/components/Dashboards/contants/Events";
import Scholarships from "@/components/Dashboards/contants/Scholarships";
import Universities from "@/components/Dashboards/contants/Universities";
import Applications from "@/components/Dashboards/contants/Applications";
import Reports from "@/components/Dashboards/contants/Reports";
import Notifications from "@/components/Dashboards/contants/Notifications";
import Settings from "@/components/Dashboards/contants/Settings";
import { Menu } from "lucide-react";

// Layout for Public Pages (with Navbar)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

// Layout for Dashboard Pages (with Sidebar)
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile sidebar whenever the route changes
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <BriefcaseIconSm />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Management
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

const BriefcaseIconSm = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

function RouteApp() {
  return (
    <Routes>
      {/* Public Pages -> Shows Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/job" element={<h1 className="p-4 text-2xl font-bold">Job Page</h1>} />
        <Route path="/scholarships" element={<h1 className="p-4 text-2xl font-bold">Scholarships Page</h1>} />
        <Route path="/events" element={<h1 className="p-4 text-2xl font-bold">Events Page</h1>} />
        <Route path="/companies" element={<h1 className="p-4 text-2xl font-bold">Companies Page</h1>} />
        <Route path="/universities" element={<h1 className="p-4 text-2xl font-bold">Universities Page</h1>} />
        <Route path="/about" element={<h1 className="p-4 text-2xl font-bold">About Us Page</h1>} />
      </Route>

      {/* Dashboard Pages -> Shows Sidebar (No Navbar) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="users" element={<Users/>} />
        <Route path="companies" element={<Company/>} />
        <Route path="universities" element={<Universities/>} />
        <Route path="jobs" element={<Jobs/>} />
        <Route path="categories" element={<CategoryJob/>} />
        <Route path="events" element={<Events/>} />
        <Route path="scholarships" element={<Scholarships/>} />
        <Route path="applications" element={<Applications/>} />
        <Route path="reports" element={<Reports/>} />
        <Route path="settings" element={<Settings/>} />
        <Route path="notifications" element={<Notifications/>} />
      </Route>
    </Routes>
  );
}

export default RouteApp;