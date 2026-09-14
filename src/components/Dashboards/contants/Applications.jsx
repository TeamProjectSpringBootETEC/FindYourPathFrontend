import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Download,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Briefcase,
  Sparkles,
} from "lucide-react";

// NOTE: The backend only exposes /api/applications via student/job id.
// This page uses realistic sample data for the design until a
// GET /api/applications endpoint is added.
const SAMPLE_APPLICATIONS = [
  { id: 1, jobTitle: "Senior Frontend Developer", company: "Nexa Systems", student: "Sophea Chan", email: "sophea.chan@gmail.com", location: "Phnom Penh", status: "REVIEWING", appliedAt: "2026-09-10", score: 87 },
  { id: 2, jobTitle: "Backend Engineer", company: "CamboTech", student: "Dara Kim", email: "dara.kim@gmail.com", location: "Phnom Penh", status: "SHORTLISTED", appliedAt: "2026-09-09", score: 92 },
  { id: 3, jobTitle: "UI/UX Designer", company: "PixelHive", student: "Sreyneang Lim", email: "sreyneang.lim@gmail.com", location: "Remote", status: "PENDING", appliedAt: "2026-09-08", score: 74 },
  { id: 4, jobTitle: "Data Analyst", company: "FinBridge", student: "Vuthy Sorn", email: "vuthy.sorn@gmail.com", location: "Phnom Penh", status: "REJECTED", appliedAt: "2026-09-07", score: 61 },
  { id: 5, jobTitle: "DevOps Engineer", company: "CloudKh", student: "Malis Phon", email: "malis.phon@gmail.com", location: "Hybrid", status: "SHORTLISTED", appliedAt: "2026-09-06", score: 90 },
  { id: 6, jobTitle: "Mobile Developer", company: "AppWorks", student: "Ratanak Sok", email: "ratanak.sok@gmail.com", location: "Phnom Penh", status: "CONVERTED", appliedAt: "2026-09-05", score: 95 },
  { id: 7, jobTitle: "Project Manager", company: "Achieve Partners", student: "Channara Oung", email: "channara.oung@gmail.com", location: "Remote", status: "REVIEWING", appliedAt: "2026-09-04", score: 81 },
  { id: 8, jobTitle: "QA Engineer", company: "Nexa Systems", student: "Leakena Sar", email: "leakena.sar@gmail.com", location: "Phnom Penh", status: "PENDING", appliedAt: "2026-09-03", score: 68 },
];

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
  REVIEWING: "bg-sky-50 text-sky-600 border border-sky-200",
  SHORTLISTED: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  CONVERTED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-600 border border-rose-200",
};

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "CONVERTED",
  "REJECTED",
];

function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [applications, setApplications] = useState(SAMPLE_APPLICATIONS);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return applications.filter((a) => {
      const matchesSearch =
        a.jobTitle.toLowerCase().includes(q) ||
        a.student.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "ALL" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const countByStatus = useMemo(() => {
    const map = {};
    applications.forEach((a) => {
      map[a.status] = (map[a.status] || 0) + 1;
    });
    return map;
  }, [applications]);

  const formatDate = (d) => {
    if (!d) return "N/A";
    const dt = new Date(d);
    return isNaN(dt)
      ? d
      : dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 md:w-12 md:h-12 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Job Applications
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Review, shortlist and convert candidates
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUS_OPTIONS.slice(1).map((s) => {
          const count = countByStatus[s] || 0;
          const icon =
            s === "CONVERTED" ? (
              <CheckCircle2 size={16} />
            ) : s === "REJECTED" ? (
              <XCircle size={16} />
            ) : s === "REVIEWING" ? (
              <Search size={16} />
            ) : s === "SHORTLISTED" ? (
              <Sparkles size={16} />
            ) : (
              <Clock size={16} />
            );
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                statusFilter === s
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-slate-200/80 bg-white hover:border-violet-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900">
                  {count}
                </span>
                {icon}
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {s}
              </p>
            </button>
          );
        })}
      </div>

      {/* Applications table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4 md:px-6">Candidate</th>
                <th className="py-4 px-4 hidden md:table-cell">Job / Company</th>
                <th className="py-4 px-4 hidden lg:table-cell">Applied</th>
                <th className="py-4 px-4">Match Score</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {a.student.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {a.student}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail size={10} />
                            {a.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="font-medium text-slate-800 text-sm">
                        {a.jobTitle}
                      </p>
                      <span className="text-xs text-slate-400 inline-flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} />
                        {a.company} · <MapPin size={10} /> {a.location}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500">
                      {formatDate(a.appliedAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              a.score >= 85
                                ? "bg-emerald-500"
                                : a.score >= 70
                                ? "bg-amber-500"
                                : "bg-rose-400"
                            }`}
                            style={{ width: `${Math.min(a.score, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {a.score}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert("Status update coming soon")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg text-xs font-semibold transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-sky-50 border border-sky-200 text-sky-700 rounded-2xl p-4 text-xs font-medium flex items-start gap-3">
        <Loader2 className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" />
        <p>
          This page currently displays sample data. The backend exposes
          applications only per student or job (<code>/api/applications/student/{"{id}"}</code>).
          Add a <code>GET /api/applications</code> endpoint to list all applications.
        </p>
      </div>
    </div>
  );
}

export default Applications;