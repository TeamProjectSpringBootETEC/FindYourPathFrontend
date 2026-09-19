import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import api from "@/service/api";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Loader2,
  RefreshCw,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  UserX,
  Crown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  Layers,
  SlidersHorizontal,
} from "lucide-react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const API_BASE_URL = "/v1/users";
const ROLES_API_URL = "/v1/roles";

const STATUS_COLORS = {
  ACTIVE: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  INACTIVE: "bg-rose-50 text-rose-600 border border-rose-200",
};

const roleColor = (roleName) => {
  const r = (roleName || "").toUpperCase();
  if (r.includes("ADMIN")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (r.includes("COMPANY")) return "bg-sky-50 text-sky-700 border-sky-100";
  if (r.includes("UNIVERSITY") || r.includes("UNI")) return "bg-violet-50 text-violet-700 border-violet-100";
  if (r.includes("STUDENT")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Filters & table state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "ACTIVE",
    role_id: "",
  });

  const getRoleIdFromItem = (role) =>
    String(role.id ?? role.role_id ?? role.roleId ?? "");

  const getRoleNameFromItem = (role) =>
    role.roleName || role.role_name || role.name || role.title || `Role #${getRoleIdFromItem(role)}`;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_BASE_URL);
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showToast("Failed to load users. Check if the API is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get(ROLES_API_URL);
      const data = response.data.data || response.data;
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const refreshAll = () => {
    fetchUsers();
    fetchRoles();
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Reset to first page every time filters/sort change
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [searchQuery, statusFilter, roleFilter]);

  const getRoleName = (user) => {
    const currentRoleId = String(
      user.role_id ?? user.roleId ?? user.role?.id ?? ""
    );
    const matchedRole = roles.find(
      (r) => getRoleIdFromItem(r) === currentRoleId
    );
    if (matchedRole) return getRoleNameFromItem(matchedRole);
    return (
      user.role_name ||
      user.role?.role_name ||
      user.role?.name ||
      (currentRoleId ? `Role #${currentRoleId}` : "N/A")
    );
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt)
      ? String(d).slice(0, 10)
      : dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  // Derived data
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const matchesSearch = name.includes(q) || email.includes(q);
      const matchesStatus =
        statusFilter === "ALL" || (u.status || "ACTIVE") === statusFilter;
      const roleName = getRoleName(u);
      const matchesRole =
        roleFilter === "ALL" || roleName === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter, roles]);

  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];
    arr.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "createdAt") {
        va = new Date(va || 0).getTime();
        vb = new Date(vb || 0).getTime();
      } else {
        va = String(va ?? "").toLowerCase();
        vb = String(vb ?? "").toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filteredUsers, sortKey, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedUsers.length / rowsPerPage)
  );
  const safePage = Math.min(page, totalPages);
  const pagedUsers = sortedUsers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const activeCount = users.filter((u) => (u.status || "ACTIVE") === "ACTIVE").length;
  const inactiveCount = users.length - activeCount;
  const adminCount = users.filter((u) =>
    getRoleName(u).toUpperCase().includes("ADMIN")
  ).length;

  // Unique role names for the filter dropdown
  const roleOptions = useMemo(() => {
    const set = new Set(users.map((u) => getRoleName(u)).filter(Boolean));
    return [...set];
  }, [users, roles]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Selection
  const allPageSelected =
    pagedUsers.length > 0 &&
    pagedUsers.every((u) => selectedIds.includes(u.id));
  const toggleAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pagedUsers.some((u) => u.id === id))
      );
    } else {
      const ids = new Set(selectedIds);
      pagedUsers.forEach((u) => ids.add(u.id));
      setSelectedIds([...ids]);
    }
  };
  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    if (!formData.role_id) {
      showToast("Please select a role.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        roleId: Number(formData.role_id),
        name: formData.name,
        email: formData.email,
        status: formData.status,
      };
      if (formData.password) payload.password = formData.password;

      if (editingUser) {
        await api.put(`${API_BASE_URL}/${editingUser.id}`, payload);
        showToast("User updated successfully.");
      } else {
        await api.post(API_BASE_URL, payload);
        showToast("User created successfully.");
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
      showToast(
        err.response?.data?.message || "Failed to save user.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      showToast("User deleted.");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("Failed to delete user.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(`Delete ${selectedIds.length} selected user(s)?`)
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) => api.delete(`${API_BASE_URL}/${id}`))
      );
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      showToast(`${selectedIds.length} user(s) deleted.`);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete users:", err);
      showToast("Failed to delete some users.", "error");
    }
  };

  const openModal = (user = null) => {
    const firstRoleId = roles.length > 0 ? getRoleIdFromItem(roles[0]) : "";

    if (user) {
      setEditingUser(user);
      const userRoleId =
        user.role_id ?? user.roleId ?? user.role?.id ?? user.role?.role_id ?? firstRoleId;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        status: user.status || "ACTIVE",
        role_id: String(userRoleId),
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        status: "ACTIVE",
        role_id: firstRoleId,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      status: "ACTIVE",
      role_id: roles.length > 0 ? getRoleIdFromItem(roles[0]) : "",
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";
  const labelClass =
    "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                User Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage accounts, roles and access
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={refreshAll}
              className="justify-center p-2.5 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Users", value: users.length, icon: UsersIcon, color: "bg-indigo-50 text-indigo-600" },
            { label: "Active", value: activeCount, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
            { label: "Inactive", value: inactiveCount, icon: UserX, color: "bg-rose-50 text-rose-600" },
            { label: "Admins", value: adminCount, icon: Crown, color: "bg-amber-50 text-amber-600" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{s.value.toLocaleString()}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={15} className="text-slate-400" />
            {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {s === "ALL" ? "All statuses" : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:ml-auto flex-wrap">
            <Layers size={15} className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition"
              >
                <Trash2 size={13} />
                Delete {selectedIds.length} selected
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={allPageSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                    <span className="inline-flex items-center gap-1">
                      User
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </span>
                  </th>
                  <th className="py-4 px-4 hidden sm:table-cell">Role</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                    <span className="inline-flex items-center gap-1">
                      Joined
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </span>
                  </th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                      <p className="text-xs">Loading users...</p>
                    </td>
                  </tr>
                ) : pagedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => {
                    const name = user.name || "User";
                    const email = user.email || "-";
                    const roleName = getRoleName(user);
                    const status = user.status || "ACTIVE";
                    const isSelected = selectedIds.includes(user.id);

                    return (
                      <tr
                        key={user.id}
                        className={`transition-colors group ${
                          isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-4 pl-4 pr-2">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleOne(user.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{name}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${roleColor(roleName)}`}>
                            <Shield className="w-3.5 h-3.5" />
                            {roleName}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.INACTIVE}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {status}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell text-xs text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openModal(user)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="Edit User"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && sortedUsers.length > 0 && (
            <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(safePage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(safePage * rowsPerPage, sortedUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {sortedUsers.length}
                  </span>{" "}
                  users
                </p>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none"
                >
                  {ROWS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safePage) <= 1
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-slate-400">…</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                          p === safePage
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "border border-slate-200 text-slate-500 hover:bg-white"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Password {editingUser && "(Leave empty to keep unchanged)"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Role *</label>
                  <select
                    required
                    value={String(formData.role_id)}
                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" disabled>Select Role</option>
                    {roles.map((item) => {
                      const rId = getRoleIdFromItem(item);
                      const rName = getRoleNameFromItem(item);
                      return (
                        <option key={rId || Math.random()} value={rId}>
                          {rName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputClass}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? "Update User" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white animate-in fade-in slide-in-from-bottom-4 duration-200 ${
              toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
            }`}
          >
            {toast.type === "error" ? (
              <X className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;