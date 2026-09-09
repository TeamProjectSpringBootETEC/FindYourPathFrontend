import { BriefcaseBusiness, Building2Icon, Monitor, PenTool, ShieldCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Banner() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
        {/* Background Decorations */}
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* ================= LEFT ================= */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                <BriefcaseBusiness />
                Your Future Starts Here
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
                Find Your Dream
                <span className="block text-blue-600">Job & Scholarships </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Explore thousands of job opportunities, get hired by top
                companies, and build the career you want.
              </p>

              {/* Search Box */}
              <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-blue-100 md:flex-row">
                {/* Search Input */}
                <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Search for jobs, skills, or companies..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:text-base"
                  />
                </div>

                {/* Search Button */}
                <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg">
                  Search
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Building2Icon />
                  </span>
                  <span>Top Companies</span>
                </div>

                <div className="hidden h-8 w-px bg-slate-300 sm:block"></div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Monitor />
                  </span>
                  <span>Remote & On-site</span>
                </div>

                <div className="hidden h-8 w-px bg-slate-300 sm:block"></div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <ShieldCheck />
                  </span>
                  <span>Safe & Trusted</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/job"
                  className="rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Explore Jobs →
                </Link>

                <Link
                  to="/companies"
                  className="rounded-full border border-blue-200 bg-white px-7 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  View Companies
                </Link>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="relative">
              {/* Main Illustration Container */}
              <div className="relative mx-auto max-w-xl">
                {/* Blue Circle Background */}
                <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-blue-100 md:h-96 md:w-96"></div>

                {/* Job Opportunities Bubble */}
                <div className="absolute left-0 top-5 z-20 flex items-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-xl">
                  <BriefcaseBusiness />
                  <div>
                    <p className="text-xs opacity-80">New</p>
                    <p className="font-bold">Job Opportunities</p>
                  </div>
                </div>

                {/* Person */}
                <div className="relative z-10 flex justify-center pt-20">
                  <div className="flex h-72 w-72 items-center justify-center rounded-full bg-blue-200/50 md:h-80 md:w-80">
                    {/* Simple CSS Character */}
                    <div className="relative">
                      {/* Head */}
                      <div className="mx-auto h-28 w-28 rounded-full bg-orange-200 shadow-md">
                        {/* Hair */}
                        <div className="absolute left-1/2 top-0 h-14 w-28 -translate-x-1/2 rounded-t-full bg-slate-900"></div>

                        {/* Eyes */}
                        <div className="absolute left-8 top-16 h-2 w-2 rounded-full bg-slate-800"></div>
                        <div className="absolute right-8 top-16 h-2 w-2 rounded-full bg-slate-800"></div>

                        {/* Smile */}
                        <div className="absolute bottom-6 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-slate-700"></div>
                      </div>

                      {/* Body */}
                      <div className="mx-auto mt-2 h-40 w-52 rounded-t-[80px] bg-blue-600 shadow-xl"></div>

                      {/* Laptop */}
                      <div className="absolute -bottom-10 left-1/2 z-30 -translate-x-1/2">
                        <div className="h-24 w-40 rounded-lg border-4 border-slate-500 bg-slate-300 shadow-xl md:h-28 md:w-48">
                          <div className="flex h-full items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-slate-400"></div>
                          </div>
                        </div>

                        <div className="mx-auto h-3 w-48 rounded-b-xl bg-slate-500 md:w-56"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Card */}
                <div className="absolute right-0 top-24 z-20 hidden w-64 rounded-2xl bg-white p-4 shadow-2xl md:block">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      Available Jobs
                    </span>

                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                      120+
                    </span>
                  </div>

                  {/* Job 1 */}
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                      &lt;/&gt;
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Frontend Developer
                      </p>
                      <p className="text-xs text-slate-500">Phnom Penh</p>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <BriefcaseBusiness />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Backend Developer
                      </p>
                      <p className="text-xs text-slate-500">Remote</p>
                    </div>
                  </div>

                  {/* Job 3 */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <PenTool />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        UI/UX Designer
                      </p>
                      <p className="text-xs text-slate-500">Phnom Penh</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Card */}
                <div className="absolute -bottom-5 left-4 z-30 rounded-2xl bg-white px-5 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Your Career
                      </p>
                      <p className="text-xs text-slate-500">Starts Today 🚀</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Banner;
