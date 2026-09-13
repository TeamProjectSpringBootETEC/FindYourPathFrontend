import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, UserCog } from "lucide-react";
import { getStudentProfileByUserId } from "@/service/studentProfileApi";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import HeroCard from "@/components/dashboard/HeroCard";
import MetaCard from "@/components/dashboard/MetaCard";
import ApplicationsSection from "@/components/dashboard/ApplicationsSection";
import ProfileForm from "@/components/Profile/ProfileForm";
import ExperienceSection from "@/components/Profile/ExperienceSection";
import EducationSection from "@/components/Profile/EducationSection";
import AccountForm from "@/components/Profile/AccountForm";

function NeedProfileCard({ onGo }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
      <GraduationCap className="mx-auto h-10 w-10 text-slate-200" />
      <p className="mt-3 text-sm font-medium text-slate-600">You need a student profile first.</p>
      <p className="mt-1 text-xs text-slate-400">Create your personal & academic details to unlock this section.</p>
      <button
        type="button"
        onClick={onGo}
        className="mt-4 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
      >
        Go to Personal & Academic
      </button>
    </div>
  );
}

const cardCls = "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm";

export default function StudentDashboard() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [profile, setProfile] = useState(null);
  const [active, setActive] = useState("personal");

  const loadProfile = async () => {
    if (!user) return;
    try {
      setProfile(await getStudentProfileByUserId(user.id));
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const goPersonal = () => setActive("personal");

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
        <div className="max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Please sign in first</h1>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800 md:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar */}
        <aside className="w-full shrink-0 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm lg:sticky lg:top-20 lg:w-64">
          <div className="mb-2 px-3 pb-3 pt-1">
            <p className="text-sm font-bold text-slate-900">My Dashboard</p>
            <p className="text-xs text-slate-400">Manage your profile</p>
          </div>
          <StudentSidebar active={active} onSelect={setActive} />
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-6">
          <HeroCard
            user={user}
            profile={profile}
            onProfileChange={setProfile}
            onEditProfile={goPersonal}
          />

          {active === "personal" && (
            <>
              <MetaCard user={user} profile={profile} />
              <section className={cardCls}>
                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 font-bold text-slate-900">
                  <GraduationCap className="h-4 w-4 text-indigo-600" /> Personal & Academic Information
                </h2>
                <ProfileForm userId={user.id} profile={profile} onSaved={loadProfile} />
              </section>
            </>
          )}

          {active === "experience" &&
            (profile ? <ExperienceSection studentProfileId={profile.id} /> : <NeedProfileCard onGo={goPersonal} />)}

          {active === "education" &&
            (profile ? <EducationSection studentProfileId={profile.id} /> : <NeedProfileCard onGo={goPersonal} />)}

          {active === "applications" && <ApplicationsSection studentProfileId={profile?.id} />}

          {active === "account" && (
            <section className={cardCls}>
              <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 font-bold text-slate-900">
                <UserCog className="h-4 w-4 text-indigo-600" /> Account Settings
              </h2>
              <AccountForm
                user={user}
                onSaved={(updated) => {
                  localStorage.setItem("user", JSON.stringify(updated));
                  setUser(updated);
                }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}