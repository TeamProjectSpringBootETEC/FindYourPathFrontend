import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, Loader2, Inbox, FileDown } from "lucide-react";
import { useCompany } from "../CompanyLayout";
import NoCompanyNotice from "../NoCompanyNotice";
import { getJobsByCompanyId } from "@/service/JobApi";
import { getApplicationsByJob } from "@/service/applicationApi";
import { applicationBadge, formatDate } from "../helpers";
import CandidateDetailModal from "./CandidateDetailModal";

export default function ApplicantList() {
  const { companyId, company } = useCompany();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!companyId) {
      setJobs([]);
      setSelectedJobId("");
      setLoadingJobs(false);
      return;
    }
    setLoadingJobs(true);
    getJobsByCompanyId(companyId)
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false));
  }, [companyId]);

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (jobId) setSelectedJobId(jobId);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      return;
    }
    setLoadingApps(true);
    setSearchParams({ job: selectedJobId }, { replace: true });
    getApplicationsByJob(selectedJobId)
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]))
      .finally(() => setLoadingApps(false));
  }, [selectedJobId, setSearchParams]);

  const selectedJob = useMemo(
    () => jobs.find((j) => String(j.id) === String(selectedJobId)),
    [jobs, selectedJobId]
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applicant Tracking</h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage candidates applying to {company?.companyName || "your"} jobs.
        </p>
      </div>

      {!companyId && <NoCompanyNotice />}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Select a Job
            </label>
            {loadingJobs ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs...
              </div>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="">Choose a job to view applicants</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} {j.status === "closed" ? "(Closed)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedJob && (
            <div className="pt-6">
              <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">{selectedJob.title}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs">{applications.length} applicant{applications.length !== 1 ? "s" : ""}</span>
              </span>
            </div>
          )}
        </div>

        {!selectedJobId ? (
          <div className="py-16 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Select a job to view applicants</p>
            <p className="text-xs text-slate-400 mt-1">
              Pick a job from the dropdown above to see who has applied.
            </p>
          </div>
        ) : loadingApps ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading applicants...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No applicants yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Once candidates apply to this job, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">GPA</th>
                  <th className="py-3 px-6">Applied Date</th>
                  <th className="py-3 px-6">CV</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {(app.studentName || "?").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{app.studentName || "Unknown"}</p>
                          <p className="text-xs text-slate-400">{app.studentEmail || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs font-medium">
                      {app.studentGpa != null ? Number(app.studentGpa).toFixed(2) : "—"}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="py-3.5 px-6">
                      {app.cvUrl ? (
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                          title="Download CV"
                        >
                          <FileDown className="w-3.5 h-3.5" /> CV
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${applicationBadge(app.status)}`}
                      >
                        {app.status || "pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedApp && (
        <CandidateDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdated={(newApp) => {
            setSelectedApp(newApp);
            setApplications((prev) =>
              prev.map((a) => (a.id === newApp.id ? newApp : a))
            );
          }}
        />
      )}
    </div>
  );
}