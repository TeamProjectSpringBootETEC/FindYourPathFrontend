import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  ScanLine,
  Loader2,
  UserCheck,
  Ticket,
  Mail,
  Phone,
  CheckCircle2,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Filter,
} from "lucide-react";
import { getEventById } from "@/service/eventApi";
import {
  getRegistrationsByEventId,
  checkInRegistration,
} from "@/service/eventRegistrationApi";
import { exportToExcel, exportToPdf } from "@/utils/participantExport";
import EventQrScanner from "@/components/EventQrScanner";

const extractTicketCode = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return "";
  const match = s.match(/FYP-[A-Z0-9-]+/);
  return match ? match[0] : s;
};

const formatTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export default function EventParticipants() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [checkingId, setCheckingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const [ev, regs] = await Promise.all([
        getEventById(eventId).catch(() => null),
        getRegistrationsByEventId(eventId),
      ]);
      setEvent(ev?.data || ev || null);
      setParticipants(Array.isArray(regs) ? regs : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const arrivedCount = participants.filter((p) => p.arrived).length;

  const filtered = participants.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      [p.fullName, p.userName, p.email, p.phone, p.ticketCode, p.note]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ARRIVED" && p.arrived) ||
      (statusFilter === "REGISTERED" && !p.arrived);
    return matchSearch && matchStatus;
  });

  const handleScan = async (rawText) => {
    const ticketCode = extractTicketCode(rawText);
    if (!ticketCode) {
      setMessage({ type: "error", text: "No ticket code found in the QR. Try again." });
      return;
    }
    await checkIn(ticketCode);
    setScannerOpen(false);
  };

  const checkIn = async (ticketCode) => {
    setCheckingId("scan");
    setMessage(null);
    try {
      const updated = await checkInRegistration(ticketCode);
      setParticipants((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      const name = updated.fullName || updated.userName || "Attendee";
      setMessage({
        type: "success",
        text: `${name} checked in successfully.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Check-in failed.",
      });
    } finally {
      setCheckingId(null);
    }
  };

  const checkInById = async (p) => {
    setCheckingId(p.id);
    setMessage(null);
    try {
      const updated = await checkInRegistration(p.ticketCode);
      setParticipants((prev) =>
        prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
      );
      setMessage({
        type: "success",
        text: `${updated.fullName || updated.userName || "Attendee"} checked in successfully.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Check-in failed.",
      });
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="hidden print:block">
        <h1 className="text-xl font-bold text-slate-900">
          {event?.title || "Event Participants"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Participant list · generated {new Date().toLocaleString("en-GB")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to events
          </button>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            {event?.title || "Event Participants"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {participants.length} registered · {arrivedCount} arrived
            {search.trim() || statusFilter !== "ALL"
              ? ` · ${filtered.length} shown`
              : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setScannerOpen(true);
            setMessage(null);
          }}
          disabled={checkingId === "scan"}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
        >
          {checkingId === "scan" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ScanLine className="w-4 h-4" />
          )}
          Scan Ticket QR
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, ticket code..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer appearance-none"
            >
              <option value="ALL">All statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="ARRIVED">Arrived</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToExcel(filtered, event?.title)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={() => exportToPdf(filtered, event?.title)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={() => window.print()}
            disabled={participants.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-600 hover:bg-slate-700 active:scale-[0.98] text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Print list"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium print:hidden ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <span className="w-4 h-4 shrink-0 text-center">!</span>
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No registrations yet</p>
            <p className="text-xs text-slate-400 mt-1">
              When students register, they'll show up here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              No matching participants
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try a different search term or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Attendee</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Ticket</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {(p.fullName || p.userName || "?").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {p.fullName || p.userName || "Unknown"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.note || "Registered attendee"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      {p.email && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email}
                        </p>
                      )}
                      {p.phone && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-indigo-600 font-semibold">
                        <Ticket className="w-3.5 h-3.5 text-indigo-400" /> {p.ticketCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      {p.arrived ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Arrived
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {formatTime(p.checkedInAt)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600">
                          Registered
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right print:hidden">
                      {!p.arrived && (
                        <button
                          onClick={() => checkInById(p)}
                          disabled={checkingId === p.id || checkingId === "scan"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50"
                        >
                          {checkingId === p.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                          Mark arrived
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EventQrScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
}