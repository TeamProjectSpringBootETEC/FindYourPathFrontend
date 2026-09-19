import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Bell,
  Search,
  Send,
  X,
  Trash2,
  Loader2,
  RefreshCw,
  MailOpen,
  CheckCheck,
  Info,
  Briefcase,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/notifications";
const USERS_API_URL = "http://localhost:8089/api/v1/users";

const initialFormState = {
  userId: "",
  title: "",
  message: "",
  type: "GENERAL",
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | UNREAD
  const [formData, setFormData] = useState(initialFormState);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const data = response.data.data || response.data;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API_URL);
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return notifications.filter((n) => {
      const isUnread = !n.isRead && !n.read;
      const matchesFilter = filter === "ALL" || (filter === "UNREAD" && isUnread);
      const matchesSearch =
        (n.title || "").toLowerCase().includes(q) ||
        (n.message || "").toLowerCase().includes(q) ||
        (n.type || "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [notifications, searchQuery, filter]);

  const formatDate = (d) => {
    if (!d) return "N/A";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(API_BASE_URL, {
        userId: Number(formData.userId),
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
      });
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to send notification:", err);
      alert(err.response?.data?.message || "Failed to send notification.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkRead = async (n) => {
    try {
      await axios.put(`${API_BASE_URL}/${n.id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true, read: true } : item))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getTypeIcon = (type) => {
    const t = String(type || "GENERAL").toUpperCase();
    if (t.includes("JOB")) return <Briefcase size={14} className="text-indigo-500" />;
    if (t.includes("APPLICATION")) return <FileText size={14} className="text-emerald-500" />;
    if (t.includes("ALERT")) return <AlertTriangle size={14} className="text-amber-500" />;
    return <Info size={14} className="text-sky-500" />;
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 md:w-12 md:h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Notification Center
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Send and manage system notifications
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
          <button
            onClick={fetchNotifications}
            className="p-2.5 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-rose-100 transition"
          >
            <Send size={15} />
            Send Notification
          </button>
        </div>
      </div>

      {/* Summary + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <MailOpen size={17} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900">{notifications.length}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Sent</p>
            </div>
          </div>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition ${
              filter === "UNREAD"
                ? "border-rose-500 bg-rose-50"
                : "border-slate-200/80 bg-white"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Bell size={17} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900">{unreadCount}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Unread</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 flex items-center gap-2 self-start">
          {["ALL", "UNREAD"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === f ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {f === "ALL" ? "All" : "Unread only"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-600 mb-2" />
              <p className="text-xs">Loading notifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-slate-400 text-xs">
              No notifications found.
            </p>
          ) : (
            filtered.map((n) => {
              const isUnread = !n.isRead && !n.read;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${
                    isUnread ? "bg-rose-50/30" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          isUnread ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                        {n.type || "GENERAL"}
                      </span>
                      {isUnread && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 uppercase">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1.5 inline-flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(n.createdAt)} · User #{n.userId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(n)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Mark as Read"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Send modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Send Notification</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Recipient *
                </label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a User
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.username || `User ${u.id}`} (ID: {u.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. New job opportunity"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Message *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter notification message..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={inputClass}
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="NEW_JOB">NEW_JOB</option>
                  <option value="APPLICATION">APPLICATION</option>
                  <option value="ALERT">ALERT</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-100 transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Send size={14} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;