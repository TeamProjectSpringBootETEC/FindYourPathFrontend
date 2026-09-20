import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointerClick,
  Target,
  Building2,
  Briefcase,
  CalendarDays,
  Award,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  Download,
} from "lucide-react";
import { getAllJob, getAllJobCategories } from "@/service/JobApi";
import { getAllCompanies } from "@/service/CompanyApi";
import { getAllApplications } from "@/service/applicationApi";
import { getAllevent } from "@/service/eventApi";
import { getInterviewsByCompany } from "@/service/interviewApi";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RANGES = ["This Month", "This Quarter", "This Year"];
const PERIOD_LENGTH = { "This Month": 1, "This Quarter": 3, "This Year": 12 };

const toDate = (v) => {
  if (!v) return null;
  if (typeof v === "string") return new Date(v.includes(" ") ? v.replace(" ", "T") : v);
  return new Date(v);
};
const monthIndex = (d) =>
  d == null || Number.isNaN(d.getTime()) ? null : d.getFullYear() * 12 + d.getMonth();
const lowerStatus = (s) => String(s || "").toLowerCase();
const pctDelta = (cur, prev) =>
  prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 1000) / 10;
const fmtDelta = (d) => `${d >= 0 ? "+" : ""}${Math.abs(d).toFixed(1)}%`;

function Reports() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("This Year");

  const toArray = (value) => (Array.isArray(value) ? value : value?.data || []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [j, c, co, e, a] = await Promise.allSettled([
          getAllJob(),
          getAllJobCategories(),
          getAllCompanies(),
          getAllevent(),
          getAllApplications(),
        ]);
        const comps = toArray(co.status === "fulfilled" ? co.value : null);
        setJobs(toArray(j.status === "fulfilled" ? j.value : null));
        setCategories(toArray(c.status === "fulfilled" ? c.value : null));
        setCompanies(comps);
        setEvents(toArray(e.status === "fulfilled" ? e.value : null));
        setApplications(toArray(a.status === "fulfilled" ? a.value : null));

        let allInterviews = [];
        if (comps.length > 0) {
          const lists = await Promise.allSettled(
            comps.map((company) => getInterviewsByCompany(company.id))
          );
          lists.forEach((r) => {
            if (r.status === "fulfilled" && Array.isArray(r.value)) {
              allInterviews = allInterviews.concat(r.value);
            }
          });
        }
        setInterviews(allInterviews);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const { nowMonth, periodStart, prevStart } = useMemo(() => {
    const nowDate = new Date();
    const base = nowDate.getFullYear() * 12 + nowDate.getMonth();
    const len = PERIOD_LENGTH[timeRange] || 1;
    const start = base - (base % len);
    return { nowMonth: base, periodStart: start, prevStart: start - len };
  }, [timeRange]);

  const inCurrent = (v) => {
    const mi = monthIndex(toDate(v));
    return mi != null && mi >= periodStart && mi <= nowMonth;
  };
  const inPrev = (v) => {
    const mi = monthIndex(toDate(v));
    return mi != null && mi >= prevStart && mi < periodStart;
  };

  // KPI (real data, scoped to the selected period vs the previous period)
  const kpi = useMemo(() => {
    const appsCur = applications.filter((a) => inCurrent(a.appliedAt)).length;
    const appsPrev = applications.filter((a) => inPrev(a.appliedAt)).length;
    const intCur = interviews.filter((i) => inCurrent(i.createdAt)).length;
    const intPrev = interviews.filter((i) => inPrev(i.createdAt)).length;
    const hiredCur = applications.filter(
      (a) => inCurrent(a.appliedAt) && lowerStatus(a.status) === "accepted"
    ).length;
    const hiredPrev = applications.filter(
      (a) => inPrev(a.appliedAt) && lowerStatus(a.status) === "accepted"
    ).length;
    const convCur = appsCur > 0 ? (hiredCur / appsCur) * 100 : 0;
    const convPrev = appsPrev > 0 ? (hiredPrev / appsPrev) * 100 : 0;
    return [
      {
        label: "Applications",
        value: appsCur.toLocaleString(),
        delta: fmtDelta(pctDelta(appsCur, appsPrev)),
        up: appsCur >= appsPrev,
        icon: MousePointerClick,
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        label: "Interviews",
        value: intCur.toLocaleString(),
        delta: fmtDelta(pctDelta(intCur, intPrev)),
        up: intCur >= intPrev,
        icon: Users,
        color: "bg-sky-50 text-sky-600",
      },
      {
        label: "Hired",
        value: hiredCur.toLocaleString(),
        delta: fmtDelta(pctDelta(hiredCur, hiredPrev)),
        up: hiredCur >= hiredPrev,
        icon: Target,
        color: "bg-amber-50 text-amber-600",
      },
      {
        label: "Conversion",
        value: `${convCur.toFixed(1)}%`,
        delta: fmtDelta(pctDelta(convCur, convPrev)),
        up: convCur >= convPrev,
        icon: TrendingUp,
        color: "bg-emerald-50 text-emerald-600",
      },
    ];
  }, [applications, interviews, periodStart, prevStart]);

  // Hiring funnel (real data, scoped to the selected period)
  const funnel = useMemo(() => {
    const apps = applications.filter((a) => inCurrent(a.appliedAt)).length;
    const countByStatus = (s) =>
      applications.filter((a) => inCurrent(a.appliedAt) && lowerStatus(a.status) === s).length;
    const stages = [
      { label: "Applications", value: apps, color: "bg-indigo-500" },
      { label: "Reviewing", value: countByStatus("reviewing"), color: "bg-violet-500" },
      { label: "Shortlisted", value: countByStatus("shortlisted"), color: "bg-fuchsia-500" },
      {
        label: "Interviews",
        value: interviews.filter((i) => inCurrent(i.createdAt)).length,
        color: "bg-emerald-500",
      },
      { label: "Hired", value: countByStatus("accepted"), color: "bg-teal-500" },
    ];
    const conversion = apps > 0 ? (stages[4].value / apps) * 100 : 0;
    return { stages, conversion };
  }, [applications, interviews, periodStart, prevStart]);

  // Monthly applications trend over the last 12 months (real data)
  const trend = useMemo(() => {
    const nowDate = new Date();
    const base = nowDate.getFullYear() * 12 + nowDate.getMonth();
    const items = Array.from({ length: 12 }, (_, i) => {
      const mi = base - (11 - i);
      const d = new Date(Math.floor(mi / 12), mi % 12, 1);
      return {
        label: MONTHS[d.getMonth()],
        count: applications.filter((a) => monthIndex(toDate(a.appliedAt)) === mi).length,
      };
    });
    const last12 = items.reduce((sum, it) => sum + it.count, 0);
    const prev12 = applications.filter((a) => {
      const mi = monthIndex(toDate(a.appliedAt));
      return mi != null && mi >= base - 24 && mi < base - 11;
    }).length;
    const yoy = prev12 === 0 ? (last12 > 0 ? 100 : 0) : Math.round(((last12 - prev12) / prev12) * 100);
    return { items, yoy };
  }, [applications]);
  const maxTrend = Math.max(...trend.items.map((it) => it.count), 1);

  // Jobs by category (real data)
  const getJobCategoryId = (job) =>
    job.category_id ??
    job.categoryId ??
    job.job_category_id ??
    job.jobCategoryId ??
    job.category?.id ??
    job.jobCategory?.id ??
    job.jobCategories?.id;

  const jobsByCategory = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const id = String(getJobCategoryId(job) ?? "none");
      map[id] = (map[id] || 0) + 1;
    });
    const max = Math.max(...Object.values(map), 1);
    return Object.entries(map)
      .map(([id, count]) => {
        const cat = categories.find((c) => String(c.id) === id);
        return {
          name: cat?.name || "Uncategorized",
          count,
          pct: Math.round((count / max) * 100),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [jobs, categories]);

  // Top companies by job count (real data)
  const topCompanies = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const companyId = job.company_id ?? job.companyId ?? job.company?.id;
      if (companyId == null) return;
      map[companyId] = (map[companyId] || 0) + 1;
    });
    return Object.entries(map)
      .map(([id, count]) => {
        const company = companies.find((c) => String(c.id) === String(id));
        return {
          name: company?.companyName || company?.name || `Company #${id}`,
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [jobs, companies]);

  // Platform overview (real data)
  const openJobs = jobs.filter((j) => lowerStatus(j.status) === "open").length;
  const liveEvents = events.filter((e) => {
    const s = lowerStatus(e.status);
    return s !== "completed" && s !== "closed" && s !== "cancelled";
  }).length;

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Report &amp; Analytics
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Track platform performance and hiring pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold overflow-x-auto">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
                  timeRange === r
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {kpi.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl ${k.color} flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        k.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {k.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {k.delta}
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-extrabold text-slate-900 mt-3">
                    {k.value}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    {k.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Monthly trend chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-900">
                  Job Applications Trend
                </h2>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp size={11} className="inline mr-0.5" />
                  +{trend.yoy}% YoY
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-40 md:h-48">
                {trend.items.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full max-w-[32px] rounded-t-lg bg-indigo-500/80 hover:bg-indigo-600 transition-all duration-300"
                      style={{ height: `${(item.count / maxTrend) * 100}%`, minHeight: 8 }}
                      title={`${item.label}: ${item.count}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] md:text-[10px] text-slate-400 font-medium">
                {trend.items.map((item) => (
                  <span key={item.label} className="flex-1 text-center">{item.label}</span>
                ))}
              </div>
            </div>

            {/* Funnel */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-4">
                Hiring Funnel
              </h2>
              <div className="space-y-3.5">
                {funnel.stages.map((f) => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{f.label}</span>
                      <span className="font-bold text-slate-900">
                        {f.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${f.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(f.value / (funnel.stages[0].value || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 mt-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Overall Conversion
                  </p>
                  <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                    {funnel.conversion.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Jobs by category */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-900">
                  Jobs by Category
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                  <Briefcase size={12} /> {jobs.length} total
                </span>
              </div>
              {jobsByCategory.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  No job data available
                </p>
              ) : (
                <div className="space-y-3">
                  {jobsByCategory.map((c) => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium truncate max-w-[180px]">
                          {c.name}
                        </span>
                        <span className="font-bold text-slate-900">{c.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top companies */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">
                  Top Companies by Jobs
                </h2>
                <Building2 size={16} className="text-slate-300" />
              </div>
              <div className="divide-y divide-slate-50">
                {topCompanies.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">
                    No company data available
                  </p>
                ) : (
                  topCompanies.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3 px-5 py-3.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          i === 0
                            ? "bg-amber-100 text-amber-700"
                            : i === 1
                            ? "bg-slate-200 text-slate-600"
                            : i === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {c.name}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                        <Award size={10} />
                        {c.count} jobs
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Platform overview strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Open Jobs", value: openJobs, icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
              { label: "Companies", value: companies.length, icon: Building2, color: "text-sky-600 bg-sky-50" },
              { label: "Categories", value: categories.length, icon: Award, color: "text-violet-600 bg-violet-50" },
              { label: "Live Events", value: liveEvents, icon: CalendarDays, color: "text-amber-600 bg-amber-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;