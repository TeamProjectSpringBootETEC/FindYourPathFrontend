import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { scanCv } from "@/service/applicationApi";

export default function CvUploadStep({ onScanned, onSkip, onFileSelected }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0] || null;
    setFile(picked);
    setStatus(null);
    onFileSelected?.(picked);
  };

  const handleScan = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Choose a CV file first." });
      return;
    }
    setScanning(true);
    setStatus({ type: "loading", message: "Scanning CV with AI... this may take a moment." });
    try {
      const body = await scanCv(file);
      if (!body.success) throw new Error(body.message || "Failed to scan CV");
      onScanned(body.data || {});
      setStatus({
        type: "success",
        message: "CV scanned! The form has been auto-filled — review each page and continue.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.message || "Scan failed. Try a PDF or text CV.",
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !scanning && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          file ? "border-green-300 bg-green-50/50" : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.text,application/pdf,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </span>
            <p className="text-sm font-semibold text-gray-900 break-all max-w-md">{file.name}</p>
            <p className="text-xs text-gray-500">Click to choose a different file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-blue-600" />
            </span>
            <p className="text-sm font-semibold text-gray-900">Upload your CV</p>
            <p className="text-xs text-gray-500">
              PDF or text file — the content will be read and auto-filled into the form
            </p>
          </div>
        )}
      </div>

      {status && (
        <div
          className={`text-sm rounded-xl px-4 py-3 ${
            status.type === "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : status.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-sky-50 border border-sky-200 text-sky-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Scanning CV...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Scan with AI
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          Fill manually <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}