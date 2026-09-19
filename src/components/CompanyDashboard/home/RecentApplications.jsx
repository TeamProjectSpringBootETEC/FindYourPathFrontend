import { Link } from "react-router-dom";
import { FileText, ArrowRight, Inbox } from "lucide-react";
import { applicationBadge, formatDate } from "../helpers";

export default function RecentApplications({ applications, companyName }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Latest candidates for {companyName || "your jobs"}
          </p>
        </div>
        <Link
          to="/company-dashboard/applicants"
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="py-14 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">No applications yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Once candidates apply to your jobs, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Candidate</th>
                <th className="py-3 px-6">Applied Job</th>
                <th className="py-3 px-6">Applied Date</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {(app.studentName || "?").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {app.studentName || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400">{app.studentEmail || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {app.jobTitle || "—"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 text-xs">
                    {formatDate(app.appliedAt)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${applicationBadge(app.status)}`}
                    >
                      {app.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}