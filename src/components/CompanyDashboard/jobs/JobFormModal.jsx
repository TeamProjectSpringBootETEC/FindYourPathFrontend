import React, { useState, useEffect } from "react";
import { X, Loader2, Briefcase, Tag } from "lucide-react";
import { createJob, updateJob, getAllJobCategories } from "@/service/JobApi";
import { useCompany } from "../CompanyLayout";
import TagInput from "../tags/TagInput";
import SkillEditor from "../tags/SkillEditor";

const inputClass =
  "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";
const labelClass = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";
const TYPE_OPTIONS = ["Full-time", "Part-time", "Internship", "Contract"];
const EXP_OPTIONS = ["Entry-level", "Mid-level", "Senior", "Any"];
const WORK_OPTIONS = ["On-site", "Remote", "Hybrid"];
const STATUS_OPTIONS = ["active", "draft", "closed"];

const initialForm = {
  title: "",
  jobCategoryId: "",
  description: "",
  jobType: "Full-time",
  experienceLevel: "Any",
  workplaceType: "On-site",
  salary: "",
  location: "",
  deadline: "",
  status: "active",
};

export default function JobFormModal({ open, onClose, job, onSaved }) {
  const { companyId } = useCompany();
  const [form, setForm] = useState(initialForm);
  const [requirements, setRequirements] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllJobCategories()
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        jobCategoryId: String(job.jobCategoryId || ""),
        description: job.description || "",
        jobType: job.jobType || "Full-time",
        experienceLevel: job.experienceLevel || "Any",
        workplaceType: job.workplaceType || "On-site",
        salary: job.salary || "",
        location: job.location || "",
        deadline: (job.deadline || "").slice(0, 10),
        status: job.status || "active",
      });
      const reqs = Array.isArray(job.requirements) ? job.requirements : [];
      setRequirements(reqs);
      setBenefits(Array.isArray(job.benefits) ? job.benefits : []);
      setSkills([]);
    } else {
      setForm(initialForm);
      setRequirements([]);
      setBenefits([]);
      setSkills([]);
    }
  }, [job, open]);

  if (!open) return null;

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.jobCategoryId) return;
    if (!companyId) {
      setError("Please set up your company profile before posting a job.");
      return;
    }
    setSaving(true);
    try {
      const requiredSkills = skills.filter((s) => s.required).map((s) => s.name);
      const optionalSkills = skills.filter((s) => !s.required).map((s) => s.name);
      const payload = {
        companyId,
        jobCategoryId: Number(form.jobCategoryId),
        title: form.title.trim(),
        description: form.description.trim() || null,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        workplaceType: form.workplaceType,
        salary: form.salary ? Number(form.salary) : null,
        location: form.location.trim() || null,
        deadline: form.deadline || null,
        status: form.status,
        requirements: [...requirements, ...requiredSkills],
        benefits: [...benefits, ...optionalSkills],
      };
      if (job?.id) {
        await updateJob(job.id, payload);
      } else {
        await createJob(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Briefcase size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {job ? "Edit Job" : "Post a New Job"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={labelClass}>Job Title *</label>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleInput}
              className={inputClass}
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Category *</label>
              <select
                required
                name="jobCategoryId"
                value={form.jobCategoryId}
                onChange={handleInput}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Job Type</label>
              <select name="jobType" value={form.jobType} onChange={handleInput} className={inputClass}>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleInput} className={inputClass}>
                {EXP_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Workplace Type</label>
              <select name="workplaceType" value={form.workplaceType} onChange={handleInput} className={inputClass}>
                {WORK_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Salary (per month, USD)</label>
              <input name="salary" type="number" value={form.salary} onChange={handleInput} className={inputClass} placeholder="e.g. 500" />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input name="location" value={form.location} onChange={handleInput} className={inputClass} placeholder="Phnom Penh" />
            </div>
            <div>
              <label className={labelClass}>Application Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleInput} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              rows="4"
              className={inputClass}
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </div>

          <SkillEditor label="Required Skills (toggle Required / Optional)" value={skills} onChange={setSkills} />
          <TagInput label="Requirements (e.g. Minimum 2 years experience)" value={requirements} onChange={setRequirements} placeholder="Type a requirement and press Enter" />
          <TagInput label="Benefits (e.g. Health insurance, flexible hours)" value={benefits} onChange={setBenefits} placeholder="Type a benefit and press Enter" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleInput} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {error && (
              <p className="mr-auto text-xs font-semibold text-rose-600">{error}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !companyId}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
              {job ? "Save Changes" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}