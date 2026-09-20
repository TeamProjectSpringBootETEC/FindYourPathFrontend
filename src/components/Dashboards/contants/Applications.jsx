import React, { useState, useEffect, useMemo } from "react";
import { getAllApplications, assessApplication } from "@/service/applicationApi";
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
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

// Data comes from the backend via GET /api/applications (applicationApi.getAllApplications).
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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assessingId, setAssessingId] = useState(null);

  const statusOf = (a) => String(a.status || "PENDING").toUpperCase();
  const displayName = (a) => a.studentName || `Student #${a.studentProfileId || ""}`;

  const handleAssess = async (app) => {
    setAssessingId(app.id);
    try {
      const res = await assessApplication(app.id);
      const updated = res?.data || res;
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, ...updated } : a))
      );
    } catch (err) {
      console.error("AI check failed:", err);
      toast.error("AI check failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAssessingId(null);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllApplications()
      .then((res) => {
        const data = res?.data || res;
        if (active && Array.isArray(data)) {
          setApplications(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return applications.filter((a) => {
      const matchesSearch =
        (a.jobTitle || "").toLowerCase().includes(q) ||
        displayName(a).toLowerCase().includes(q) ||
        (a.companyName || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "ALL" || statusOf(a) === statusFilter;
      return matchesSearch && matchesStatus;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, searchQuery, statusFilter]);

  const countByStatus = useMemo(() => {
    const map = {};
    applications.forEach((a) => {
      const s = statusOf(a);
      map[s] = (map[s] || 0) + 1;
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
                <th className="py-4 px-4">GPA</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 hidden lg:table-cell">AI Verdict</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-2" />
                    <p className="text-xs">Loading applications...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(displayName(a) || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {displayName(a)}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail size={10} />
                            {a.studentEmail || "N/A"}
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
                        {a.companyName || "N/A"} · <MapPin size={10} /> {a.location || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500">
                      {formatDate(a.appliedAt)}
                    </td>
                    <td className="py-4 px-4">
                      {a.studentGpa != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                a.studentGpa >= 3.4
                                  ? "bg-emerald-500"
                                  : a.studentGpa >= 2.8
                                  ? "bg-amber-500"
                                  : "bg-rose-400"
                              }`}
                              style={{ width: `${Math.min((a.studentGpa / 4) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {a.studentGpa}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[statusOf(a)] || STATUS_STYLES.PENDING}`}
                      >
                        {statusOf(a)}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      {a.aiScore != null ? (
                        <div className="inline-flex flex-col items-start gap-1" title={a.aiSummary || ""}>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-800">{a.aiScore}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${String(a.aiDecision).toUpperCase() === "SHORTLISTED" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                              <Sparkles size={10} className="mr-1" />
                              {String(a.aiDecision || "—").toUpperCase()}
                            </span>
                          </span>
                          {a.aiSummary && (
                            <span className="text-[11px] text-slate-400 max-w-[220px] truncate">
                              {a.aiSummary}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Not checked yet</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAssess(a)}
                          disabled={assessingId === a.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                          title="Ask AI to check match against job requirements"
                        >
                          {assessingId === a.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Sparkles size={13} />
                          )}
                          AI Check
                        </button>
                        <button
                          onClick={() => toast.success("Status update coming soon")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg text-xs font-semibold transition"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Applications;