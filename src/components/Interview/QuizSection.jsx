import { ClipboardCheck } from "lucide-react";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function QuizSection({ questions, values = {}, onChange }) {
  if (!questions?.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <ClipboardCheck size={18} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Section 1 · Multiple-Choice Quiz</h2>
          <p className="text-xs text-slate-400">Choose the best answer for each question.</p>
        </div>
      </div>

      <div className="space-y-5 mt-5">
        {questions.map((q, index) => (
          <div key={q.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              <span className="text-indigo-500 font-bold mr-1.5">Q{index + 1}.</span>
              {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options?.map((option, i) => {
                const selected = values[q.id] === option;
                return (
                  <label
                    key={option}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 cursor-pointer transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${q.id}`}
                      className="sr-only"
                      checked={selected}
                      onChange={() => onChange(q.id, option)}
                    />
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {OPTION_LETTERS[i] || i + 1}
                    </span>
                    <span className="text-sm">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}