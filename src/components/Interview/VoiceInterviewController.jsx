import { useState, useRef } from "react";
import {
  Mic,
  Volume2,
  PlayCircle,
  StopCircle,
  SkipForward,
  AlertCircle,
} from "lucide-react";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "km-KH", label: "Khmer (ខ្មែរ)" },
];

const canVoice = () =>
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition) &&
  window.speechSynthesis;

export default function VoiceInterviewController({ questions, values, onChange }) {
  const [lang, setLang] = useState("en-US");
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const alive = useRef(true);
  const indexRef = useRef(0);
  const speechRef = useRef(null);

  if (!questions?.length) return null;

  const voiceSupported = canVoice();
  const current = questions[index];
  const answered = questions.filter((q) => (values[q.id] || "").trim().length > 0).length;

  const stopAll = () => {
    alive.current = false;
    window.speechSynthesis?.cancel();
    speechRef.current?.stop();
    setRunning(false);
    setPhase("idle");
  };

  const listenFor = (questionId, i) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    speechRef.current = recognition;
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.onstart = () => setPhase("listening");
    recognition.onresult = (event) => {
      let text = "";
      for (let k = 0; k < event.results.length; k++) text += event.results[k][0].transcript;
      setTranscript(text.trim());
      onChange(questionId, text.trim());
    };
    recognition.onerror = (e) => {
      if (e.error === "not-allowed") {
        setError("Microphone permission denied — allow mic access and try again.");
        stopAll();
      }
    };
    recognition.onend = () => {
      setTimeout(() => {
        if (!alive.current) return;
        if (i + 1 < questions.length) askFor(i + 1);
        else {
          stopAll();
        }
      }, 800);
    };
    recognition.start();
  };

  const askFor = (i) => {
    if (!alive.current) return;
    indexRef.current = i;
    setIndex(i);
    setTranscript("");
    const utterance = new SpeechSynthesisUtterance(questions[i].question);
    utterance.lang = lang;
    utterance.onstart = () => setPhase("speaking");
    utterance.onend = () => alive.current && listenFor(questions[i].id, i);
    utterance.onerror = () => alive.current && listenFor(questions[i].id, i);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const start = () => {
    setError("");
    setRunning(true);
    alive.current = true;
    askFor(0);
  };

  const skip = () => {
    const next = indexRef.current + 1;
    if (next < questions.length) askFor(next);
    else stopAll();
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Volume2 size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Voice Interview</h2>
            <p className="text-xs text-slate-400">
              Hands-free mode — the AI reads each question aloud, listens, and moves on by itself.
            </p>
          </div>
        </div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          aria-label="Voice interview language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {!voiceSupported && (
        <p className="mt-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 px-4 py-3 flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-amber-500" />
          Automated voice requires Chrome or Edge (mic + speech). Use the manual "Speak" button instead.
        </p>
      )}

      {running ? (
        <div className="mt-5">
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-amber-600 font-bold mr-1.5">Q{index + 1}</span>
                {current.question}
              </p>
              <button
                type="button"
                onClick={skip}
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition shrink-0"
                title="Skip to next question"
              >
                <SkipForward size={17} />
              </button>
            </div>
            <p className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold uppercase tracking-wide text-amber-600">
              {phase === "speaking" ? (
                <>
                  <Volume2 size={14} className="animate-pulse" /> AI is asking…
                </>
              ) : (
                <>
                  <Mic size={14} className="animate-pulse" /> Listening — answer aloud…
                </>
              )}
            </p>
            {transcript && (
              <p className="mt-2 text-sm text-slate-600 italic">“{transcript}”</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                {answered}/{questions.length} answered
              </span>
            </div>
            <button
              onClick={stopAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
            >
              <StopCircle size={15} /> End Voice Session
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 max-w-sm">
              3 questions ahead: the AI will read each one, recognize your spoken answer, and
              auto-advance. You can stop or skip anytime.
            </p>
            <button
              onClick={start}
              disabled={!voiceSupported}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-100 transition disabled:opacity-50"
            >
              <PlayCircle size={16} /> Start Voice Interview
            </button>
          </div>
          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}