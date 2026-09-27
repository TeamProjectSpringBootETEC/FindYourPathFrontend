import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, Trash2, ArrowUpRight, Calendar, Ticket } from "lucide-react";
import {
  getRegistrationsByUserId,
  cancelRegistration,
} from "@/service/eventRegistrationApi";
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

const fmtDate = (iso) => {
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

export default function SavedEventsSection({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [showQrId, setShowQrId] = useState(null);

  const loadItems = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getRegistrationsByUserId(userId);
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Failed to load saved events:", err);
      setError("Failed to load saved events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleRemove = async (rec) => {
    if (!(await confirmDialog({ message: `Cancel registration for "${rec.eventTitle}"?`, confirmLabel: "Confirm", cancelLabel: "Cancel" }))) return;
    try {
      setRemovingId(rec.id);
      await cancelRegistration(rec.id);
      setItems((prev) => prev.filter((item) => item.id !== rec.id));
    } catch (err) {
      console.error("Failed to cancel registration:", err);
      toast.error("Failed to cancel registration.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <CalendarDays className="h-4 w-4 text-indigo-600" /> Saved Events
        </h2>
        {items.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            {items.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : items.length === 0 ? (
        <div className="py-10 text-center">
          <Calendar className="mx-auto h-10 w-10 text-slate-200" />
          <p className="mt-3 text-sm font-medium text-slate-500">No saved events yet.</p>
          <p className="text-xs text-slate-400">
            Browse events and tap the bookmark icon to save them.
          </p>
          <Link
            to="/events"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((rec) => (
            <li key={rec.id}>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {rec.eventTitle || "Untitled Event"}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Saved {fmtDate(rec.createdAt)}
                  </span>
                  {rec.paymentStatus && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        rec.paymentStatus === "PAID"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {rec.paymentStatus}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setShowQrId(showQrId === rec.id ? null : rec.id)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Ticket className="h-3 w-3" />
                  {showQrId === rec.id ? "Hide ticket" : "Show ticket QR"}
                </button>
              </div>
              <button
                onClick={() => handleRemove(rec)}
                disabled={removingId === rec.id}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-colors hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"
                title="Cancel registration"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link
                to={`/event/${rec.eventId}`}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600"
                aria-label="View event"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              </div>

              {showQrId === rec.id && (
                <div className="mt-2 flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 p-4">
                  <img
                    src={`http://localhost:8080/api/event-registrations/${rec.id}/qr`}
                    alt="Event QR code"
                    className="h-24 w-24 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Ticket Code</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-indigo-600">
                      {rec.ticketCode || "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Show this QR at the door to check in.
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}