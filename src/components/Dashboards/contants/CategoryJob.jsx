import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import {
  Tag,
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Loader2,
  Building2,
  RefreshCw,
  Briefcase,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/job-categories";
const JOBS_API_URL = "http://localhost:8089/api/jobs";
const FIELDS_API_URL = "http://localhost:8089/api/job-fields";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const EMPTY_FORM = {
  name: "",
  description: "",
  fieldId: "",
};

function CategoryJob() {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const getFieldId = (cat) => cat.fieldId ?? cat.field_id;
  const getFieldName = (cat) =>
    cat.fieldName ?? cat.field_name ?? (cat.field?.name ?? "");

  // Safe extraction of Category ID from Job Object ដកស្រង់ Category ID ពី Job ឲ្យគ្រប់ទម្រង់
  const getJobCategoryId = (job) => {
    if (!job) return null;
    const id =
      job.category_id ??
      job.categoryId ??
      job.job_category_id ??
      job.jobCategoryId ??
      job.category?.id ??
      job.jobCategory?.id ??
      job.jobCategories?.id;
    return id !== undefined && id !== null ? String(id) : null;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, jobRes, fieldRes] = await Promise.all([
        axios.get(API_BASE_URL),
        axios.get(JOBS_API_URL).catch(() => ({ data: [] })),
        axios.get(FIELDS_API_URL).catch(() => ({ data: [] })),
      ]);

      const catData = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.data || [];
      const jobData = Array.isArray(jobRes.data)
        ? jobRes.data
        : jobRes.data.data || [];
      const fieldData = Array.isArray(fieldRes.data)
        ? fieldRes.data
        : fieldRes.data.data || [];

      console.log("Categories Data:", catData);
      console.log("Jobs Data:", jobData);
      console.log("Fields Data:", fieldData);

      setCategories(catData);
      setJobs(jobData);
      setFields(fieldData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showToast(
        "Failed to load data. Make sure your API is running at http://localhost:8089.",
        "error"
      );
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

  // មុខងារគណនាចំនួន Job តាម Category ID ដោយប្រើ String Comparison
  const jobCountsMap = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const jobCatId = getJobCategoryId(job);
      if (jobCatId == null) return;
      map[jobCatId] = (map[jobCatId] || 0) + 1;
    });
    return map;
  }, [jobs]);

  const getJobCount = (cat) => {
    if (Array.isArray(cat.jobs)) return cat.jobs.length;
    return jobCountsMap[String(cat.id)] || 0;
  };

  const categoriesWithJobs = useMemo(
    () => categories.filter((c) => getJobCount(c) > 0).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, jobCountsMap]
  );

  const fieldMap = useMemo(
    () => fields.reduce((acc, f) => ({ ...acc, [f.id]: f.name }), {}),
    [fields]
  );

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [searchQuery, fieldFilter]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => {
      const nameMatch =
        cat.name && cat.name.toLowerCase().includes(query);
      const descMatch =
        cat.description && cat.description.toLowerCase().includes(query);
      const fieldMatch =
        getFieldName(cat).toLowerCase().includes(query);
      const matchesQuery = nameMatch || descMatch || fieldMatch;
      const matchesField =
        fieldFilter === "ALL" ||
        String(getFieldId(cat)) === fieldFilter;
      return matchesQuery && matchesField;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, searchQuery, fieldFilter]);

  const sortedCategories = useMemo(() => {
    const arr = [...filteredCategories];
    arr.sort((a, b) => {
      let va, vb;
      if (sortKey === "createdAt") {
        va = new Date(a.createdAt || 0).getTime();
        vb = new Date(b.createdAt || 0).getTime();
      } else if (sortKey === "jobs") {
        va = getJobCount(a);
        vb = getJobCount(b);
      } else {
        va = (a.name || "").toLowerCase();
        vb = (b.name || "").toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCategories, sortKey, sortDir, jobCountsMap]);

  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pagedCategories = sortedCategories.slice(
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
    pagedCategories.length > 0 &&
    pagedCategories.every((c) => selectedIds.includes(c.id));
  const toggleAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pagedCategories.some((c) => c.id === id))
      );
    } else {
      const ids = new Set(selectedIds);
      pagedCategories.forEach((c) => ids.add(c.id));
      setSelectedIds([...ids]);
    }
  };
  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const exportCSV = () => {
    if (sortedCategories.length === 0) {
      showToast("No categories to export.", "error");
      return;
    }
    const headers = ["id", "name", "description", "fieldId", "fieldName", "jobs"];
    const rows = sortedCategories.map((c) => [
      c.id,
      c.name || "",
      c.description || "",
      getFieldId(c) || "",
      getFieldName(c) || "",
      getJobCount(c),
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
    a.download = "job-categories.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Categories exported to CSV.");
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      fieldId: fields[0]?.id !== undefined ? String(fields[0].id) : "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      fieldId:
        getFieldId(category) !== undefined && getFieldId(category) !== null
          ? String(getFieldId(category))
          : fields[0]?.id !== undefined
          ? String(fields[0].id)
          : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : "",
        fieldId: formData.fieldId ? Number(formData.fieldId) : null,
      };

      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/${editingCategory.id}`, payload);
        showToast("Category updated successfully.");
      } else {
        await axios.post(API_BASE_URL, payload);
        showToast("Category created successfully.");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData(EMPTY_FORM);
      fetchData();
    } catch (err) {
      console.error("Failed to save category:", err);
      const backendMessage = err.response?.data?.message || err.message;
      showToast(`Save failed: ${backendMessage}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      showToast("Category deleted.");
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast("Failed to delete category.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} selected job categor${selectedIds.length > 1 ? "ies" : "y"}?`
      )
    ) {
      return;
    }
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`${API_BASE_URL}/${id}`))
      );
      setCategories((prev) =>
        prev.filter((c) => !selectedIds.includes(c.id))
      );
      showToast(`${selectedIds.length} categor${selectedIds.length > 1 ? "ies" : "y"} deleted.`);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete categories:", err);
      showToast("Failed to delete some categories.", "error");
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Job Category Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Organize job categories and their job fields
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

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
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Categories", value: categories.length, icon: Tag, color: "bg-indigo-50 text-indigo-600" },
            { label: "Job Fields", value: fields.length, icon: Layers, color: "bg-violet-50 text-violet-600" },
            { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
            { label: "Categories With Jobs", value: categoriesWithJobs, icon: Building2, color: "bg-amber-50 text-amber-600" },
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
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All job fields</option>
              {fields.map((f) => (
                <option key={f.id} value={String(f.id)}>{f.name}</option>
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
            <span className="font-semibold text-slate-700">
              {filteredCategories.length}
            </span>{" "}
            categor{filteredCategories.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
                <p className="text-sm">Fetching categories from backend...</p>
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={allPageSelected}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                      <span className="inline-flex items-center gap-1">
                        ID / Category Name
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </span>
                    </th>
                    <th className="py-4 px-4 hidden md:table-cell">Description</th>
                    <th className="py-4 px-4 hidden sm:table-cell">Job Field</th>
                    <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort("jobs")}>
                      <span className="inline-flex items-center gap-1">
                        Jobs
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </span>
                    </th>
                    <th className="py-4 px-4 hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                      <span className="inline-flex items-center gap-1">
                        Created
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </span>
                    </th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pagedCategories.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center text-slate-400">
                        No job categories found matching your query.
                      </td>
                    </tr>
                  ) : (
                    pagedCategories.map((item) => {
                      const jobCount = getJobCount(item);
                      const isSelected = selectedIds.includes(item.id);
                      const fieldName =
                        getFieldName(item) || fieldMap[getFieldId(item)] || "General";

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td className="py-4 pl-4 pr-2">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              checked={isSelected}
                              onChange={() => toggleOne(item.id)}
                            />
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-semibold text-slate-900">
                              {item.name || "Unnamed Category"}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                              #{item.id}
                            </p>
                          </td>

                          <td className="py-4 px-4 hidden md:table-cell">
                            <span className="text-slate-600 max-w-md block truncate" title={item.description}>
                              {item.description || "N/A"}
                            </span>
                          </td>

                          <td className="py-4 px-4 hidden sm:table-cell">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-full text-[11px] font-semibold">
                              <Layers size={11} />
                              {fieldName}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                              <Briefcase size={11} className="mr-1" />
                              {jobCount} Jobs
                            </span>
                          </td>

                          <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500">
                            {formatDate(item.createdAt)}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                title="Edit Category"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(item.id)}
                                disabled={deletingId === item.id}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                                title="Delete Category"
                              >
                                {deletingId === item.id ? (
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

          {/* Pagination */}
          {!loading && sortedCategories.length > 0 && (
            <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(safePage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(safePage * rowsPerPage, sortedCategories.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {sortedCategories.length}
                  </span>{" "}
                  categor{sortedCategories.length === 1 ? "y" : "ies"}
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

      {/* Modal Form for CREATE & EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? "Edit Job Category" : "Add Job Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Job Field</label>
                <select
                  value={formData.fieldId}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldId: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="" disabled>Select a job field</option>
                  {fields.map((f) => (
                    <option key={f.id} value={String(f.id)}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technology"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCategory ? "Update Category" : "Save Category"}
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

export default CategoryJob;