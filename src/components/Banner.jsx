import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import {
  BriefcaseBusiness,
  Building2,
  Monitor,
  ShieldCheck,
  Search,
  MapPin,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const featuredJobs = [
  {
    initial: "S",
    logoBg: "bg-blue-600",
    title: "Frontend Developer",
    company: "SmartTech Co., Ltd.",
    location: "Phnom Penh, Cambodia",
    type: "Full-time",
    salary: "$1,200/mo",
  },
  {
    initial: "G",
    logoBg: "bg-purple-600",
    title: "Digital Marketing Specialist",
    company: "Growth Agency",
    location: "Phnom Penh, Cambodia",
    type: "Marketing",
    salary: "$800/mo",
  },
  {
    initial: "A",
    logoBg: "bg-emerald-600",
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Siem Reap, Cambodia",
    type: "Part-time",
    salary: "$700/mo",
  },
];

const heroStats = [
  { value: "50k+", label: "Active Jobs" },
  { value: "850+", label: "Companies" },
  { value: "94%", label: "Match Score" },
];

function Banner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl"></div>
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ================= LEFT ================= */}
          <Reveal direction="right" className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <BriefcaseBusiness className="w-4 h-4" />
              Your Future Starts Here
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Find Your Dream
              <span className="block text-blue-600">Job Today</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Explore thousands of job opportunities, get hired by top
              companies, and build the career you want.
            </p>

            {/* Search Box */}
            <div className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-blue-100 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                <Search className="h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search for jobs, skills, or companies..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:text-base"
                  onKeyDown={(e) => e.key === "Enter" && navigate("/job")}
                />
              </div>

              <button
                onClick={() => navigate("/job")}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
              >
                Search
              </button>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Popular:</span>
              {["Frontend", "Design", "Internship"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate("/job")}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Building2 className="w-4 h-4" />
                </span>
                <span>Top Companies</span>
              </div>

              <div className="hidden h-8 w-px bg-slate-300 sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Monitor className="w-4 h-4" />
                </span>
                <span>Remote & On-site</span>
              </div>

              <div className="hidden h-8 w-px bg-slate-300 sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span>Safe & Trusted</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/job"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:-translate-y-0.5"
              >
                Explore Jobs <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/companies"
                className="rounded-full border border-slate-200 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                View Companies
              </Link>
            </div>
          </Reveal>

          {/* ================= RIGHT ================= */}
          <Reveal direction="left" delay={120} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-sky-50 to-purple-100 rounded-[3rem] blur-2xl opacity-60"></div>

            <div className="relative bg-white/80 backdrop-blur border border-white rounded-3xl p-5 sm:p-6 shadow-2xl">
              {/* Panel Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending Now
                </span>
              </div>

              {/* Job List */}
              <div className="space-y-3">
                {featuredJobs.map((job) => (
                  <button
                    key={job.title}
                    onClick={() => navigate("/job")}
                    className="group flex w-full items-center gap-3 rounded-2xl bg-white border border-slate-100 p-3 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${job.logoBg} text-white font-bold text-lg`}>
                      {job.initial}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </p>
                      <p className="truncate text-xs font-medium text-slate-500">
                        {job.company}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-blue-600">{job.salary}</p>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">monthly</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Panel Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -top-4 right-4 z-20 hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 sm:block">
              120+ New Jobs
            </div>

            <div className="absolute -bottom-5 left-6 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>
              <span className="text-sm font-bold text-slate-800">
                Your Career Starts Today <span className="inline-block">🚀</span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Banner;