import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  GripVertical,
  Layers,
  Briefcase,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  ArrowUpDown,
  Pencil,
  Folder,
  Download,
  Check,
  MapPin,
  Search,
  RefreshCw,
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const JOBS_API_URL = "http://localhost:8089/api/jobs";
const CATEGORIES_API_URL = "http://localhost:8089/api/job-categories";
const COMPANIES_API_URL = "http://localhost:8089/api/companies";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const initialFormState = {
  title: "",
  description: "",
  company_id: "",
  category_id: "",
  location: "",
  job_type: "Full-time",
  workplace_type: "Remote",
  experience_level: "Senior",
  salary: "",
  status: "OPEN",
  deadline: "",
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const WORKPLACE_TYPES = ["Remote", "On-site", "Hybrid"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Director"];
const STATUSES = ["OPEN", "CLOSED"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, jobRes, compRes] = await Promise.all([
        axios.get(CATEGORIES_API_URL).catch(() => ({ data: [] })),
        axios.get(JOBS_API_URL).catch(() => ({ data: [] })),
        axios.get(COMPANIES_API_URL).catch(() => ({ data: [] })),
      ]);

      const catData = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.data || [];
      const jobData = Array.isArray(jobRes.data)
        ? jobRes.data
        : jobRes.data.data || [];
      const compData = Array.isArray(compRes.data)
        ? compRes.data
        : compRes.data.data || [];

      // Debugging: មើល Structure នៃទិន្នន័យក្នុង Console
      console.log("Jobs API Response:", jobData);
      console.log("Categories API Response:", catData);
      console.log("Companies API Response:", compData);

      setCategories(catData);
      setJobs(jobData);
      setCompanies(compData);
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("Failed to load data. Check if the API is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const companyMap = useMemo(
    () => companies.reduce((acc, c) => ({ ...acc, [c.id]: c.companyName || c.company_name }), {}),
    [companies]
  );

  const getCompanyId = (job) => job.companyId ?? job.company_id ?? job.company?.id;
  const companyName = (job) => {
    const id = getCompanyId(job);
    const name = companyMap[id] ||
      job.companyName ||
      job.company_name ||
      job.company?.name;
    return name || (id ? `Company #${id}` : "N/A");
  };

  // Safe extraction of Category ID from Job Object
  const getJobCategoryId = (job) => {
    if (!job) return null;
    const id =
      job.jobCategoryId ??
      job.category_id ??
      job.categoryId ??
      job.job_category_id ??
      job.category?.id ??
      job.jobCategory?.id ??
      job.jobCategories?.id;
    return id !== undefined && id !== null ? String(id) : null;
  };

  const getCategoryName = (job) =>
    job.jobCategoryName ||
    categories.find((c) => String(c.id) === String(getJobCategoryId(job)))?.name ||
    "Uncategorized";

  const getStatus = (job) => String(job.status || "").toUpperCase();
  const getSalary = (job) =>
    job.salary != null && !isNaN(Number(job.salary))
      ? Number(job.salary).toLocaleString("en-US", { maximumFractionDigits: 2 })
      : null;

  const getJobCountByCategoryId = (categoryId) => {
    if (!categoryId) return 0;
    return jobs.filter(
      (job) => getJobCategoryId(job) === String(categoryId)
    ).length;
  };

  const openJobs = useMemo(
    () => jobs.filter((j) => getStatus(j) === "OPEN"),
    [jobs]
  );
  const closedJobs = useMemo(
    () => jobs.filter((j) => getStatus(j) !== "OPEN"),
    [jobs]
  );
  const activeCompanies = useMemo(() => {
    const set = new Set(jobs.map(getCompanyId).filter(Boolean));
    return set.size;
  }, [jobs]);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [searchQuery, statusFilter, selectedCategoryId]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return jobs.filter((job) => {
      const inCategory =
        selectedCategoryId === null ||
        getJobCategoryId(job) === String(selectedCategoryId);
      const inStatus =
        statusFilter === "ALL" || getStatus(job) === statusFilter;
      const matchesSearch =
        !q ||
        (job.title || "").toLowerCase().includes(q) ||
        getCategoryName(job).toLowerCase().includes(q) ||
        companyName(job).toLowerCase().includes(q);
      return inCategory && inStatus && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, selectedCategoryId, statusFilter, searchQuery, categories, companies]);

  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    arr.sort((a, b) => {
      let va, vb;
      if (sortKey === "title") {
        va = (a.title || "").toLowerCase();
        vb = (b.title || "").toLowerCase();
      } else if (sortKey === "salary") {
        va = Number(a.salary || 0);
        vb = Number(b.salary || 0);
      } else {
        va = new Date(a.createdAt || 0).getTime();
        vb = new Date(b.createdAt || 0).getTime();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filteredJobs, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pagedJobs = sortedJobs.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allPageSelected =
    pagedJobs.length > 0 && pagedJobs.every((j) => selectedIds.includes(j.id));
  const toggleAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pagedJobs.some((j) => j.id === id))
      );
    } else {
      const ids = new Set(selectedIds);
      pagedJobs.forEach((j) => ids.add(j.id));
      setSelectedIds([...ids]);
    }
  };
  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const exportCSV = () => {
    if (sortedJobs.length === 0) {
      showToast("No jobs to export.", "error");
      return;
    }
    const headers = ["id", "title", "company", "category", "location", "jobType", "workplaceType", "experienceLevel", "salary", "deadline", "status", "postedAt"];
    const rows = sortedJobs.map((job) => [
      job.id,
      job.title || "",
      companyName(job),
      getCategoryName(job),
      job.location || "",
      job.jobType || job.job_type || "",
      job.workplaceType || job.workplace_type || "",
      job.experienceLevel || job.experience_level || "",
      getSalary(job) || "",
      job.deadline || "",
      getStatus(job),
      job.createdAt || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobs.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Jobs exported to CSV.");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setFormData({
      ...initialFormState,
      company_id: companies[0]?.id || "",
      category_id: categories[0]?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      company_id: getCompanyId(job) || companies[0]?.id || "",
      category_id: getJobCategoryId(job) || categories[0]?.id || "",
      location: job.location || "",
      job_type: job.jobType || job.job_type || "Full-time",
      workplace_type: job.workplaceType || job.workplace_type || "Remote",
      experience_level: job.experienceLevel || job.experience_level || "Senior",
      salary: job.salary != null ? String(job.salary) : "",
      status: getStatus(job) || "OPEN",
      deadline: job.deadline ? String(job.deadline).split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();

    const cleanSalary = formData.salary
      ? parseFloat(String(formData.salary).replace(/[^0-9.]/g, ""))
      : null;

    // Exact JobRequestDTO shape (camelCase) ពី Backend
    const payload = {
      companyId: Number(formData.company_id),
      jobCategoryId: Number(formData.category_id),
      title: formData.title,
      description: formData.description,
      jobType: formData.job_type,
      experienceLevel: formData.experience_level,
      workplaceType: formData.workplace_type,
      salary: isNaN(cleanSalary) ? null : cleanSalary,
      deadline: formData.deadline || null,
      location: formData.location,
      status: formData.status,
    };

    try {
      setSubmitting(true);
      if (editingJobId) {
        await axios.put(`${JOBS_API_URL}/${editingJobId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        showToast("Job updated successfully.");
      } else {
        await axios.post(JOBS_API_URL, payload, {
          headers: { "Content-Type": "application/json" },
        });
        showToast("Job created successfully.");
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (err) {
      console.error("Error saving job:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data;
      showToast(
        typeof serverMsg === "string" ? serverMsg : "Failed to save job. Verify inputs.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${JOBS_API_URL}/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast("Job deleted.");
    } catch (err) {
      console.error("Error deleting job:", err);
      showToast("Failed to delete job.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected job(s)?`)) return;
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`${JOBS_API_URL}/${id}`))
      );
      setJobs((prev) => prev.filter((j) => !selectedIds.includes(j.id)));
      showToast(`${selectedIds.length} job(s) deleted.`);
      setSelectedIds([]);
    } catch (err) {
      console.error("Error deleting jobs:", err);
      showToast("Failed to delete some jobs.", "error");
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt)
      ? String(d).slice(0, 10)
      : dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const inputClass =
    "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";
  const labelClass =
    "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Job Postings
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage and track active and historical job opportunities
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <Link
              to="/dashboard/categories"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-indigo-900 hover:bg-slate-50 transition"
            >
              <Layers size={14} className="text-indigo-600" /> Categories
            </Link>

            <button
              onClick={fetchData}
              className="justify-center p-2.5 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <Download size={14} />
              Export CSV
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
            >
              <Plus size={16} /> Post New Job
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "bg-indigo-50 text-indigo-600" },
            { label: "Open Jobs", value: openJobs.length, icon: Clock, color: "bg-emerald-50 text-emerald-600" },
            { label: "Closed Jobs", value: closedJobs.length, icon: X, color: "bg-rose-50 text-rose-600" },
            { label: "Companies Hiring", value: activeCompanies, icon: Building2, color: "bg-amber-50 text-amber-600" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{s.value.toLocaleString()}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main grid: category sidebar + table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Categories</h2>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${selectedCategoryId === null ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder size={16} className="text-indigo-600" />
                    <span>All Categories</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-500">
                    {jobs.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected = String(selectedCategoryId) === String(cat.id);
                  const count = getJobCountByCategoryId(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${isSelected ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GripVertical size={14} className="text-slate-300" />
                        <Folder size={16} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                        <span>{cat.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              {/* Filter bar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      {statusFilter === "ALL" ? "All Statuses" : statusFilter}
                      <ChevronDown size={14} />
                    </button>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => toggleSort("createdAt")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Date Posted <ArrowUpDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleSort("title")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Title <ArrowUpDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleSort("salary")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Salary <ArrowUpDown size={14} />
                  </button>

                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition"
                    >
                      <Trash2 size={13} />
                      Delete {selectedIds.length} selected
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Showing{" "}
                  <span className="text-slate-700 font-semibold">{filteredJobs.length}</span>{" "}
                  total jobs
                </p>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 className="animate-spin mr-2" size={20} /> Loading Jobs...
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3.5 pl-4 pr-2 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={allPageSelected}
                            onChange={toggleAll}
                          />
                        </th>
                        <th className="py-3.5 px-4">Job Title</th>
                        <th className="py-3.5 px-4 hidden md:table-cell">Company</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 hidden lg:table-cell">Posted</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {pagedJobs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400">
                            No jobs found for this filter.
                          </td>
                        </tr>
                      ) : (
                        pagedJobs.map((job) => {
                          const isSelected = selectedIds.includes(job.id);
                          const salary = getSalary(job);
                          const status = getStatus(job);

                          return (
                            <tr
                              key={job.id}
                              className={`transition-colors ${isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"}`}
                            >
                              <td className="py-4 pl-4 pr-2">
                                <input
                                  type="checkbox"
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                  checked={isSelected}
                                  onChange={() => toggleOne(job.id)}
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-700">
                                    {job.title ? job.title.substring(0, 2).toUpperCase() : "JOB"}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900 text-xs">{job.title || "Untitled"}</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                      {getCategoryName(job)} •{" "}
                                      <span className="text-slate-500">
                                        {salary ? `$${salary}` : "Salary N/A"}
                                      </span>
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 inline-flex items-center gap-1">
                                      <MapPin size={10} /> {job.location || "N/A"}
                                      <span className="mx-0.5 text-slate-300">•</span>
                                      {job.workplaceType || job.workplace_type || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 hidden md:table-cell">
                                <span className="inline-flex items-center gap-1.5 text-slate-600">
                                  <Building2 size={12} className="text-slate-400" />
                                  {companyName(job)}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${status === "OPEN" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                  <span className={`font-semibold ${status === "OPEN" ? "text-emerald-600" : "text-rose-600"}`}>
                                    {status || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 hidden lg:table-cell text-slate-400">
                                {formatDate(job.createdAt)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleOpenEditModal(job)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition rounded-lg hover:bg-indigo-50"
                                    title="Edit Job"
                                  >
                                    <Pencil size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    disabled={deletingId === job.id}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50 disabled:opacity-50"
                                    title="Delete Job"
                                  >
                                    {deletingId === job.id ? (
                                      <Loader2 size={15} className="animate-spin text-rose-600" />
                                    ) : (
                                      <Trash2 size={15} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Pagination */}
            {!loading && sortedJobs.length > 0 && (
              <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <p>
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {(safePage - 1) * rowsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-700">
                      {Math.min(safePage * rowsPerPage, sortedJobs.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">{sortedJobs.length}</span>{" "}
                    jobs
                  </p>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none"
                  >
                    {ROWS_PER_PAGE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n} / page</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                            p === safePage
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "border border-slate-200 text-slate-500 hover:bg-white"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingJobId ? "Edit Job Posting" : "Post New Job"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 space-y-4 text-xs">
              <div>
                <label className={labelClass}>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Company *</label>
                  <select
                    name="company_id"
                    required
                    value={formData.company_id}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="" disabled>Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName || c.company_name || `Company #${c.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Phnom Penh, Cambodia"
                  />
                </div>
                <div>
                  <label className={labelClass}>Salary ($)</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Workplace Type</label>
                  <select
                    name="workplace_type"
                    value={formData.workplace_type}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {WORKPLACE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter job description..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingJobId ? "Update Job" : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white animate-in fade-in slide-in-from-bottom-4 duration-200 ${
              toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
            }`}
          >
            {toast.type === "error" ? (
              <X className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}