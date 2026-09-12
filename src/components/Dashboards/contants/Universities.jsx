import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  MapPin,
  Globe,
  Trophy,
  Users,
  BookOpen,
  Star,
  Building2,
} from "lucide-react";

// NOTE: No Universities API exists yet in the Spring backend.
// This page is a front-end design with local sample data only.
const SAMPLE_UNIVERSITIES = [
  { id: 1, name: "Royal University of Phnom Penh", short: "RUPP", location: "Phnom Penh, Cambodia", type: "Public", ranking: 1, students: 24000, programs: 120, acceptance: "12%", featured: true, website: "www.rupp.edu.kh" },
  { id: 2, name: "Institute of Technology of Cambodia", short: "ITC", location: "Phnom Penh, Cambodia", type: "Public", ranking: 2, students: 6800, programs: 35, acceptance: "8%", featured: true, website: "www.itc.edu.kh" },
  { id: 3, name: "PARAGON International University", short: "PIU", location: "Phnom Penh, Cambodia", type: "Private", ranking: 3, students: 5200, programs: 48, acceptance: "25%", featured: false, website: "www.paragoniu.edu.kh" },
  { id: 4, name: "National University of Management", short: "NUM", location: "Phnom Penh, Cambodia", type: "Public", ranking: 4, students: 15000, programs: 60, acceptance: "18%", featured: false, website: "www.num.edu.kh" },
  { id: 5, name: "Siem Reap University of Professional Studies", short: "SRUPS", location: "Siem Reap, Cambodia", type: "Private", ranking: 5, students: 4100, programs: 22, acceptance: "30%", featured: false, website: "www.srups.edu.kh" },
  { id: 6, name: "Battambang Regional Teacher Training Center", short: "BRTTC", location: "Battambang, Cambodia", type: "Public", ranking: 6, students: 2800, programs: 14, acceptance: "22%", featured: false, website: "www.brttc.edu.kh" },
];

const accentColors = [
  "bg-indigo-50 text-indigo-600",
  "bg-sky-50 text-sky-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
];

function Universities() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return SAMPLE_UNIVERSITIES.filter((u) => {
      const name = (u.name + " " + u.short).toLowerCase();
      const location = (u.location || "").toLowerCase();
      const type = (u.type || "").toLowerCase();
      return name.includes(q) || location.includes(q) || type.includes(q);
    });
  }, [searchQuery]);

  const featuredCount = SAMPLE_UNIVERSITIES.filter((u) => u.featured).length;
  const totalStudents = SAMPLE_UNIVERSITIES.reduce(
    (sum, u) => sum + u.students,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                University Directory
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Browse partner universities and their programs
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Partner Universities", value: SAMPLE_UNIVERSITIES.length, Icon: Building2, color: "bg-sky-50 text-sky-600" },
            { label: "Featured", value: featuredCount, Icon: Star, color: "bg-amber-50 text-amber-600" },
            { label: "Students Enrolled", value: `${(totalStudents / 1000).toFixed(0)}K+`, Icon: Users, color: "bg-indigo-50 text-indigo-600" },
            { label: "Total Programs", value: SAMPLE_UNIVERSITIES.reduce((s, u) => s + u.programs, 0), Icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* University Cards */}
        {filteredUniversities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm py-16 text-center text-slate-400">
            No universities found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredUniversities.map((u, index) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl ${accentColors[index % accentColors.length]} flex items-center justify-center text-base font-extrabold shrink-0`}
                    >
                      {u.short ? u.short.substring(0, 2).toUpperCase() : "UNI"}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm leading-tight">
                        {u.name}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {u.location}
                      </p>
                    </div>
                  </div>

                  {u.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-700">
                    <Trophy className="w-3 h-3" />
                    Rank #{u.ranking}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600">
                    {u.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Students</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {u.students.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Programs</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{u.programs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Acceptance</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{u.acceptance}</p>
                  </div>
                </div>

                {u.website && (
                  <a
                    href={`https://${u.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline mt-4"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {u.website}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Universities;