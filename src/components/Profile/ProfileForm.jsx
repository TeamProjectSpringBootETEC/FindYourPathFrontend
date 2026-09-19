import React, { useState } from "react";
import { Pencil, UserPlus, X } from "lucide-react";
import { createStudentProfile, updateStudentProfile } from "@/service/studentProfileApi";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export default function ProfileForm({ userId, profile, onSaved }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    phone: profile?.phone || "",
    address: profile?.address || "",
    universityName: profile?.universityName || "",
    major: profile?.major || "",
    graduationYear: profile?.graduationYear || "",
    gpa: profile?.gpa ?? "",
    bio: profile?.bio || "",
    portfolioUrl: profile?.portfolio_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const phoneValue = form.phone.trim();
    if (!PHONE_REGEX.test(phoneValue)) {
      setError("Phone must be 7-15 digits and may start with + (no spaces or dashes), e.g. 012345678 or +85512345678.");
      setSaving(false);
      return;
    }

    const payload = {
      userId,
      phone: phoneValue,
      address: form.address || null,
      universityName: form.universityName,
      major: form.major,
      graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
      gpa: form.gpa ? Number(form.gpa) : null,
      bio: form.bio || null,
      portfolioUrl: form.portfolioUrl || "",
    };
    try {
      if (profile) {
        await updateStudentProfile(profile.id, payload);
      } else {
        await createStudentProfile(payload);
      }
      onSaved();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const previewRows = [
    ["Phone", profile?.phone],
    ["Address", profile?.address],
    ["University", profile?.universityName],
    ["Major", profile?.major],
    ["Graduation Year", profile?.graduationYear],
    ["GPA", profile?.gpa],
    ["Portfolio", profile?.portfolio_url],
  ];

  return (
    <div className="space-y-4">
      {!showForm ? (
        <div className="space-y-4">
          {profile ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {previewRows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="mt-0.5 text-sm text-gray-800">
                    {value ? value : <span className="text-gray-300">&mdash;</span>}
                  </dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bio</dt>
                <dd className="mt-0.5 text-sm text-gray-800 leading-relaxed">
                  {profile.bio ? profile.bio : <span className="text-gray-300">&mdash;</span>}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center">
              <p className="text-sm font-medium text-gray-700">You don&apos;t have a student profile yet.</p>
              <p className="mt-1 text-xs text-gray-400">
                Fill in your personal and academic details to unlock experiences, education, skills and more.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            {profile ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {profile ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Phone *</label>
              <input className={inputCls} placeholder="e.g. 012345678 or +85512345678" required value={form.phone}
                onChange={(e) => update("phone", e.target.value)} />
              <p className="text-[11px] text-gray-400">7-15 digits, optionally starting with + (no spaces or dashes)</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Address</label>
              <input className={inputCls} placeholder="Phnom Penh, Cambodia" value={form.address}
                onChange={(e) => update("address", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">University Name *</label>
              <input className={inputCls} placeholder="Royal University of Phnom Penh" required value={form.universityName}
                onChange={(e) => update("universityName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Major *</label>
              <input className={inputCls} placeholder="Computer Science" required value={form.major}
                onChange={(e) => update("major", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Graduation Year</label>
              <input className={inputCls} type="number" min={1900} max={2100} placeholder="2025" value={form.graduationYear}
                onChange={(e) => update("graduationYear", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">GPA</label>
              <input className={inputCls} type="number" step="0.01" min="0" max="4" placeholder="3.5" value={form.gpa}
                onChange={(e) => update("gpa", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Portfolio URL</label>
              <input className={inputCls} placeholder="https://myportfolio.com" value={form.portfolioUrl}
                onChange={(e) => update("portfolioUrl", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Bio</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Tell employers a little about yourself..."
                value={form.bio} onChange={(e) => update("bio", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}