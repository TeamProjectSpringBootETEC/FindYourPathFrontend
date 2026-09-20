import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Loader2,
  MailOpen,
  Mic2,
  Inbox,
} from "lucide-react";
import {
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/service/notificationApi";
import Reveal from "@/components/Reveal";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    getNotificationsByUser(user.id)
      .then((data) => active && setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm text-slate-500 font-medium mb-4">Please sign in to see your notifications.</p>
        <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered = notifications.filter(
    (n) => filter === "ALL" || (filter === "UNREAD" && !n.isRead)
  );

  const openNotification = async (n) => {
    if (!n.isRead) {
      markNotificationRead(n.id).then(() =>
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
        )
      );
    }
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    await markAllNotificationsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return isNaN(dt)
      ? String(d)
      : dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-3xl space-y-6">
        <Reveal delay={100} className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm">
          <header>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                <Bell size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
                <p className="text-xs text-slate-400">
                  Invitations and updates from companies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {["ALL", "UNREAD"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {f === "ALL" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
                </button>
              ))}
              {unreadCount > 0 && (
                <button
                  onClick={markAll}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
          </div>
        </header>
        </Reveal>

        <Reveal delay={150} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-xs">Loading notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-xs">No notifications {filter === "UNREAD" ? "unread" : ""}.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const isInterview = n.type === "INTERVIEW" || /\/interview\//.test(n.link || "");
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50/60 transition-colors ${
                    !n.isRead ? "bg-indigo-50/40" : ""
                  }`}
                  onClick={() => openNotification(n)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isInterview ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"}`}>
                    {isInterview ? <Mic2 size={18} /> : <MailOpen size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${n.isRead ? "text-slate-600" : "text-slate-900"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5">{formatDate(n.createdAt)}</p>
                  </div>
                  {isInterview && (
                    <span className="shrink-0 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
                      Join Interview →
                    </span>
                  )}
                </div>
              );
            })
          )}
        </Reveal>
      </div>
    </div>
  );
}