import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  X,
  Loader2,
  Trash2,
  Edit3,
  RefreshCw,
  MapPin,
  Clock,
  Users,
  Building2,
  Tag,
  TrendingUp,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  getAllevent,
  getAllEventCategories,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/service/eventApi";
import { getAllCompanies } from "@/service/CompanyApi";

const initialFormState = {
  title: "",
  description: "",
  companyId: "",
  categoryId: "",
  eventType: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  registrationDeadline: "",
  maxParticipants: "",
  status: "UPCOMING",
};

const STATUS_OPTIONS = ["ALL", "UPCOMING", "COMPLETED", "CANCELLED"];
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllevent();
      const data = response.data || response;
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [catData, comData] = await Promise.all([
        getAllEventCategories().catch(() => null),
        getAllCompanies().catch(() => null),
      ]);
      const cats = catData?.data || catData;
      const comps = comData?.data || comData;
      setCategories(Array.isArray(cats) ? cats : []);
      setCompanies(Array.isArray(comps) ? comps : []);
    } catch (err) {
      console.error("Failed to fetch event meta:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMeta();
  }, []);

  // Safe extraction helpers
  const getEventCompanyId = (event) =>
    event.companyId ?? event.company_id ?? event.company?.id ?? "";
  const getEventCategoryId = (event) =>
    event.categoryId ?? event.category_id ?? event.category?.id ?? "";

  const getCategoryName = (event) => {
    const id = String(getEventCategoryId(event));
    const matched = categories.find((c) => String(c.id) === id);
    return matched?.name || "Uncategorized";
  };

  const getCompanyName = (event) => {
    const id = String(getEventCompanyId(event));
    const matched = companies.find((c) => String(c.id) === id);
    return matched?.companyName || matched?.name || `Company #${id}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const t = String(timeStr);
    const [h, m] = t.split(":");
    const date = new Date();
    date.setHours(Number(h), Number(m));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcomingCount = events.filter((e) => {
    const date = e.eventDate || e.event_date || "";
    return date && date >= today;
  }).length;
  const pastCount = events.length - upcomingCount;
  const totalCapacity = events.reduce(
    (sum, e) => sum + Number(e.maxParticipants || e.max_participants || 0),
    0
  );

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return events.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      const type = (e.eventType || e.event_type || "").toLowerCase();
      const matchesSearch =
        title.includes(q) || location.includes(q) || type.includes(q);
      const matchesStatus =
        statusFilter === "ALL" ||
        String(e.status || "").toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pagedEvents = filteredEvents.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      companyId: String(getEventCompanyId(event)),
      categoryId: String(getEventCategoryId(event)),
      eventType: event.eventType || event.event_type || "",
      eventDate: (event.eventDate || event.event_date || "").slice(0, 10),
      startTime: (event.startTime || event.start_time || "").slice(0, 5),
      endTime: (event.endTime || event.end_time || "").slice(0, 5),
      location: event.location || "",
      registrationDeadline: (event.registrationDeadline ||
        event.registration_deadline ||
        "").slice(0, 10),
      maxParticipants: String(
        event.maxParticipants || event.max_participants || ""
      ),
      status: event.status || "UPCOMING",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      companyId: Number(formData.companyId),
      categoryId: Number(formData.categoryId),
      eventType: formData.eventType.trim(),
      eventDate: formData.eventDate || null,
      startTime: formData.startTime ? `${formData.startTime}:00` : null,
      endTime: formData.endTime ? `${formData.endTime}:00` : null,
      location: formData.location.trim(),
      registrationDeadline: formData.registrationDeadline || null,
      maxParticipants: formData.maxParticipants
        ? Number(formData.maxParticipants)
        : null,
      status: formData.status,
    };

    try {
      setSubmitting(true);
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
      const backendMessage = err.response?.data?.message || err.message;
      alert(`Save failed: ${backendMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeletingId(id);
      await deleteEvent(id);
      setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (status) => {
    const s = (status || "UPCOMING").toUpperCase();
    if (s === "CANCELLED")
      return "bg-rose-50 text-rose-600 border border-rose-200";
    if (s === "COMPLETED" || s === "CLOSED")
      return "bg-slate-100 text-slate-600 border border-slate-200";
    return "bg-emerald-50 text-emerald-600 border border-emerald-200";
  };

  const inputClass =
    "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

  const labelClass =
    "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Event Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage career fairs, workshops and networking events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <SlidersHorizontal size={13} />
                {statusFilter === "ALL" ? "All Statuses" : statusFilter}
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Filter by status"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                fetchEvents();
                fetchMeta();
              }}
              className="p-2.5 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Events
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {events.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Upcoming
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {upcomingCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <CalendarOff size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Past / Completed
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {pastCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Capacity
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {totalCapacity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Event</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                      <p className="text-xs">Loading events...</p>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      No events found matching your filters.
                    </td>
                  </tr>
                ) : (
                  pagedEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {event.title
                              ? event.title.substring(0, 2).toUpperCase()
                              : "EV"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {event.title || "Untitled Event"}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Tag className="w-3 h-3" />
                              {getCategoryName(event)} ·{" "}
                              {event.eventType || event.event_type || "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">
                          {formatDate(event.eventDate || event.event_date)}
                        </p>
                        {event.startTime || event.start_time ? (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTime(event.startTime || event.start_time)}
                            {event.endTime || event.end_time
                              ? ` - ${formatTime(event.endTime || event.end_time)}`
                              : ""}
                          </p>
                        ) : null}
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {getCompanyName(event)}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {event.location || "TBD"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(event.status)}`}
                        >
                          {event.status || "UPCOMING"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                            title="Delete Event"
                          >
                            {deletingId === event.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredEvents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Show</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {ROWS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span>
                  {filteredEvents.length === 0
                    ? "0 entries"
                    : `${(safePage - 1) * rowsPerPage + 1}-${Math.min(
                        safePage * rowsPerPage,
                        filteredEvents.length
                      )} of ${filteredEvents.length} entries`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
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
                  )
                )}
                <button
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage >= totalPages}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className={labelClass}>Event Title *</label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. Tech Career Fair 2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company *</label>
                  <select
                    required
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Company
                    </option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName || c.name} (ID: {c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Event Type</label>
                  <input
                    type="text"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Career Fair, Workshop"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Registration Deadline</label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 200"
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter event description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingEvent ? "Update Event" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;