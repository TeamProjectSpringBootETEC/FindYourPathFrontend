import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Loader2,
  Edit3,
  Trash2,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useCompany } from "../CompanyLayout";
import NoCompanyNotice from "../NoCompanyNotice";
import { getEventsByCompanyId, deleteEvent } from "@/service/eventApi";
import {
  getRegistrationsByEventId,
  cancelRegistration,
} from "@/service/eventRegistrationApi";
import EventFormModal from "./EventFormModal";
import { eventBadge, formatDate } from "../helpers";

const ROWS_OPTIONS = [5, 10, 25, 50];

export default function EventList() {
  const { companyId, company } = useCompany();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [particEvent, setParticEvent] = useState(null);
  const [searchParams] = useSearchParams();

  const fetchEvents = async () => {
    if (!companyId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getEventsByCompanyId(companyId);
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [companyId]);

  useEffect(() => {
    if (searchParams.get("new") === "1" && companyId) {
      setEditingEvent(null);
      setShowModal(true);
    }
  }, [searchParams, companyId]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return events.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const type = (e.eventType || e.event_type || "").toLowerCase();
      const matchesSearch = title.includes(q) || type.includes(q);
      const matchesStatus =
        statusFilter === "ALL" ||
        String(e.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete event "${event.title}"?`)) return;
    try {
      await deleteEvent(event.id);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Host career fairs, workshops, and seminars for {company?.companyName || "your company"}.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          disabled={!companyId}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={companyId ? "Create an event" : "Set up your company profile first"}
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {!companyId && <NoCompanyNotice />}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
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
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading events...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No events found</p>
            <p className="text-xs text-slate-400 mt-1">
              {events.length === 0 ? "Click 'Create Event' to host your first event." : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Event</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paged.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div>
                          <p className="font-semibold text-slate-800">{event.title || "Untitled"}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {event.eventType || event.event_type || "Event"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 text-xs">
                        {formatDate(event.eventDate || event.event_date)}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">
                        {event.location || "TBD"}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${eventBadge(event.status)}`}
                        >
                          {event.status || "active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setParticEvent(event)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Participants"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <EventFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSaved={() => {
          fetchEvents();
          setShowModal(false);
          setEditingEvent(null);
        }}
      />

      {particEvent && (
        <ParticipantModal
          event={particEvent}
          onClose={() => setParticEvent(null)}
        />
      )}
    </div>
  );
}

function ParticipantModal({ event, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRegistrationsByEventId(event.id)
      .then((d) => setParticipants(Array.isArray(d) ? d : []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, [event.id]);

  const remove = async (reg) => {
    setRemovingId(reg.id);
    try {
      await cancelRegistration(reg.id);
      setParticipants((prev) => prev.filter((p) => p.id !== reg.id));
    } catch (err) {
      console.error("Failed to remove registration:", err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">{event.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {participants.length} registered participant{participants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {loading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Loading participants...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="w-9 h-9 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No registrations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                When students register, they'll show up here.
              </p>
            </div>
          ) : (
            participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {(p.userName || "?").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.userName || "Unknown"}</p>
                    <p className="text-[11px] text-slate-400">
                      Registered {formatDate(p.createdAt)} ·{" "}
                      <span className="inline-flex items-center px-1.5 py-px rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                        Registered
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => remove(p)}
                  disabled={removingId === p.id}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  title="Remove participant"
                >
                  {removingId === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}