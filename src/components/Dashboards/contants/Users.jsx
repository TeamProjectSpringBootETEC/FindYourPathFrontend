import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/v1/users";
const ROLES_API_URL = "http://localhost:8089/api/v1/roles";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "ACTIVE",
    role_id: "",
  });

  // Safe Helper: ស្រង់យក Role ID ចេញពី Role Object
  const getRoleIdFromItem = (role) => {
    if (!role) return "";
    return String(role.id ?? role.role_id ?? role.roleId ?? "");
  };

  // Safe Helper: ស្រង់យក Role Name ចេញពី Role Object
  const getRoleNameFromItem = (role) => {
    if (!role) return "";
    return role.role_name || role.name || role.title || `Role #${getRoleIdFromItem(role)}`;
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get(ROLES_API_URL);
      const data = response.data.data || response.data;
      const parsedRoles = Array.isArray(data) ? data : [];
      setRoles(parsedRoles);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Save / Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (!formData.role_id) {
      alert("Please select a role.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        status: formData.status,
        role_id: Number(formData.role_id), // ឬផ្ញើជា Number ទៅកាន់ Backend
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingUser) {
        await axios.put(`${API_BASE_URL}/${editingUser.id}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
      alert(err.response?.data?.message || "Failed to save user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  const openModal = (user = null) => {
    const firstRoleId = roles.length > 0 ? getRoleIdFromItem(roles[0]) : "";

    if (user) {
      setEditingUser(user);
      
      // ស្រង់យក Role ID ពី User Object
      const userRoleId =
        user.role_id ??
        user.roleId ??
        user.role?.id ??
        user.role?.role_id ??
        firstRoleId;

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

  // មុខងារបង្ហាញឈ្មោះ Role ក្នុង តារាង (Table)
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

  const filteredUsers = users.filter((u) => {
    const name = u.name || "";
    const email = u.email || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                User Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage accounts and roles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
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
              onClick={() => {
                fetchUsers();
                fetchRoles();
              }}
              className="p-2.5 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* User Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                    <p className="text-xs">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-slate-400">
                    No users found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const name = user.name || "User";
                  const email = user.email || "-";
                  const roleName = getRoleName(user);
                  const status = user.status || "ACTIVE";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
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

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Shield className="w-3.5 h-3.5 text-indigo-500" />
                          {roleName}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
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
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Password {editingUser && "(Leave empty to keep unchanged)"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Role *
                  </label>
                  <select
                    required
                    value={String(formData.role_id)}
                    onChange={(e) =>
                      setFormData({ ...formData, role_id: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
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
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? "Update User" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;