import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Calendar, ArrowUpRight } from "lucide-react";
import { getApplicationsByStudent } from "@/service/applicationApi";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-600 ring-amber-200",
  REVIEWING: "bg-blue-50 text-blue-600 ring-blue-200",
  INTERVIEWING: "bg-violet-50 text-violet-600 ring-violet-200",
  ACCEPTED: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-600 ring-rose-200",
};
const fallbackStyle = "bg-slate-50 text-slate-600 ring-slate-200";

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

export default function ApplicationsSection({ studentProfileId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentProfileId) {
      setLoading(false);
      return;
    }
    let active = true;
    getApplicationsByStudent(studentProfileId)
      .then((data) => active && setItems(data))
      .catch(() => active && setError("Failed to load applications."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [studentProfileId]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <FileText className="h-4 w-4 text-indigo-600" /> My Applications
        </h2>
        {items.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            {items.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : items.length === 0 ? (
        <div className="py-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-200" />
          <p className="mt-3 text-sm font-medium text-slate-500">No applications yet.</p>
          <p className="text-xs text-slate-400">Browse jobs and apply to start building your history.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((app) => (
            <li
              key={app.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{app.jobTitle}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" /> Applied {fmtDate(app.appliedAt)}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${STATUS_STYLES[app.status] || fallbackStyle}`}>
                {app.status?.toLowerCase() || "Submitted"}
              </span>
              <Link
                to={`/detail/${app.jobId}`}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600"
                aria-label="View job"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}