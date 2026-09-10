import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "@/components/Dashboards/header/Sidebar";
import Home from "../pages/Home";

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
        <Route path="users" element={<h1 className="text-2xl font-bold">User Directory Page</h1>} />
        <Route path="companies" element={<h1 className="text-2xl font-bold">Admin Companies Page</h1>} />
        <Route path="universities" element={<h1 className="text-2xl font-bold">Admin Universities Page</h1>} />
        <Route path="jobs" element={<h1 className="text-2xl font-bold">Admin Jobs Page</h1>} />
        <Route path="events" element={<h1 className="text-2xl font-bold">Admin Events</h1>} />
        <Route path="scholarships" element={<h1 className="text-2xl font-bold">Admin Scholarships Page</h1>} />
        <Route path="applications" element={<h1 className="text-2xl font-bold">Applications Page</h1>} />
        <Route path="settings" element={<h1 className="text-2xl font-bold">Settings Page</h1>} />
        <Route path="notifications" element={<h1 className="text-2xl font-bold">Notifications Page</h1>} />
      </Route>
    </Routes>
  );
}

export default RouteApp;