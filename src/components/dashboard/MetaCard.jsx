import React from "react";
import { IdCard, ShieldCheck, CalendarDays, Building2, GraduationCap, Star } from "lucide-react";

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

export default function MetaCard({ user, profile }) {
  const tiles = [
    { icon: IdCard, label: "User ID", value: user?.id ?? "—" },
    { icon: ShieldCheck, label: "Role", value: user?.roleId === 1 ? "Student" : "Member" },
    { icon: CalendarDays, label: "Member Since", value: fmtDate(user?.createdAt) },
    { icon: Building2, label: "University", value: profile?.universityName || "Not set yet" },
    { icon: GraduationCap, label: "Major", value: profile?.major || "Not set yet" },
    { icon: Star, label: "GPA", value: profile?.gpa != null ? Number(profile.gpa).toFixed(2) : "Not set yet" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <IdCard className="h-4 w-4 text-indigo-600" /> User Record Info
        </h2>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Overview</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
            <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <Icon className="h-3 w-3 text-indigo-500" /> {label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-800" title={String(value)}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}