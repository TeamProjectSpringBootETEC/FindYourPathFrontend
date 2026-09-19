import React, { useState, useEffect } from "react";
import { X, Users, Loader2, Trash2, Phone, Ticket, Mail } from "lucide-react";
import {
  getRegistrationsByEventId,
  cancelRegistration,
} from "@/service/eventRegistrationApi";

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export default function EventParticipantsModal({ event, onClose, onChanged }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await getRegistrationsByEventId(event.id);
      setParticipants(Array.isArray(d) ? d : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const remove = async (reg) => {
    if (!window.confirm("Remove this participant's registration?")) return;
    setRemovingId(reg.id);
    try {
      await cancelRegistration(reg.id);
      setParticipants((prev) => prev.filter((p) => p.id !== reg.id));
      onChanged?.();
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
              {participants.length} registered candidate{participants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {loading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Loading candidates...</p>
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
              <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {(p.fullName || p.userName || "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.fullName || p.userName || "Unknown"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Registered {formatDate(p.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.paymentStatus === "PAID"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {p.paymentStatus === "PAID"
                        ? `PAID $${Number(p.paymentAmount || 0).toFixed(2)}`
                        : "FREE"}
                    </span>
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
                </div>

                {(p.email || p.phone || p.note || p.ticketCode) && (
                  <div className="mt-2.5 pl-0.5 space-y-1 border-t border-slate-100 pt-2.5 text-xs">
                    {p.email && (
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email}
                      </p>
                    )}
                    {p.phone && (
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone}
                      </p>
                    )}
                    {p.note && (
                      <p className="text-slate-500 leading-relaxed">
                        <span className="font-semibold text-slate-400">Note:</span> {p.note}
                      </p>
                    )}
                    {p.ticketCode && (
                      <p className="flex items-center gap-1.5 font-mono text-indigo-600 font-semibold">
                        <Ticket className="w-3.5 h-3.5 text-indigo-400" /> {p.ticketCode}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}