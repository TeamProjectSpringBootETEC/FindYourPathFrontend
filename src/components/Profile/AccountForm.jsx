import React, { useState } from "react";
import { updateUser } from "@/service/authApi";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

export default function AccountForm({ user, onSaved }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (!form.name.trim()) { setError("Name is required."); setSaving(false); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError("Enter a valid email."); setSaving(false); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); setSaving(false); return; }

    try {
      const updated = await updateUser(user.id, {
        roleId: user.roleId,
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        status: user.status,
      });
      setSuccess(true);
      setForm((prev) => ({ ...prev, password: "" }));
      onSaved(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">Account updated successfully.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Name *</label>
          <input className={inputCls} placeholder="Your full name" required value={form.name}
            onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Email *</label>
          <input className={inputCls} type="email" placeholder="you@example.com" required value={form.email}
            onChange={(e) => update("email", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Password *</label>
        <input className={inputCls} type="password" placeholder="Current or new password (min 6 chars)" required
          value={form.password} onChange={(e) => update("password", e.target.value)} />
        <p className="text-[11px] text-gray-400">Re-enter your current password, or type a new one to change it.</p>
      </div>

      <button type="submit" disabled={saving}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {saving ? "Saving..." : "Save Account"}
      </button>
    </form>
  );
}