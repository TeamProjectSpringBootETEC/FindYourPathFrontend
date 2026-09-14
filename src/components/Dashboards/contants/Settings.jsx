import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Save,
  Check,
  Mail,
  Lock,
  Users,
  Briefcase,
  CalendarDays,
  Award,
  Monitor,
  Sun,
  Minus,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@findyourpath.com",
    role: "Administrator",
    company: "FindYourPath",
  });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [prefs, setPrefs] = useState({
    newJob: true,
    applications: true,
    events: true,
    scholarships: false,
    digest: false,
  });
  const [theme, setTheme] = useState("system");

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleClass = (on) =>
    `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
      on ? "bg-indigo-600" : "bg-slate-200"
    }`;

  const knobClass = (on) =>
    `inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${
      on ? "translate-x-6" : "translate-x-1"
    }`;

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

  const labelClass =
    "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <SettingsIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Settings
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Manage your account, preferences and security
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Section nav (horizontal on mobile, vertical on desktop) */}
        <div className="flex overflow-x-auto lg:flex-col gap-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 lg:w-64 lg:h-fit lg:sticky lg:top-6 shrink-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  activeSection === s.id
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={17} className={activeSection === s.id ? "text-indigo-600" : "text-slate-400"} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {activeSection === "profile" && (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">
                  {(profile.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Profile Information</h2>
                  <p className="text-xs text-slate-500">This is how your admin profile appears.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className={inputClass}
                  >
                    <option>Administrator</option>
                    <option>Company Manager</option>
                    <option>University Manager</option>
                    <option>Moderator</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Organization</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition"
                >
                  {saved ? <Check size={15} className="text-white" /> : <Save size={15} />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeSection === "security" && (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Password</h2>
                  <p className="text-xs text-slate-500">Use at least 8 characters with a mix of symbols.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input
                    type="password"
                    value={password.next}
                    onChange={(e) => setPassword({ ...password, next: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition"
                >
                  <Save size={15} />
                  Update Password
                </button>
              </div>
            </form>
          )}

          {activeSection === "notifications" && (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-xs text-slate-500">Choose which events you receive alerts for.</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { key: "newJob", label: "New job postings", desc: "When a company publishes a new job", Icon: Briefcase },
                  { key: "applications", label: "New applications", desc: "When a candidate submits an application", Icon: Users },
                  { key: "events", label: "Event updates", desc: "Event registrations and changes", Icon: CalendarDays },
                  { key: "scholarships", label: "Scholarships", desc: "New or updated scholarship opportunities", Icon: Award },
                  { key: "digest", label: "Weekly digest", desc: "A summary of platform activity every Monday", Icon: Mail },
                ].map(({ key, label, desc, Icon }) => (
                  <div key={key} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                      className={toggleClass(prefs[key])}
                      aria-pressed={prefs[key]}
                    >
                      <span className={knobClass(prefs[key])} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition"
                >
                  {saved ? <Check size={15} /> : <Save size={15} />}
                  {saved ? "Saved" : "Save Preferences"}
                </button>
              </div>
            </form>
          )}

          {activeSection === "appearance" && (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Palette size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Appearance</h2>
                  <p className="text-xs text-slate-500">Customize how the dashboard looks.</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "system", label: "System", Icon: Monitor },
                    { key: "light", label: "Light", Icon: Sun },
                    { key: "compact", label: "Compact", Icon: Minus },
                  ].map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition ${
                        theme === key
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition"
                >
                  {saved ? <Check size={15} /> : <Save size={15} />}
                  {saved ? "Saved" : "Save Appearance"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;