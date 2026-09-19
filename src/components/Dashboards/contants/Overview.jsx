import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Building2,
  Briefcase,
  CalendarDays,
  Award,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  Bell,
  FileText,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllUsers } from "@/service/userApi";
import { getAllCompanies } from "@/service/CompanyApi";
import { getAllJob, getAllJobCategories } from "@/service/JobApi";
import { getAllevent } from "@/service/eventApi";
import { getAllNotifications } from "@/service/notificationApi";

function Overview() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [u, c, j, e, n, cat] = await Promise.allSettled([
          getAllUsers(),
          getAllCompanies(),
          getAllJob(),
          getAllevent(),
          getAllNotifications(),
          getAllJobCategories(),
        ]);
        if (u.status === "fulfilled") {
          const d = u.value;
          setUsers(Array.isArray(d) ? d : d.data || []);
        }
        if (c.status === "fulfilled") {
          const d = c.value;
          setCompanies(Array.isArray(d) ? d : d.data || []);
        }
        if (j.status === "fulfilled") {
          const d = j.value;
          setJobs(Array.isArray(d) ? d : d.data || []);
        }
        if (e.status === "fulfilled") {
          const d = e.value;
          setEvents(Array.isArray(d) ? d : d.data || []);
        }
        if (n.status === "fulfilled") {
          const d = n.value;
          setNotifications(Array.isArray(d) ? d : d.data || []);
        }
        if (cat.status === "fulfilled") {
          const d = cat.value;
          setCategories(Array.isArray(d) ? d : d.data || []);
        }
      } catch {
        // partial data is fine
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Derived counts
  const openJobs = useMemo(
    () => jobs.filter((j) => String(j.status || "").toUpperCase() === "OPEN"),
    [jobs]
  );
  const unreadNotifs = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.read),
    [notifications]
  );
  const verifiedCompanies = useMemo(
    () => companies.filter((c) => c.isVerified || c.verified),
    [companies]
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
      ring: "ring-indigo-100",
      link: "/dashboard/users",
    },
    {
      label: "Companies",
      value: companies.length,
      sub: `${verifiedCompanies.length} verified`,
      icon: Building2,
      color: "bg-sky-50 text-sky-600",
      ring: "ring-sky-100",
      link: "/dashboard/companies",
    },
    {
      label: "Open Jobs",
      value: openJobs.length,
      sub: `${jobs.length} total`,
      icon: Briefcase,
      color: "bg-emerald-50 text-emerald-600",
      ring: "ring-emerald-100",
      link: "/dashboard/jobs",
    },
    {
      label: "Events",
      value: events.length,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-600",
      ring: "ring-amber-100",
      link: "/dashboard/events",
    },
    {
      label: "Job Categories",
      value: categories.length,
      icon: Award,
      color: "bg-violet-50 text-violet-600",
      ring: "ring-violet-100",
      link: "/dashboard/categories",
    },
    {
      label: "Unread Notifications",
      value: unreadNotifs.length,
      icon: Bell,
      color: "bg-rose-50 text-rose-600",
      ring: "ring-rose-100",
      link: "/dashboard/notifications",
    },
  ];

  // Recent users (last 5)
  const recentUsers = useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [users]);

  // Recent jobs (last 5)
  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [jobs]);

  // Role distribution for mini chart
  const roleDistribution = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      const roleName =
        u.role?.role_name ||
        u.role?.name ||
        u.role_name ||
        `Role #${u.role_id || "?"}`;
      map[roleName] = (map[roleName] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [users]);

  const maxRoleCount = Math.max(...roleDistribution.map(([, c]) => c), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 pb-6">
      {/* Welcome Header */}
      <div className="rounded-2xl p-6 md:p-8 text-black ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, Admin
            </h1>
            <p className="text-indigo-500 text-sm mt-1 font-medium">
              Here is what is happening across your platform today.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.link}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}
                >
                  <Icon size={20} />
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">
                {s.value.toLocaleString()}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {s.label}
              </p>
              {s.sub && (
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Middle Row: Recent Jobs + Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Jobs</h2>
            <Link
              to="/dashboard/jobs"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                  <th className="py-2.5 px-5">Job Title</th>
                  <th className="py-2.5 px-4 hidden sm:table-cell">Location</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400">
                      No jobs yet
                    </td>
                  </tr>
                ) : (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-5 font-semibold text-slate-800">
                        {job.title || "Untitled"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            String(job.status || "").toUpperCase() === "OPEN"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {job.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Distribution Mini Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Users by Role
          </h2>
          <div className="space-y-3">
            {roleDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No user data
              </p>
            ) : (
              roleDistribution.map(([role, count]) => (
                <div key={role}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium truncate max-w-[120px]">
                      {role}
                    </span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / maxRoleCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Users + Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Users
            </h2>
            <Link
              to="/dashboard/users"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentUsers.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">
                No users yet
              </p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(u.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {u.name || "Unknown"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {u.email || "No email"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (u.status || "ACTIVE") === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {u.status || "ACTIVE"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Notifications
            </h2>
            <Link
              to="/dashboard/notifications"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">
                No notifications
              </p>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-3 hover:bg-slate-50/50 ${
                    !n.isRead && !n.read ? "bg-indigo-50/30" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      !n.isRead && !n.read
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {n.type === "NEW_JOB" ? (
                      <Briefcase size={14} />
                    ) : n.type === "APPLICATION" ? (
                      <FileText size={14} />
                    ) : (
                      <Bell size={14} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        !n.isRead && !n.read
                          ? "text-slate-900"
                          : "text-slate-600"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && !n.read && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Add User",
              icon: Users,
              color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
              link: "/dashboard/users",
            },
            {
              label: "Add Company",
              icon: Building2,
              color: "bg-sky-50 text-sky-600 hover:bg-sky-100",
              link: "/dashboard/companies",
            },
            {
              label: "Post Job",
              icon: Briefcase,
              color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
              link: "/dashboard/jobs",
            },
            {
              label: "Add Event",
              icon: CalendarDays,
              color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
              link: "/dashboard/events",
            },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                to={a.link}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition ${a.color}`}
              >
                <Icon size={16} />
                {a.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Overview;
