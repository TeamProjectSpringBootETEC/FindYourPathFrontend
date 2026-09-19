import React, { useEffect, useRef, useState } from "react";
import { X, Camera, AlertTriangle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function EventQrScanner({ open, onClose, onScan }) {
  const [error, setError] = useState("");
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!open) return;

    const reader = new Html5Qrcode("event-qr-reader");
    let inactive = false;

    const stop = async () => {
      try {
        if (reader.isScanning) await reader.stop();
        reader.clear();
      } catch {
        /* ignore stop errors */
      }
    };

    (async () => {
      try {
        setError("");
        await reader.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (text) => {
            if (inactive) return;
            inactive = true;
            stop();
            onScanRef.current?.(text);
          },
          () => {}
        );
      } catch (err) {
        setError(
          err?.name === "NotAllowedError"
            ? "Camera permission was denied. Allow camera access and try again."
            : "Could not start the camera. Make sure no other app is using it."
        );
      }
    })();

    return () => {
      inactive = true;
      stop();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scan QR Code</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Point the camera at the attendee's ticket QR
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {error ? (
            <div className="py-10 text-center">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-medium">{error}</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square relative">
              <div id="event-qr-reader" className="w-full h-full" />
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2.5">
            <Camera className="w-4 h-4 text-indigo-500 shrink-0" />
            The scanner stops automatically after a successful scan.
          </div>
        </div>
      </div>
    </div>
  );
}