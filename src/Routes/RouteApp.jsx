import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "@/components/Dashboards/header/Sidebar";
import Home from "../pages/Home";
import CategoryJob from "@/components/Dashboards/contants/CategoryJob";
import Company from "@/components/Dashboards/contants/Company";
import Users from "@/components/Dashboards/contants/Users";
import Jobs from "@/components/Dashboards/contants/Jobs";
import Events from "@/components/Dashboards/contants/Events";
import Scholarships from "@/components/Dashboards/contants/Scholarships";
import Universities from "@/components/Dashboards/contants/Universities";

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
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

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
        <Route index element={<h1 className="text-2xl font-bold">Overview Dashboard</h1>} />
        <Route path="users" element={<Users/>} />
        <Route path="companies" element={<Company/>} />
        <Route path="universities" element={<Universities/>} />
        <Route path="jobs" element={<Jobs/>} />
        <Route path="categories" element={<CategoryJob/>} />
        <Route path="events" element={<Events/>} />
        <Route path="scholarships" element={<Scholarships/>} />
        <Route path="applications" element={<h1 className="text-2xl font-bold">Applications Page</h1>} />
        <Route path="settings" element={<h1 className="text-2xl font-bold">Settings Page</h1>} />
        <Route path="notifications" element={<h1 className="text-2xl font-bold">Notifications Page</h1>} />
      </Route>
    </Routes>
  );
}

export default RouteApp;