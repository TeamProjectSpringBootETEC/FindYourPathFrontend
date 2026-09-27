import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  FileDown,
  Sparkles,
  Link2,
} from "lucide-react";
import { getStudentProfileById } from "@/service/studentProfileApi";
import { getExperiencesByStudent } from "@/service/experienceApi";
import { getEducationsByStudent } from "@/service/educationApi";
import { getStudentSkillsByStudent } from "@/service/studentSkillApi";
import Reveal from "@/components/Reveal";

export default function StudentProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getStudentProfileById(id),
      getExperiencesByStudent(id).catch(() => []),
      getEducationsByStudent(id).catch(() => []),
      getStudentSkillsByStudent(id).catch(() => []),
    ])
      .then(([p, ex, ed, sk]) => {
        if (!active) return;
        setProfile(p);
        setExperiences(Array.isArray(ex) ? ex : []);
        setEducations(Array.isArray(ed) ? ed : []);
        setSkills(Array.isArray(sk) ? sk : []);
      })
      .catch(() => active && setError("Could not load this student profile."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading candidate profile...</p>
          </div>
        ) : error || !profile ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-slate-600">{error || "Profile not found."}</p>
            <button onClick={() => navigate("/")} className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:underline">
              Go back home
            </button>
          </div>
        ) : (
          <>
            <Reveal delay={100} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-7 py-6 bg-gradient-to-r from-indigo-50 via-slate-50 to-slate-50 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg shadow-indigo-200">
                      {(profile.name || "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-slate-900 truncate">{profile.name || "Unknown Candidate"}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{profile.email || "—"}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                        {profile.phone && (
                          <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{profile.phone}</span>
                        )}
                        {profile.address && (
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{profile.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {profile.cv && (
                    <a
                      href={profile.cv}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition"
                    >
                      <FileDown className="w-4 h-4" /> Download CV
                    </a>
                  )}
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Reveal delay={150} direction="right" className="space-y-6">
                {profile.bio && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Bio
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Experience
                  </h2>
                  {experiences.length ? (
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                          <p className="text-sm font-semibold text-slate-800">{exp.position}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{exp.companyName}</p>
                          <p className="text-[11px] text-slate-400 mt-1.5">{exp.startDate || "—"} → {exp.endDate || "Present"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No work experience listed.</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Education
                  </h2>
                  {educations.length ? (
                    <div className="space-y-3">
                      {educations.map((edu) => (
                        <div key={edu.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                          <p className="text-sm font-semibold text-slate-800">{edu.universityName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{edu.degree} · {edu.major}</p>
                          <p className="text-[11px] text-slate-400 mt-1.5">{edu.startYear || "—"} – {edu.graduationYear || "Present"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No education history listed.</p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={200} direction="left" className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Academic Info
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoTile label="University" value={profile.universityName || "—"} />
                    <InfoTile label="Major" value={profile.major || "—"} />
                    <InfoTile label="GPA" value={profile.gpa != null ? Number(profile.gpa).toFixed(2) : "—"} />
                    <InfoTile label="Graduation Year" value={profile.graduationYear != null ? String(profile.graduationYear) : "—"} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Skills
                  </h2>
                  {skills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((item) => (
                        <span key={item.id} className="rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                          {item.skillName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No skills listed.</p>
                  )}
                </div>

                {profile.portfolio_url && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-indigo-500" /> Links
                    </h2>
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <Link2 className="w-4 h-4" /> View Portfolio
                    </a>
                  </div>
                )}
              </Reveal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}