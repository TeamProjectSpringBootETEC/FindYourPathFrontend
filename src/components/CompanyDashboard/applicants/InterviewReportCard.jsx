import { useState } from "react";
import { Sparkles, ThumbsUp, AlertTriangle, CheckCircle2, XCircle, Loader2, Mic2 } from "lucide-react";
import { setInterviewResult } from "@/service/interviewApi";
import { interviewBadge, formatDateTime } from "../helpers";

export default function InterviewReportCard({ interview, onResultUpdated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!interview) return null;

  const score = Number(interview.aiScore) || 0;
  const isCompleted = interview.status === "COMPLETED";
  const isFinal = interview.status === "PASSED" || interview.status === "FAILED";
  const passed = interview.status === "PASSED";

  const saveResult = async (result) => {
    setSaving(true);
    setError("");
    try {
      const updated = await setInterviewResult(interview.id, result);
      onResultUpdated?.(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save the result.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
          <Mic2 className="w-4 h-4" /> AI Mock Interview
        </p>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${interviewBadge(interview.status)}`}>
          {interview.status || "PENDING"}
        </span>
      </div>

      {isCompleted || isFinal ? (
        <>
          <div className="flex items-center gap-4 mt-4">
            <span className={`text-3xl font-extrabold ${score >= 60 ? "text-emerald-600" : "text-rose-600"}`}>
              {score}/100
            </span>
            <div className="flex-1 h-2.5 rounded-full bg-white overflow-hidden">
              <div className={`h-full rounded-full ${score >= 60 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${interview.recommendation === "PASS" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {interview.recommendation || "—"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} /> Strengths
              </p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{interview.strengths || "—"}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={12} /> Weaknesses
              </p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{interview.weaknesses || "—"}</p>
            </div>
          </div>

          {interview.submittedAt && (
            <p className="text-[11px] text-slate-400 mt-3">Submitted {formatDateTime(interview.submittedAt)}</p>
          )}

          {isCompleted && (
            <>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-violet-100">
                <button
                  onClick={() => saveResult("PASSED")}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {saving ? "Saving…" : "Pass"}
                </button>
                <button
                  onClick={() => saveResult("FAILED")}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  <XCircle size={15} /> Fail
                </button>
              </div>
              {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
            </>
          )}

          {isFinal && (
            <p className={`text-xs font-semibold mt-3 ${passed ? "text-emerald-600" : "text-rose-600"}`}>
              {passed ? "Candidate passed the mock interview." : "Candidate failed the mock interview."}
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-slate-500 mt-3">
          <Sparkles className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-violet-500" />
          {interview.status === "PENDING"
            ? "Invitation sent — waiting for the candidate to join."
            : "The candidate is taking the interview now."}
        </p>
      )}
    </div>
  );
}