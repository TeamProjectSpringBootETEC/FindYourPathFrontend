import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  CalendarDays,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getStudentProfileById } from "@/service/studentProfileApi";
import { getInterviewByApplication, inviteCandidate } from "@/service/interviewApi";
import {
  updateApplicationStatus,
  getStatusHistories,
} from "@/service/applicationApi";
import { applicationBadge, formatDateTime } from "../helpers";
import InterviewReportCard from "./InterviewReportCard";

const STATUS_STEPS = ["pending", "reviewing", "shortlisted", "accepted", "rejected"];

const STATUS_BUTTON = {
  pending: {
    active: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100",
    dot: "bg-amber-500",
  },
  reviewing: {
    active: "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100",
    dot: "bg-blue-500",
  },
  shortlisted: {
    active: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100",
    dot: "bg-indigo-600",
  },
  accepted: {
    active: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100",
    dot: "bg-emerald-500",
  },
  rejected: {
    active: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100",
    dot: "bg-rose-500",
  },
};

export default function CandidateDetailModal({ app, onClose, onStatusUpdated }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [interview, setInterview] = useState(null);
  const [inviting, setInviting] = useState(false);

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
    getInterviewByApplication(app.id)
      .then((d) => active && setInterview(d))
      .catch(() => {}); // No interview yet = not invited
    return () => {
      active = false;
    };
  }, [app.id, app.studentProfileId]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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

  const isGood = app.aiDecision === "SHORTLISTED";

  const startMockInterview = async () => {
    setInviting(true);
    try {
      const created = await inviteCandidate(app.id);
      setInterview(created);
    } catch (err) {
      console.error("Failed to invite candidate:", err);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] border border-slate-100"
      >
        {/* Header hero */}
        <div className="px-7 py-6 rounded-t-3xl bg-gradient-to-r from-indigo-50 via-slate-50 to-slate-50 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                to={`/student/${app.studentProfileId}`}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-lg shadow-indigo-200 hover:ring-4 hover:ring-indigo-100 transition"
                title="View full profile"
              >
                {(app.studentName || "?").substring(0, 2).toUpperCase()}
              </Link>
              <div className="min-w-0">
                <Link
                  to={`/student/${app.studentProfileId}`}
                  className="text-xl font-bold text-slate-900 leading-tight truncate hover:text-indigo-600 transition"
                >
                  {app.studentName || "Unknown Candidate"}
                </Link>
                <p className="text-sm text-indigo-600 font-medium mt-0.5 truncate">
                  {app.jobTitle || "Job application"}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  {app.studentEmail && (
                    <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{app.studentEmail}</span>
                  )}
                  {profile?.phone && (
                    <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{profile.phone}</span>
                  )}
                  {profile?.address && (
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{profile.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5" /> Applied {formatDateTime(app.appliedAt)}
                </p>
              </div>
              {(app.cvUrl || profile?.cv) && (
                <a
                  href={app.cvUrl || profile?.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition"
                  title="Download CV"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileDown className="w-4 h-4" /> CV
                </a>
              )}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${applicationBadge(app.status)}`}>
                {app.status || "pending"}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/70 rounded-xl transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          {/* AI Match Assessment */}
          {app.aiScore != null && (
            <div className={`rounded-2xl border p-5 ${isGood ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${isGood ? "text-emerald-700" : "text-rose-700"}`}>
                  <Sparkles className="w-4 h-4" /> AI Match Assessment
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${isGood ? "text-emerald-600" : "text-rose-600"}`}>
                    {app.aiScore}/100
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${isGood ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {app.aiDecision}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/70 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isGood ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(app.aiScore, 100)}%` }}
                />
              </div>
              {app.aiSummary && <p className="text-sm text-slate-600 mt-3 leading-relaxed">{app.aiSummary}</p>}
              {app.aiAssessedAt && <p className="text-[11px] text-slate-400 mt-2">Assessed {formatDateTime(app.aiAssessedAt)}</p>}
            </div>
          )}

          {/* AI Mock Interview */}
          {interview ? (
            <InterviewReportCard
              interview={interview}
              onResultUpdated={setInterview}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50/30 p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                  <Sparkles className="w-4 h-4" /> AI Mock Interview
                </p>
                <button
                  onClick={startMockInterview}
                  disabled={inviting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-100 transition disabled:opacity-50"
                >
                  {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {inviting ? "Inviting…" : "Start Mock Interview"}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Send an AI interview invitation to this candidate. They'll answer a quiz + oral
                questions and receive a Gemini-scored report right here.
              </p>
            </div>
          )}

          {profile?.bio && (
            <div>
              <SectionTitle icon={UserRound}>Bio</SectionTitle>
              <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <SectionTitle icon={Briefcase}>Experience</SectionTitle>
                {app.experiences?.length ? (
                  <div className="space-y-3">
                    {app.experiences.map((exp) => (
                      <div key={exp.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <p className="text-sm font-semibold text-slate-800">{exp.position}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{exp.companyName}</p>
                        <p className="text-[11px] text-slate-400 mt-1.5 inline-flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />{exp.startDate || "—"} → {exp.endDate || "Present"}
                        </p>
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
                  <div className="space-y-3">
                    {app.educations.map((edu) => (
                      <div key={edu.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <p className="text-sm font-semibold text-slate-800">{edu.universityName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{edu.degree} · {edu.major}</p>
                        <p className="text-[11px] text-slate-400 mt-1.5 inline-flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />{edu.startYear || "—"} – {edu.graduationYear || "Present"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No education history listed.</p>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
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
                <SectionTitle icon={FileDown}>Documents</SectionTitle>
                <div className="flex flex-col gap-2.5">
                  {app.cvUrl && (
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-indigo-100"
                    >
                      <FileDown className="w-4 h-4" /> Download Application CV
                    </a>
                  )}
                  {profile?.cv && profile.cv !== app.cvUrl && (
                    <a
                      href={profile.cv}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      <FileDown className="w-4 h-4" /> Profile CV
                    </a>
                  )}
                  {!app.cvUrl && !profile?.cv && (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-400">
                      No CV submitted with this application.
                    </p>
                  )}
                  {profile?.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      <Link2 className="w-4 h-4" /> View Portfolio
                    </a>
                  )}
                </div>
              </div>

              {history.length > 0 && (
                <div>
                  <SectionTitle icon={History}>Status History</SectionTitle>
                  <div className="space-y-0">
                    {[...history].reverse().map((h, i, arr) => (
                      <div key={h.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${STATUS_BUTTON[h.status]?.dot || "bg-slate-400"}`} />
                          {i < arr.length - 1 && <span className="w-px flex-1 bg-slate-200 my-0.5" />}
                        </div>
                        <div className={`pb-4 ${i === arr.length - 1 ? "" : ""}`}>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${applicationBadge(h.status)}`}>
                            {h.status}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {formatDateTime(h.createdAt)} by {h.changedByUserName || "–"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Update status */}
        <div className="border-t border-slate-100 px-7 py-5 bg-slate-50/50 rounded-b-3xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Update Application Status
            </label>
            {saving && (
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {STATUS_STEPS.map((s) => {
              const isCurrent = (app.status || "").toLowerCase() === s;
              return (
                <button
                  key={s}
                  disabled={saving}
                  onClick={() => changeStatus(s)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold capitalize border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrent ? STATUS_BUTTON[s].active : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {!isCurrent && <span className={`w-1.5 h-1.5 rounded-full ${STATUS_BUTTON[s].dot}`} />}
                  {s}
                </button>
              );
            })}
          </div>
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
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}