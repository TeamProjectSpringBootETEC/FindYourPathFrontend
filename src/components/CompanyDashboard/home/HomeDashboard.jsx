import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  CalendarDays,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useCompany } from "../CompanyLayout";
import RecentApplications from "./RecentApplications";
import { getAllApplications } from "@/service/applicationApi";
import { getJobsByCompanyId } from "@/service/JobApi";
import { getEventsByCompanyId } from "@/service/eventApi";

function StatCard({ icon: Icon, label, value, iconClass, to }) {
  return (
    <Link
      to={to}
      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </Link>
  );
}

export default function HomeDashboard() {
  const { company, companyId, loading } = useCompany();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [events, setEvents] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setMetaLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      try {
        const [appsData, jobsData, eventsData] = await Promise.all([
          getAllApplications().catch(() => []),
          getJobsByCompanyId(companyId).catch(() => []),
          getEventsByCompanyId(companyId).catch(() => []),
        ]);
        if (!active) return;
        setApps(Array.isArray(appsData) ? appsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } finally {
        if (active) setMetaLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [companyId]);

  const companyApps = apps.filter(
    (a) => (a.companyName || "").toLowerCase() === (company?.companyName || "").toLowerCase()
  );

  const upcomingEvents = events.filter((e) => {
    const status = String(e.status || "").toLowerCase();
    const date = e.eventDate || e.event_date || "";
    return !["closed", "cancelled"].includes(status) && date >= new Date().toISOString().slice(0, 10);
  }).length;

  const recentApps = [...companyApps]
    .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0))
    .slice(0, 5);

  const activeJobs = jobs.filter(
    (j) => String(j.status || "").toLowerCase() === "active"
  ).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{company ? `, ${company.companyName}` : ""}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with your job postings today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/company-dashboard/jobs?new=1"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
          >
            <Plus className="w-4 h-4" /> Post a New Job
          </Link>
          <Link
            to="/company-dashboard/events?new=1"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create an Event
          </Link>
        </div>
      </div>

      {loading || metaLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
          <span className="text-sm">Loading your dashboard...</span>
        </div>
      ) : !company ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Briefcase size={26} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            You haven't set up your company profile yet
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Add your company name, website, and description to start posting jobs and
            receiving applications.
          </p>
          <Link
            to="/company-dashboard/profile"
            className="inline-flex items-center gap-2 mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
          >
            Set up Company Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Briefcase}
              label="Active Jobs"
              value={activeJobs}
              iconClass="bg-indigo-50 text-indigo-600"
              to="/company-dashboard/jobs"
            />
            <StatCard
              icon={FileText}
              label="Total Applications"
              value={companyApps.length}
              iconClass="bg-emerald-50 text-emerald-600"
              to="/company-dashboard/applicants"
            />
            <StatCard
              icon={CalendarDays}
              label="Upcoming Events"
              value={upcomingEvents}
              iconClass="bg-violet-50 text-violet-600"
              to="/company-dashboard/events"
            />
          </div>

          <RecentApplications applications={recentApps} companyName={company.companyName} />
        </>
      )}
    </div>
  );
}