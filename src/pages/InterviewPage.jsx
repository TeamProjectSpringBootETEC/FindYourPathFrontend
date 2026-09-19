import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Mic2, Send, AlertCircle } from "lucide-react";
import { getInterview, submitInterviewAnswers } from "@/service/interviewApi";
import QuizSection from "@/components/Interview/QuizSection";
import OralSection from "@/components/Interview/OralSection";
import VoiceInterviewController from "@/components/Interview/VoiceInterviewController";
import InterviewResultCard from "@/components/Interview/InterviewResultCard";

export default function InterviewPage() {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getInterview(interviewId)
      .then((data) => {
        if (!active) return;
        setInterview(data);
        if (data?.questions?.length) {
          const opts = {};
          data.questions.forEach((q) => {
            const saved = data.answers?.find((a) => a.questionId === q.id);
            if (saved) opts[q.id] = saved.answer;
          });
          setValues(opts);
        }
      })
      .catch((err) => {
        if (active) {
          const status = err.response?.status;
          const msg =
            status === 429
              ? "The AI is busy (rate limit). Please wait a moment, then try again."
              : err.response?.data?.message || "Failed to load the interview.";
          setError(msg);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [interviewId, reloadKey]);

  const isDone = ["COMPLETED", "PASSED", "FAILED"].includes(interview?.status);

  const handleSubmit = async () => {
    const missing = interview.questions
      .filter((q) => !values[q.id] || !values[q.id].trim())
      .map((q) => q.id);
    if (missing.length) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const updated = await submitInterviewAnswers(
        interviewId,
        interview.questions.map((q) => ({
          questionId: q.id,
          answer: values[q.id].trim(),
        }))
      );
      setInterview(updated);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err.response?.status === 429
          ? "The AI is busy scoring (rate limit). Please wait a moment and submit again."
          : err.response?.data?.message || "Failed to submit your answers. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm">Preparing your interview…</p>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <p className="text-sm text-slate-600 max-w-md text-center">{error}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setInterview(null);
              setLoading(true);
              setError("");
              setReloadKey((k) => k + 1);
            }}
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 py-2.5 transition"
          >
            Try Again
          </button>
          <Link to="/notifications" className="text-sm font-semibold text-indigo-600 hover:underline">
            Back to notifications
          </Link>
        </div>
      </div>
    );
  }

  const quizQuestions = interview.questions?.filter((q) => q.type === "QUIZ") || [];
  const oralQuestions = interview.questions?.filter((q) => q.type === "ORAL") || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 shadow-lg shadow-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Mic2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Mock Interview</h1>
              <p className="text-sm text-indigo-100">
                {interview.jobTitle} · {interview.companyName}
              </p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              {interview.status === "IN_PROGRESS" || interview.status === "PENDING"
                ? "In Progress"
                : interview.status}
            </span>
          </div>
        </header>

        {isDone ? (
          <InterviewResultCard interview={interview} />
        ) : (
          <>
            <QuizSection questions={quizQuestions} values={values} onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))} />
            <VoiceInterviewController questions={oralQuestions} values={values} onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))} />
            <OralSection questions={oralQuestions} values={values} onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))} />

            {error && (
              <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Scoring with AI…" : "Submit All Answers"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}