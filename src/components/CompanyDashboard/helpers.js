const APPLICATION_STATUS = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  reviewing: "bg-blue-50 text-blue-700 border border-blue-200",
  shortlisted: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border border-rose-200",
  cancelled: "bg-slate-100 text-slate-500 border border-slate-200",
};

const JOB_STATUS = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  closed: "bg-slate-100 text-slate-500 border border-slate-200",
  draft: "bg-amber-50 text-amber-700 border border-amber-200",
};

const EVENT_STATUS = {
  draft: "bg-slate-100 text-slate-500 border border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  closed: "bg-slate-100 text-slate-500 border border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
};

export const statusStyle = (status, map) => {
  const key = String(status || "").toLowerCase();
  const styles = map || APPLICATION_STATUS;
  return styles[key] || "bg-slate-100 text-slate-500 border border-slate-200";
};

export const applicationBadge = (status) => statusStyle(status, APPLICATION_STATUS);
export const jobBadge = (status) => statusStyle(status, JOB_STATUS);
export const eventBadge = (status) => statusStyle(status, EVENT_STATUS);

export const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};