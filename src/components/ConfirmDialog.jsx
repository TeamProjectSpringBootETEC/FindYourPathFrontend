import { toast } from "react-hot-toast";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

function buildConfirmMessage({
  title,
  message,
  resolve,
  confirmLabel,
  cancelLabel,
  danger,
}) {
  const cls = danger
    ? "bg-rose-600 text-white hover:bg-rose-700"
    : "bg-indigo-600 text-white hover:bg-indigo-700";
  return (t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            danger ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          {danger ? (
            <AlertTriangle className="h-4.5 w-4.5" />
          ) : (
            <CheckCircle2 className="h-4.5 w-4.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          {message && (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            resolve(false);
          }}
          className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            resolve(false);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            resolve(true);
          }}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${cls}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

const confirmDialog = ({
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
}) =>
  new Promise((resolve) => {
    toast.custom(buildConfirmMessage({ title, message, resolve, confirmLabel, cancelLabel, danger }), {
      duration: Infinity,
    });
  });

export default confirmDialog;
