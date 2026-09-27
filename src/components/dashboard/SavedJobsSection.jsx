import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Briefcase, Calendar, Clock, Trash2, ArrowUpRight } from "lucide-react";
import { getSavedJobsByStudent, deleteSavedJob } from "@/service/savedJobApi";
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

export default function SavedJobsSection({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const loadItems = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getSavedJobsByStudent(userId);
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Failed to load saved jobs:", err);
      setError("Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleRemove = async (rec) => {
    if (!(await confirmDialog({ message: `Remove "${rec.jobTitle}" from saved jobs?`, confirmLabel: "Confirm", cancelLabel: "Cancel" }))) return;
    try {
      setRemovingId(rec.id);
      await deleteSavedJob(rec.id);
      setItems((prev) => prev.filter((item) => item.id !== rec.id));
    } catch (err) {
      console.error("Failed to remove saved job:", err);
      toast.error("Failed to remove saved job.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <Bookmark className="h-4 w-4 text-indigo-600" /> Saved Jobs
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
          <Bookmark className="mx-auto h-10 w-10 text-slate-200" />
          <p className="mt-3 text-sm font-medium text-slate-500">No saved jobs yet.</p>
          <p className="text-xs text-slate-400">
            Browse jobs and tap the bookmark icon to save them for later.
          </p>
          <Link
            to="/job"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((rec) => (
            <li
              key={rec.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {rec.jobTitle || "Untitled Job"}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> Saved {fmtDate(rec.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(rec)}
                disabled={removingId === rec.id}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-colors hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"
                title="Remove from saved jobs"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link
                to={`/detail/${rec.jobId}`}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600"
                aria-label="View job"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}