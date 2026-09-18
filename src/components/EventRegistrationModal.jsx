import React, { useState, useEffect } from "react";
import {
  X,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Loader2,
  Ticket,
  Mail,
} from "lucide-react";
import { createRegistration } from "@/service/eventRegistrationApi";

const QR_BASE = "http://localhost:8080/api/event-registrations";

export default function EventRegistrationModal({ event, user, onClose, onRegistered }) {
  const fee = Number(event?.fee || 0);
  const isPaid = fee > 0;

  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && step !== "done") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) return;
    if (isPaid) {
      setStep("payment");
      return;
    }
    await register();
  };

  const register = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createRegistration({
        userId: user.id,
        eventId: event.id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        note: form.note.trim() || null,
        paymentConfirmed: isPaid,
      });
      const data = created?.data || created;
      setResult(data);
      setStep("done");
      onRegistered?.(data);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Register for Event</h3>
          </div>
          {step !== "done" && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Event summary */}
        {step !== "done" && (
          <div className="px-6 py-3 bg-slate-50">
            <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 rounded-md text-white ${
                  isPaid ? "bg-amber-500" : "bg-emerald-500"
                }`}
              >
                {isPaid ? `$${fee.toFixed(2)}` : "FREE"}
              </span>
              <span className="text-[11px] text-slate-400">{event.location}</span>
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your full name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Your QR ticket will be sent to this email.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 012 345 678"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Note (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Anything the organizers should know"
                  rows={3}
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </span>
                ) : isPaid ? (
                  "Continue to Payment"
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">Simulated Payment</p>
                <p className="text-xs text-slate-500 mt-1">
                  This is an academic project, so no real card is charged.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
                <span className="text-sm text-slate-600">{event.title}</span>
                <span className="text-base font-bold text-slate-900">${fee.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStep("form")}
                  disabled={submitting}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={register}
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Paying...
                    </span>
                  ) : (
                    `Pay $${fee.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="mt-3 text-base font-bold text-slate-900">You're registered!</p>
              <p className="text-xs text-slate-500 mt-1">
                A confirmation email with your QR code was sent to{" "}
                <span className="font-semibold text-slate-700">{form.email.trim()}</span>.
              </p>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4">
                <p className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  <Ticket className="w-3 h-3" /> Ticket Code
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-indigo-600">
                  {result?.ticketCode || "—"}
                </p>
                <div className="mt-3 mx-auto w-40 h-40 bg-white p-2">
                  <img
                    src={`${QR_BASE}/${result?.id}/qr`}
                    alt="Event QR code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Show this QR code when you arrive to check in.
                </p>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <Mail className="w-3 h-3" /> Check your inbox (incl. spam) for the ticket email.
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}