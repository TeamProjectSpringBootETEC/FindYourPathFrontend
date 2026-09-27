import React, { useState, useEffect, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Loader2,
  CalendarDays,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  getAllevent,
  getAllEventCategories,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "@/service/eventApi";
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const EMPTY_FORM = { name: "", description: "" };

function EventCategory() {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catData, eventData] = await Promise.all([
        getAllEventCategories().catch(() => []),
        getAllevent().catch(() => []),
      ]);
      const cats = Array.isArray(catData) ? catData : catData.data || [];
      const evs = Array.isArray(eventData) ? eventData : eventData.data || [];
      setCategories(cats);
      setEvents(evs);
    } catch (err) {
      console.error("Failed to fetch event categories:", err);
      showToast("Failed to load data. Make sure your API is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getEventCategoryId = (event) =>
    event.categoryId ?? event.category_id ?? event.category?.id ?? "";

  const eventCounts = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const id = getEventCategoryId(e);
      if (id == null) return;
      const key = String(id);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const getEventCount = (cat) => {
    if (Array.isArray(cat.events)) return cat.events.length;
    return eventCounts[String(cat.id)] || 0;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [categories, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / rowsPerPage)
  );
  const safePage = Math.min(page, totalPages);
  const pagedCategories = filteredCategories.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description ? formData.description.trim() : "",
    };

    try {
      setSubmitting(true);
      if (editingCategory) {
        await updateEventCategory(editingCategory.id, payload);
        showToast("Event category updated successfully.");
      } else {
        await createEventCategory(payload);
        showToast("Event category created successfully.");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save event category:", err);
      const backendMessage = err.response?.data?.message || err.message;
      showToast(`Save failed: ${backendMessage}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !(await confirmDialog({
        message: "Are you sure you want to delete this event category?",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }))
    )
      return;
    try {
      setDeletingId(id);
      await deleteEventCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Event category deleted.");
    } catch (err) {
      console.error("Failed to delete event category:", err);
      const backendMessage = err.response?.data?.message || err.message;
      showToast(`Delete failed: ${backendMessage}`, "error");
    } finally {
      setDeletingId(null);
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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Event Category Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Organize career fairs, workshops and networking events
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
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>

            <button
              onClick={fetchData}
              className="justify-center p-2.5 text-slate-500 hover:text-violet-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-violet-100 transition-all"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { label: "Total Categories", value: categories.length, icon: Tag, color: "bg-violet-50 text-violet-600" },
            { label: "Total Events", value: events.length, icon: CalendarDays, color: "bg-indigo-50 text-indigo-600" },
            { label: "Categories With Events", value: categories.filter((c) => getEventCount(c) > 0).length, icon: Check, color: "bg-emerald-50 text-emerald-600" },
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-violet-600" />
                <p className="text-sm">Fetching event categories...</p>
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 pl-6 pr-4">Category Name</th>
                    <th className="py-4 px-4 hidden md:table-cell">Description</th>
                    <th className="py-4 px-4">Events</th>
                    <th className="py-4 px-4 hidden lg:table-cell">Created</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pagedCategories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-slate-400">
                        No event categories found.
                      </td>
                    </tr>
                  ) : (
                    pagedCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 pl-6 pr-4">
                          <p className="font-semibold text-slate-900">
                            {cat.name || "Unnamed Category"}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">#{cat.id}</p>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span
                            className="text-slate-600 max-w-md block truncate"
                            title={cat.description}
                          >
                            {cat.description || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 text-violet-700">
                            <CalendarDays size={11} className="mr-1" />
                            {getEventCount(cat)} Events
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500">
                          {formatDate(cat.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(cat)}
                              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-slate-100 rounded-lg transition"
                              title="Edit Category"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={deletingId === cat.id}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                              title="Delete Category"
                            >
                              {deletingId === cat.id ? (
                                <Loader2 size={15} className="animate-spin text-rose-600" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredCategories.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(safePage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(safePage * rowsPerPage, filteredCategories.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredCategories.length}
                  </span>{" "}
                  categories
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
                    (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
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
                            ? "bg-violet-600 text-white shadow-sm"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? "Edit Event Category" : "Add Event Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Career Fair"
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-violet-100 disabled:opacity-50"
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
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
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

export default EventCategory;