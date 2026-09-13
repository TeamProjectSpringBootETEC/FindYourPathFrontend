import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GraduationCap, School } from "lucide-react";
import {
  getEducationsByStudent,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/service/educationApi";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

function ItemForm({ initial, submitLabel, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState({
    universityName: initial?.universityName || "",
    degree: initial?.degree || "",
    major: initial?.major || "",
    startYear: initial?.startYear || "",
    graduationYear: initial?.graduationYear || "",
  });
  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(form); }}
      className="border border-blue-100 bg-blue-50/30 rounded-2xl p-4 space-y-4">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <input className={inputCls} placeholder="University Name *" required value={form.universityName} onChange={(e) => update("universityName", e.target.value)} />
        </div>
        <input className={inputCls} placeholder="Degree *" required value={form.degree} onChange={(e) => update("degree", e.target.value)} />
        <input className={inputCls} placeholder="Major *" required value={form.major} onChange={(e) => update("major", e.target.value)} />
        <input className={inputCls} type="number" min={1900} max={2100} placeholder="Start Year" value={form.startYear} onChange={(e) => update("startYear", e.target.value ? Number(e.target.value) : null)} />
        <input className={inputCls} type="number" min={1900} max={2100} placeholder="Graduation Year" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value ? Number(e.target.value) : null)} />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
      </div>
    </form>
  );
}

export default function EducationSection({ studentProfileId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await getEducationsByStudent(studentProfileId)); }
    catch { setError("Failed to load educations."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [studentProfileId]);

  const close = () => { setMode(null); setActionError(null); };

  const handleSave = async (data) => {
    setSaving(true); setActionError(null);
    try {
      if (mode?.id) await updateEducation(mode.id, data);
      else await createEducation(studentProfileId, data);
      close(); await load();
    } catch (err) { setActionError(err.response?.data?.message || "Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await deleteEducation(id); await load(); };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
        <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" /> Education
        </h2>
        {!mode && (
          <button onClick={() => setMode("add")} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <>
          {mode === "add" && (
            <div className="mb-4">
              <ItemForm submitLabel="Add Education" onSubmit={handleSave} onCancel={close} saving={saving} error={actionError} />
            </div>
          )}
          {items.length === 0 && !mode && <p className="text-sm text-gray-500">No education records added yet.</p>}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id}>
                {mode?.id === item.id ? (
                  <ItemForm initial={mode} submitLabel="Save Changes" onSubmit={handleSave} onCancel={close} saving={saving} error={actionError} />
                ) : (
                  <div className="flex items-start justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5"><School className="w-3.5 h-3.5 text-blue-600" /> {item.universityName}</p>
                      <p className="text-xs text-gray-600">{item.degree} — {item.major}</p>
                      {(item.startYear || item.graduationYear) && (
                        <p className="text-[11px] text-gray-400">{item.startYear || "?"} – {item.graduationYear || "Present"}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      <button onClick={() => setMode({ id: item.id, ...item })}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}