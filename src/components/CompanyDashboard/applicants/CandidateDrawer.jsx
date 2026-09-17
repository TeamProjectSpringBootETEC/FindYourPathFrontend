import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Link2,
  FileDown,
  Briefcase,
  BookOpen,
  History,
} from "lucide-react";
import { getStudentProfileById } from "@/service/studentProfileApi";
import {
  updateApplicationStatus,
  getStatusHistories,
} from "@/service/applicationApi";
import { applicationBadge, formatDateTime } from "../helpers";

const STATUS_STEPS = ["pending", "reviewing", "shortlisted", "accepted", "rejected"];

export default function CandidateDrawer({ app, onClose, onStatusUpdated }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (app.studentProfileId) {
      getStudentProfileById(app.studentProfileId)
        .then((d) => active && setProfile(d))
        .catch(() => {});
    }
    getStatusHistories(app.id)
      .then((d) => active && setHistory(Array.isArray(d) ? d : []))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [app.id, app.studentProfileId]);

  const changeStatus = async (status) => {
    if (status === (app.status || "").toLowerCase()) return;
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await updateApplicationStatus(app.id, status, user?.id);
      const updated = { ...app, status };
      onStatusUpdated?.(updated);
      const h = await getStatusHistories(app.id).catch(() => []);
      setHistory(Array.isArray(h) ? h : []);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Candidate Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {app.jobTitle || "Job application"} · Applied {formatDateTime(app.appliedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
              {(app.studentName || "?").substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900">{app.studentName || "Unknown"}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{app.studentEmail || "—"}</span>
                {profile?.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>}
                {profile?.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.address}</span>}
              </div>
            </div>
          </div>

          {app.aiScore != null && (
            <div className={`rounded-2xl border p-4 ${app.aiDecision === "SHORTLISTED" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Match Assessment</p>
              <div className="flex items-center gap-3 mt-2">
                <div className={`text-2xl font-bold ${app.aiDecision === "SHORTLISTED" ? "text-emerald-600" : "text-rose-600"}`}>
                  {app.aiScore}/100
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${app.aiDecision === "SHORTLISTED" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {app.aiDecision}
                </span>
              </div>
              {app.aiSummary && <p className="text-xs text-slate-600 mt-2">{app.aiSummary}</p>}
              {app.aiAssessedAt && <p className="text-[11px] text-slate-400 mt-1.5">Assessed {formatDateTime(app.aiAssessedAt)}</p>}
            </div>
          )}

          {profile?.bio && (
            <div>
              <SectionTitle>Bio</SectionTitle>
              <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div>
            <SectionTitle icon={GraduationCap}>Academic Info</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="University" value={profile?.universityName || app.educations?.[0]?.universityName || "—"} />
              <InfoTile label="Major" value={profile?.major || app.educations?.[0]?.major || "—"} />
              <InfoTile label="GPA" value={app.studentGpa != null ? Number(app.studentGpa).toFixed(2) : "—"} />
              {profile?.graduationYear != null && (
                <InfoTile label="Graduation Year" value={String(profile.graduationYear)} />
              )}
            </div>
          </div>

          <div>
            <SectionTitle icon={Briefcase}>Experience</SectionTitle>
            {app.experiences?.length ? (
              <div className="space-y-2.5">
                {app.experiences.map((exp) => (
                  <div key={exp.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{exp.position}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{exp.companyName}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{exp.startDate || "—"} → {exp.endDate || "Present"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No work experience listed.</p>
            )}
          </div>

          <div>
            <SectionTitle icon={BookOpen}>Education</SectionTitle>
            {app.educations?.length ? (
              <div className="space-y-2.5">
                {app.educations.map((edu) => (
                  <div key={edu.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{edu.universityName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.degree} · {edu.major}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{edu.startYear || "—"} – {edu.graduationYear || "Present"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No education history listed.</p>
            )}
          </div>

          {(profile?.cv || profile?.portfolio_url) && (
            <div>
              <SectionTitle icon={FileDown}>Documents</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {profile?.cv && (
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    <FileDown className="w-4 h-4" /> Download CV / Resume
                  </a>
                )}
                {profile?.portfolio_url && (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    <Link2 className="w-4 h-4" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Update Application Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_STEPS.map((s) => {
                const isCurrent = (app.status || "").toLowerCase() === s;
                const disabled = saving;
                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => changeStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize border transition ${
                      isCurrent
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    } disabled:opacity-50`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                Current:{" "}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${applicationBadge(app.status)}`}>
                  {app.status || "pending"}
                </span>
              </span>
              {saving && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Status History
              </label>
              <div className="space-y-1.5">
                {[...history].reverse().map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${applicationBadge(h.status)}`}>
                      {h.status}
                    </span>
                    <span className="text-slate-400">{formatDateTime(h.createdAt)} by {h.changedByUserName || "–"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
      {children}
    </p>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}