import { Link } from "react-router-dom";
import { Sparkles, ThumbsUp, AlertTriangle, BadgeCheck, XCircle } from "lucide-react";

const isPass = (interview) => {
  if (interview.status === "PASSED") return true;
  if (interview.status === "FAILED") return false;
  return (interview.recommendation || "").toUpperCase() === "PASS" || Number(interview.aiScore) >= 60;
};

const scoreColor = (score) => {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

const barColor = (score) => {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

export default function InterviewResultCard({ interview }) {
  const score = Number(interview.aiScore) || 0;
  const passed = isPass(interview);
  const finalStatus = interview.status === "PASSED" || interview.status === "FAILED";

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Your AI Interview Report</h2>
          <p className="text-xs text-slate-400">Scored by Gemini from your quiz & oral answers.</p>
        </div>
        {finalStatus && (
          <span className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {passed ? <BadgeCheck size={14} /> : <XCircle size={14} />}
            {interview.status}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5">
        <div className="text-center shrink-0">
          <p className={`text-4xl font-extrabold ${scoreColor(score)}`}>{score}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">/ 100</p>
        </div>
        <div className="flex-1 w-full">
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor(score)}`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Gemini recommendation:{" "}
            <span className={passed ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
              {(interview.recommendation || (passed ? "PASS" : "FAIL")).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className={`rounded-xl border p-4 ${passed ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <ThumbsUp size={13} /> Strengths
          </p>
          <p className="text-sm text-slate-700 mt-2 leading-relaxed">{interview.strengths || "—"}</p>
        </div>
        <div className="rounded-xl border p-4 bg-rose-50 border-rose-200">
          <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={13} /> Weaknesses
          </p>
          <p className="text-sm text-slate-700 mt-2 leading-relaxed">{interview.weaknesses || "—"}</p>
        </div>
      </div>

      {interview.answers?.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Your answers</p>
          <div className="space-y-2">
            {interview.answers.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <p className="text-xs text-slate-700 font-medium">{a.questionText}</p>
                <p className="text-xs text-slate-500 mt-1">{a.answer}</p>
                {a.type === "QUIZ" && (
                  <p className={`text-[11px] font-bold mt-1 ${a.isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                    {a.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {interview.status === "COMPLETED" && (
        <p className="text-[11px] text-slate-400 mt-5">
          Your result is now with the company — they will make the final decision.
          <Link to="/notifications" className="text-indigo-600 font-semibold ml-1">Back to notifications</Link>
        </p>
      )}
    </section>
  );
}