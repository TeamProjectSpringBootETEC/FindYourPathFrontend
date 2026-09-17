import React, { useState } from "react";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "@/pages/Footer";
import Sidebar from "@/components/Dashboards/header/Sidebar";
import Home from "../pages/Home";
import Overview from "@/components/Dashboards/contants/Overview";
import CategoryJob from "@/components/Dashboards/contants/CategoryJob";
import Job from "@/pages/Job";
import JobDetail from "@/pages/detail/JobDetail";
import Events from "@/pages/Events";
import EventDetail from "@/pages/detail/EventDetail";
import AdminEvents from "@/components/Dashboards/contants/Events";
import ApplyJob from "@/pages/ApplyJob";
import ApplySuccess from "@/pages/ApplySuccess";
import StudentDashboard from "@/pages/StudentDashboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Company from "@/components/Dashboards/contants/Company";
import Users from "@/components/Dashboards/contants/Users";
import Jobs from "@/components/Dashboards/contants/Jobs";
import AboutUs from "@/pages/AboutUs";
import Scholarships from "@/components/Dashboards/contants/Scholarships";
import Applications from "@/components/Dashboards/contants/Applications";
import Reports from "@/components/Dashboards/contants/Reports";
import Notifications from "@/components/Dashboards/contants/Notifications";
import Settings from "@/components/Dashboards/contants/Settings";
import CompanyLayout from "@/components/CompanyDashboard/CompanyLayout";
import HomeDashboard from "@/components/CompanyDashboard/home/HomeDashboard";
import CompanyProfile from "@/components/CompanyDashboard/profile/CompanyProfile";
import JobList from "@/components/CompanyDashboard/jobs/JobList";
import ApplicantList from "@/components/CompanyDashboard/applicants/ApplicantList";
import EventList from "@/components/CompanyDashboard/events/EventList";
import { Menu } from "lucide-react"; 
import RequireRole from "@/components/RequireRole"; 

// Layout for Public Pages (with Navbar)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
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
        <Route path="/job" element={<Job/>} />
        <Route path="/detail/:id" element={<JobDetail />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/apply-success" element={<ApplySuccess />} />
        <Route path="/events" element={<Events/>} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/companies" element={<h1 className="p-4 text-2xl font-bold">Companies Page</h1>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/profile" element={<StudentDashboard />} />
      </Route>

      {/* Auth Pages -> No Navbar / Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Pages -> Shows Sidebar (No Navbar) */}
      <Route path="/dashboard" element={<RequireRole roleId={1}><DashboardLayout /></RequireRole>}>
        <Route index element={<Overview />} />
        <Route path="users" element={<Users/>} />
        <Route path="companies" element={<Company/>} />
        <Route path="jobs" element={<Jobs/>} />
        <Route path="categories" element={<CategoryJob/>} />
        <Route path="events" element={<AdminEvents/>} />
        <Route path="scholarships" element={<Scholarships/>} />
        <Route path="applications" element={<Applications/>} />
        <Route path="reports" element={<Reports/>} />
        <Route path="settings" element={<Settings/>} />
        <Route path="notifications" element={<Notifications/>} />
      </Route>

      {/* Company (Employer) Dashboard -> Shows Company Sidebar */}
      <Route path="/company-dashboard" element={<RequireRole roleId={2}><CompanyLayout /></RequireRole>}>
        <Route index element={<HomeDashboard />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="applicants" element={<ApplicantList />} />
        <Route path="events" element={<EventList />} />
        <Route path="categories" element={<CategoryJob />} />
      </Route>
    </Routes>
  );
}

export default RouteApp;