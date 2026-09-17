import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Loader2,
  Edit3,
  ExternalLink,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCompany } from "../CompanyLayout";
import NoCompanyNotice from "../NoCompanyNotice";
import { getJobsByCompanyId, updateJob } from "@/service/JobApi";
import JobFormModal from "./JobFormModal";
import { jobBadge, formatDate } from "../helpers";

const ROWS_OPTIONS = [5, 10, 25, 50];

export default function JobList() {
  const { companyId, company } = useCompany();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchJobs = async () => {
    if (!companyId) {
      setJobs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getJobsByCompanyId(companyId);
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingJob(null);
      setShowModal(true);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return jobs.filter((j) => {
      const title = (j.title || "").toLowerCase();
      const type = (j.jobType || j.job_type || "").toLowerCase();
      const matchesSearch = title.includes(q) || type.includes(q);
      const matchesStatus =
        statusFilter === "ALL" ||
        String(j.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleCloseJob = async (job) => {
    const newStatus =
      String(job.status || "").toLowerCase() === "closed" ? "active" : "closed";
    try {
      await updateJob(job.id, {
        companyId: job.companyId,
        jobCategoryId: job.jobCategoryId,
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        workplaceType: job.workplaceType,
        salary: job.salary,
        location: job.location,
        deadline: job.deadline,
        requirements: job.requirements,
        benefits: job.benefits,
        status: newStatus,
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to update job status:", err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Post and manage job openings for {company?.companyName || "your company"}.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowModal(true);
          }}
          disabled={!companyId}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={companyId ? "Post a job" : "Set up your company profile first"}
        >
          <Plus className="w-4 h-4" /> Post a Job
        </button>
      </div>

      {!companyId && <NoCompanyNotice />}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No jobs found</p>
            <p className="text-xs text-slate-400 mt-1">
              {jobs.length === 0
                ? "Click 'Post a Job' to create your first listing."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Job Title</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Deadline</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paged.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div>
                          <p className="font-semibold text-slate-800">{job.title || "Untitled"}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {job.jobCategoryName || "Uncategorized"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">
                        {job.jobType || "—"}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">
                        {job.location || "Remote / Not specified"}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 text-xs">
                        {formatDate(job.deadline)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${jobBadge(job.status)}`}
                        >
                          {job.status || "active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setShowModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Job"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCloseJob(job)}
                            className={`p-2 hover:bg-slate-100 rounded-lg transition text-xs font-semibold ${
                              String(job.status).toLowerCase() === "closed"
                                ? "text-emerald-500 hover:text-emerald-700"
                                : "text-slate-400 hover:text-amber-600"
                            }`}
                            title={String(job.status).toLowerCase() === "closed" ? "Reopen job" : "Close job"}
                          >
                            {String(job.status).toLowerCase() === "closed" ? "Reopen" : "Close"}
                          </button>
                          <button
                            onClick={() => navigate(`/company-dashboard/applicants?job=${job.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Applicants"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                  >
                    {ROWS_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span>
                    {filtered.length === 0
                      ? "0 entries"
                      : `${(safePage - 1) * rowsPerPage + 1}-${Math.min(safePage * rowsPerPage, filtered.length)} of ${filtered.length} entries`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage <= 1}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        num === safePage
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage >= totalPages}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <JobFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingJob(null);
        }}
        job={editingJob}
        onSaved={() => {
          fetchJobs();
          setShowModal(false);
          setEditingJob(null);
        }}
      />
    </div>
  );
}