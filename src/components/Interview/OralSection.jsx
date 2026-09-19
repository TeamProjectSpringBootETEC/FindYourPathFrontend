import { useState } from "react";
import { Mic, Volume2, MessageSquareText, Languages } from "lucide-react";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "km-KH", label: "Khmer (ខ្មែរ)" },
];

const isSpeechRecognitionSupported = () =>
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

// Placeholder Speech-to-Text: fills the answer from the Web Speech API when the
// browser supports it (works for both English and Khmer).
export default function OralSection({ questions, values = {}, onChange }) {
  const [lang, setLang] = useState("en-US");
  const [listening, setListening] = useState({});
  const supported = isSpeechRecognitionSupported();

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = (questionId) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.onstart = () => setListening((prev) => ({ ...prev, [questionId]: true }));
    recognition.onend = () => setListening((prev) => ({ ...prev, [questionId]: false }));
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(questionId, `${values[questionId] || ""}${transcript}`.trim());
    };
    recognition.onerror = () => {
      setListening((prev) => ({ ...prev, [questionId]: false }));
    };
    recognition.start();
  };

  if (!questions?.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <MessageSquareText size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Section 2 · AI Oral Questions</h2>
            <p className="text-xs text-slate-400">
              Answer aloud or type your response. Speech-to-text & text-to-speech support English and Khmer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Languages size={15} className="text-slate-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            aria-label="Oral answer language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-5 mt-5">
        {questions.map((q, index) => (
          <div key={q.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800 flex-1">
                <span className="text-rose-500 font-bold mr-1.5">Q{index + 1}.</span>
                {q.question}
              </p>
              <button
                type="button"
                onClick={() => speak(q.question)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                title="Read question aloud (Text-to-Speech)"
              >
                <Volume2 size={17} />
              </button>
            </div>

            <div className="relative mt-3">
              <textarea
                rows={4}
                value={values[q.id] || ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={supported ? "Type your answer or tap the mic to speak…" : "Type your answer…"}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition"
              />
              {supported && (
                <button
                  type="button"
                  onClick={() => startListening(q.id)}
                  className={`absolute bottom-3 right-3 p-2.5 rounded-xl text-white shadow-md transition flex items-center gap-1.5 text-xs font-semibold ${
                    listening[q.id] ? "bg-rose-600 animate-pulse" : "bg-slate-700 hover:bg-slate-800"
                  }`}
                  title="Speech-to-Text (English / Khmer)"
                >
                  <Mic size={15} />
                  {listening[q.id] ? "Listening…" : "Speak"}
                </button>
              )}
            </div>
            {!supported && (
              <p className="text-[11px] text-slate-400 mt-2">
                Speech-to-text isn't available in this browser — you can still type your answer.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}