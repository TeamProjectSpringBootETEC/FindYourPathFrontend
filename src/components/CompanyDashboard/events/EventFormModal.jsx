import React, { useState, useEffect } from "react";
import { X, Loader2, CalendarDays } from "lucide-react";
import { createEvent, updateEvent, getAllEventCategories } from "@/service/eventApi";
import { useCompany } from "../CompanyLayout";

const inputClass =
  "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";
const labelClass = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";
const FORMAT_OPTIONS = ["In-person", "Virtual", "Hybrid"];
const STATUS_OPTIONS = ["active", "draft", "closed", "cancelled"];

const initialForm = {
  title: "",
  categoryId: "",
  description: "",
  eventType: "In-person",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  registrationDeadline: "",
  maxParticipants: "",
  fee: "",
  status: "active",
};

export default function EventFormModal({ open, onClose, event, onSaved }) {
  const { companyId } = useCompany();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllEventCategories()
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        categoryId: String(event.categoryId || event.category_id || ""),
        description: event.description || "",
        eventType: event.eventType || event.event_type || "In-person",
        eventDate: (event.eventDate || event.event_date || "").slice(0, 10),
        startTime: (event.startTime || event.start_time || "").slice(0, 5),
        endTime: (event.endTime || event.end_time || "").slice(0, 5),
        location: event.location || "",
        registrationDeadline: (event.registrationDeadline || event.registration_deadline || "").slice(0, 10),
        maxParticipants: String(event.maxParticipants || event.max_participants || ""),
        fee: event.fee != null ? String(event.fee) : "",
        status: event.status || "active",
      });
    } else {
      setForm(initialForm);
    }
  }, [event, open]);

  if (!open) return null;

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.categoryId) return;
    if (!companyId) {
      setError("Please set up your company profile before creating an event.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        companyId,
        categoryId: Number(form.categoryId),
        title: form.title.trim(),
        description: form.description.trim() || null,
        eventType: form.eventType,
        eventDate: form.eventDate || null,
        startTime: form.startTime ? `${form.startTime}:00` : null,
        endTime: form.endTime ? `${form.endTime}:00` : null,
        location: form.location.trim() || null,
        registrationDeadline: form.registrationDeadline || null,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null,
        fee: form.fee !== "" && form.fee != null ? Number(form.fee) : 0,
        status: form.status,
      };
      if (event?.id) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {event ? "Edit Event" : "Create an Event"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={labelClass}>Event Title *</label>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleInput}
              className={inputClass}
              placeholder="e.g. Tech Career Fair 2026"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Event Category *</label>
              <select
                required
                name="categoryId"
                value={form.categoryId}
                onChange={handleInput}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Event Type</label>
              <select name="eventType" value={form.eventType} onChange={handleInput} className={inputClass}>
                <option value="">Select event type</option>
                {FORMAT_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                {form.eventType && !FORMAT_OPTIONS.includes(form.eventType) && (
                  <option value={form.eventType}>{form.eventType}</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              rows="3"
              className={inputClass}
              placeholder="What is this event about?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Event Date</label>
              <input name="eventDate" type="date" value={form.eventDate} onChange={handleInput} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Start Time</label>
              <input name="startTime" type="time" value={form.startTime} onChange={handleInput} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input name="endTime" type="time" value={form.endTime} onChange={handleInput} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input name="location" value={form.location} onChange={handleInput} className={inputClass} placeholder="Phnom Penh" />
            </div>
            <div>
              <label className={labelClass}>Max Participants</label>
              <input name="maxParticipants" type="number" min="1" value={form.maxParticipants} onChange={handleInput} className={inputClass} placeholder="e.g. 200" />
            </div>
            <div>
              <label className={labelClass}>Registration Deadline</label>
              <input name="registrationDeadline" type="date" value={form.registrationDeadline} onChange={handleInput} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleInput} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fee (USD, 0 = Free)</label>
              <input name="fee" type="number" min="0" step="0.01" value={form.fee} onChange={handleInput} className={inputClass} placeholder="e.g. 10.00" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {error && (
              <p className="mr-auto text-xs font-semibold text-rose-600">{error}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !companyId}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
              {event ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}