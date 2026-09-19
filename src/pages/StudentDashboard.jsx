import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, UserCog, FileText, Bookmark, CalendarDays } from "lucide-react";
import { getStudentProfileByUserId } from "@/service/studentProfileApi";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import HeroCard from "@/components/dashboard/HeroCard";
import MetaCard from "@/components/dashboard/MetaCard";
import ApplicationsSection from "@/components/dashboard/ApplicationsSection";
import SavedJobsSection from "@/components/dashboard/SavedJobsSection";
import SavedEventsSection from "@/components/dashboard/SavedEventsSection";
import ProfileForm from "@/components/Profile/ProfileForm";
import ExperienceSection from "@/components/Profile/ExperienceSection";
import EducationSection from "@/components/Profile/EducationSection";
import SkillsSection from "@/components/Profile/SkillsSection";
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
  const [active, setActive] = useState("overview");
  const [scrollToPersonal, setScrollToPersonal] = useState(false);
  const personalSectionRef = useRef(null);

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

  // Scroll to the personal & academic form when Edit Profile is clicked
  useEffect(() => {
    if (scrollToPersonal) {
      personalSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToPersonal(false);
    }
  }, [scrollToPersonal, active]);

  const goPersonal = () => {
    setActive("personal");
    setScrollToPersonal(true);
  };

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

          {active === "overview" && (
            <section className={cardCls}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Welcome back, {user.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage your profile, applications, saved jobs and events from this dashboard.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: "personal", label: "Personal & Academic", icon: GraduationCap },
                    { id: "applications", label: "My Applications", icon: FileText },
                    { id: "saved-jobs", label: "Saved Jobs", icon: Bookmark },
                    { id: "saved-events", label: "Saved Events", icon: CalendarDays },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActive(id)}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
                    >
                      <Icon className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-slate-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active === "personal" && (
            <>
              <MetaCard user={user} profile={profile} />
              <section ref={personalSectionRef} className={cardCls}>
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

          {active === "skills" &&
            (profile ? <SkillsSection studentProfileId={profile.id} /> : <NeedProfileCard onGo={goPersonal} />)}

          {active === "applications" && <ApplicationsSection studentProfileId={profile?.id} />}

          {active === "saved-jobs" && <SavedJobsSection userId={user.id} />}

          {active === "saved-events" && <SavedEventsSection userId={user.id} />}

          {active === "account" && (
            <section className={cardCls}>
              <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 font-bold text-slate-900">
                <UserCog className="h-4 w-4 text-indigo-600" /> Account Settings
              </h2>
              <AccountForm
                user={user}
                onSaved={(updated) => {
                  const refreshed = { ...updated, token: user.token };
                  localStorage.setItem("user", JSON.stringify(refreshed));
                  setUser(refreshed);
                }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}