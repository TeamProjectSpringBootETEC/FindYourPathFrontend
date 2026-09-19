import React, { useState, useEffect, useContext, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Building2 } from "lucide-react";
import CompanySidebar from "./CompanySidebar";
import { getCompanyByUserId } from "@/service/CompanyApi";

const CompanyContext = React.createContext(null);

export const useCompany = () => useContext(CompanyContext);

export default function CompanyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const refreshCompany = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) {
      setCompany(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getCompanyByUserId(user.id);
      setCompany(data || null);
    } catch {
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCompany();
  }, [refreshCompany]);

  const value = {
    company,
    companyId: company?.id ?? null,
    loading,
    refreshCompany,
    setCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      <div className="flex min-h-screen bg-slate-50">
        <CompanySidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0">
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
                <Building2 size={16} />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Employer
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              E
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </CompanyContext.Provider>
  );
}