import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Ticket,
  Loader2,
  CheckCircle2,
  UserCheck,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  getRegistrationByTicketCode,
  checkInRegistration,
} from "@/service/eventRegistrationApi";

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export default function TicketCheckIn() {
  const { ticketCode } = useParams();
  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRegistrationByTicketCode(ticketCode);
      setReg(data?.data || data || null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Ticket not found. Please check the code."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketCode]);

  const handleArrival = async () => {
    if (!reg?.ticketCode) return;
    setCheckingIn(true);
    try {
      const updated = await checkInRegistration(reg.ticketCode);
      setReg(updated?.data || updated);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Check-in failed. Please try again."
      );
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Looking up your ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !reg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm border border-slate-100 p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h1 className="text-base font-bold text-slate-900">Ticket not found</h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{error}</p>
          <Link
            to="/events"
            className="mt-5 inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const arrived = reg.arrived;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
            FindYourPath Event Ticket
          </p>
          <h1 className="text-lg font-bold text-white mt-1 truncate">
            {reg.eventTitle || "Event Registration"}
          </h1>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-bold shrink-0">
              {(reg.fullName || reg.userName || "?").substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">
                {reg.fullName || reg.userName || "Unknown"}
              </p>
              <p className="text-xs text-slate-400 truncate">{reg.email || reg.phone || ""}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Ticket Code
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-indigo-600">
                {reg.ticketCode}
              </p>
            </div>
            <Ticket className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{reg.note || "Please show this ticket at the registration desk."}</span>
          </div>

          <div className="mt-6">
            {arrived ? (
              <div className="text-center bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-base font-bold text-emerald-700">You're checked in!</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Joined the event at {fmtDateTime(reg.checkedInAt)}. Enjoy the event!
                </p>
              </div>
            ) : (
              <button
                onClick={handleArrival}
                disabled={checkingIn}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {checkingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Confirm My Arrival
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/events"
              className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition"
            >
              Go back to events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}