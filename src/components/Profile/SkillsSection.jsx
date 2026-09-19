import React, { useState, useEffect } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import {
  getStudentSkillsByStudent,
  createStudentSkill,
  deleteStudentSkill,
} from "@/service/studentSkillApi";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

export default function SkillsSection({ studentProfileId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getStudentSkillsByStudent(studentProfileId));
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [studentProfileId]);

  const close = () => {
    setAdding(false);
    setSkillName("");
    setActionError(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = skillName.trim();
    if (!name) return;
    setSaving(true);
    setActionError(null);
    try {
      await createStudentSkill(studentProfileId, { skillName: name });
      close();
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to add skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteStudentSkill(id);
    await load();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
        <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> My Skills
        </h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <>
          {adding && (
            <form onSubmit={handleAdd} className="mb-4 p-4 border border-blue-100 bg-blue-50/30 rounded-2xl space-y-4">
              {actionError && <p className="text-xs text-red-600">{actionError}</p>}
              <input
                className={inputCls}
                placeholder="e.g. Java, React, English"
                required
                autoFocus
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Adding..." : "Add Skill"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {items.length === 0 && !adding && (
            <p className="text-sm text-gray-500">No skills yet. Upload and scan a CV from a job application to extract your skills automatically.</p>
          )}

          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className="group inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 text-sm font-semibold text-indigo-700"
              >
                {item.skillName}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-indigo-400 hover:text-red-500 transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}