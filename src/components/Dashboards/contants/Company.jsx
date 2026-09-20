import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  Globe,
  Trash2,
  Edit3,
  X,
  UploadCloud,
  User,
  Loader2,
  RefreshCw,
  Briefcase,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  CalendarDays,
  Building,
  SlidersHorizontal,
} from "lucide-react";
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadCompanyLogo,
  deleteCompanyLogo,
} from "@/service/CompanyApi";
import { getAllUsers } from "@/service/userApi";
import { getAllJob } from "@/service/JobApi";
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const EMPTY_FORM = {
  companyName: "",
  description: "",
  location: "",
  website: "",
  userId: "",
};

function Company() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("companyName");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getAllCompanies();
      const data = response.data || response;
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      showToast("Failed to load companies. Check if the API is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const data = response.data || response;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await getAllJob();
      const data = response.data || response;
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const refreshAll = () => {
    fetchCompanies();
    fetchUsers();
    fetchJobs();
  };

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchJobs();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const getCompanyName = (c) => c.companyName || c.company_name || "";
  const getLocation = (c) => c.location || "";
  const getUserId = (c) => c.userId || c.user_id;

  const uploadLogoToBackend = async (companyId, file) => {
    await uploadCompanyLogo(companyId, file);
  };

  // Per-company job counts (from real jobs data)
  const companyJobCounts = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const companyId = job.company_id ?? job.companyId ?? job.company?.id;
      if (companyId == null) return;
      const key = String(companyId);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [jobs]);

  const jobsWithOpen = useMemo(
    () => jobs.filter((j) => String(j.status || "").toUpperCase() === "OPEN"),
    [jobs]
  );

  const companiesWithOpenJobs = useMemo(() => {
    const set = new Set();
    jobsWithOpen.forEach((job) => {
      const id = job.company_id ?? job.companyId ?? job.company?.id;
      if (id == null) return;
      set.add(String(id));
    });
    return set;
  }, [jobsWithOpen]);

  const newThisMonth = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return companies.filter((c) => {
      const d = new Date(c.createdAt || 0).getTime();
      return d >= cutoff;
    }).length;
  }, [companies]);

  const userMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.name || user.username || `User ${user.id}`;
      return acc;
    }, {});
  }, [users]);

  const ownerName = (c) => {
    const id = getUserId(c);
    return id && userMap[id] ? userMap[id] : id ? `ID: ${id}` : "—";
  };

  // Filters
  const locationOptions = useMemo(() => {
    const set = new Set(companies.map(getLocation).filter(Boolean));
    return [...set];
  }, [companies]);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [searchQuery, locationFilter]);

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return companies.filter((c) => {
      const name = getCompanyName(c).toLowerCase();
      const loc = getLocation(c).toLowerCase();
      const matchesSearch = name.includes(q) || loc.includes(q);
      const matchesLoc = locationFilter === "ALL" || getLocation(c) === locationFilter;
      return matchesSearch && matchesLoc;
    });
  }, [companies, searchQuery, locationFilter]);

  const sortedCompanies = useMemo(() => {
    const arr = [...filteredCompanies];
    arr.sort((a, b) => {
      let va, vb;
      if (sortKey === "createdAt") {
        va = new Date(a.createdAt || 0).getTime();
        vb = new Date(b.createdAt || 0).getTime();
      } else {
        va = getCompanyName(a).toLowerCase();
        vb = getCompanyName(b).toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filteredCompanies, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pagedCompanies = sortedCompanies.slice(
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
    pagedCompanies.length > 0 &&
    pagedCompanies.every((c) => selectedIds.includes(c.id));
  const toggleAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pagedCompanies.some((c) => c.id === id))
      );
    } else {
      const ids = new Set(selectedIds);
      pagedCompanies.forEach((c) => ids.add(c.id));
      setSelectedIds([...ids]);
    }
  };
  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const exportCSV = () => {
    if (sortedCompanies.length === 0) {
      showToast("No companies to export.", "error");
      return;
    }
    const headers = ["id", "companyName", "description", "location", "website", "logo", "userId", "jobs"];
    const rows = sortedCompanies.map((c) => [
      c.id,
      getCompanyName(c),
      c.description || "",
      getLocation(c),
      c.website || "",
      c.logo || "",
      getUserId(c) || "",
      companyJobCounts[String(c.id)] || 0,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Companies exported to CSV.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;
    if (!formData.userId) {
      showToast("Please select a User", "error");
      return;
    }

    try {
      setSubmitting(true);

      // JSON body without logo — the backend ignores it; logo is handled by uploadLogoToBackend
      const payload = {
        companyName: formData.companyName.trim(),
        description: formData.description ? formData.description.trim() : "",
        location: formData.location ? formData.location.trim() : "",
        website: formData.website ? formData.website.trim() : "",
        userId: Number(formData.userId),
      };

      const saved = editingCompany
        ? await updateCompany(editingCompany.id, payload)
        : await createCompany(payload);

      const savedData = saved.data || saved;
      const savedId = savedData?.id ?? editingCompany?.id;

      if (logoFile && savedId != null) {
        await uploadLogoToBackend(savedId, logoFile);
      }

      showToast(
        editingCompany ? "Company updated successfully." : "Company created successfully."
      );
      closeModal();
      fetchCompanies();
    } catch (err) {
      console.error("Failed to save company:", err);
      const backendMessage = err.response?.data?.message || err.message;
      showToast(`Save failed: ${backendMessage}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !(await confirmDialog({
        message: "Are you sure you want to delete this company?",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }))
    )
      return;
    try {
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      showToast("Company deleted.");
    } catch (err) {
      console.error("Failed to delete company:", err);
      showToast("Failed to delete company.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !(await confirmDialog({
        message: `Delete ${selectedIds.length} selected company(ies)?`,
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }))
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) => deleteCompany(id))
      );
      setCompanies((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      showToast(`${selectedIds.length} company(ies) deleted.`);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete companies:", err);
      showToast("Failed to delete some companies.", "error");
    }
  };

  const handleDeleteLogo = async (company, e) => {
    e.stopPropagation();
    if (
      !(await confirmDialog({
        message: "Remove company logo?",
        confirmLabel: "Remove",
        cancelLabel: "Cancel",
      }))
    )
      return;

    try {
      await deleteCompanyLogo(company.id);
      fetchCompanies();
      showToast("Company logo removed.");
    } catch (err) {
      console.error("Failed to delete logo:", err);
      showToast("Failed to remove logo.", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        companyName: getCompanyName(company),
        description: company.description || "",
        location: getLocation(company),
        website: company.website || "",
        userId: getUserId(company) || users[0]?.id || "",
      });
      setLogoPreview(company.logo || company.logoUrl || null);
    } else {
      setEditingCompany(null);
      setFormData({
        companyName: "",
        description: "",
        location: "",
        website: "",
        userId: users[0]?.id || "",
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData(EMPTY_FORM);
    setLogoFile(null);
    setLogoPreview(null);
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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Company Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage partner companies and their jobs
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <button
              onClick={refreshAll}
              className="justify-center p-2.5 text-slate-500 hover:text-sky-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
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
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-sky-100 transition-all"
            >
              <Plus size={16} />
              Add Company
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Companies", value: companies.length, icon: Building2, color: "bg-sky-50 text-sky-600" },
            { label: "With Open Jobs", value: companiesWithOpenJobs.size, icon: Building, color: "bg-indigo-50 text-indigo-600" },
            { label: "Active Jobs", value: jobsWithOpen.length, icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
            { label: "New This Month", value: newThisMonth, icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
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

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All locations</option>
              {locationOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition"
              >
                <Trash2 size={13} />
                Delete {selectedIds.length} selected
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 md:ml-auto">
            Showing{" "}
            <span className="font-semibold text-slate-700">{filteredCompanies.length}</span>{" "}
            companies
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      checked={allPageSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort("companyName")}>
                    <span className="inline-flex items-center gap-1">
                      Company
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </span>
                  </th>
                  <th className="py-4 px-4 hidden md:table-cell">Industry / Website</th>
                  <th className="py-4 px-4 hidden sm:table-cell">Owner</th>
                  <th className="py-4 px-4">Jobs</th>
                  <th className="py-4 px-4 hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                    <span className="inline-flex items-center gap-1">
                      Registered
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </span>
                  </th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
                      <p className="text-xs">Loading companies...</p>
                    </td>
                  </tr>
                ) : pagedCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      No companies found matching your filters.
                    </td>
                  </tr>
                ) : (
                  pagedCompanies.map((company) => {
                    const name = getCompanyName(company);
                    const logoPath = company.logo || company.logoUrl;
                    const loc = getLocation(company);
                    const count = companyJobCounts[String(company.id)] || 0;
                    const isSelected = selectedIds.includes(company.id);

                    return (
                      <tr
                        key={company.id}
                        className={`transition-colors ${
                          isSelected ? "bg-sky-50/40" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-4 pl-4 pr-2">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleOne(company.id)}
                          />
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group/logo w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {logoPath ? (
                                <>
                                  <img
                                    src={logoPath}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={(e) => handleDeleteLogo(company, e)}
                                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"
                                    title="Delete Logo"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <Building2 className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {name || "Unnamed Company"}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {loc || "Location not set"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 hidden md:table-cell">
                          <div>
                            <p className="text-xs text-slate-600 font-medium truncate max-w-[180px]">
                              {company.description || "General Industry"}
                            </p>
                            {company.website && (
                              <a
                                href={
                                  company.website.startsWith("http")
                                    ? company.website
                                    : `https://${company.website}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline mt-0.5"
                              >
                                <Globe size={11} />
                                Website
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">
                            <User size={11} className="text-slate-400" />
                            {ownerName(company)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700">
                            <Briefcase size={11} className="mr-1" />
                            {count} Jobs
                          </span>
                        </td>

                        <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500">
                          {formatDate(company.createdAt)}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openModal(company)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition"
                              title="Edit Company"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(company.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                              title="Delete Company"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && sortedCompanies.length > 0 && (
            <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(safePage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(safePage * rowsPerPage, sortedCompanies.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {sortedCompanies.length}
                  </span>{" "}
                  companies
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
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safePage) <= 1
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-slate-400">…</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                          p === safePage
                            ? "bg-sky-600 text-white shadow-sm"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCompany ? "Edit Company Details" : "Add New Company"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="logo-file-input"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-file-input"
                    className="cursor-pointer px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    {logoFile ? logoFile.name : "Upload Image"}
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Nexa Systems"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Phnom Penh, Cambodia"
                  />
                </div>
                <div>
                  <label className={labelClass}>User Owner *</label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" disabled>Select a User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.username || `User ${u.id}`} (ID: {u.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={inputClass}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter industry or description..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-100 transition disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {editingCompany
                    ? "Update Company"
                    : "Save Company"}
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

export default Company;