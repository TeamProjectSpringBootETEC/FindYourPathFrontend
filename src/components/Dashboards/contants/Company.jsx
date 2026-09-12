import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Building2,
  Plus,
  Search,
  Globe,
  Trash2,
  Edit3,
  X,
  UploadCloud,
  User,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Briefcase,
  SlidersHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/companies";
const USERS_API_URL = "http://localhost:8089/api/v1/users";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "gazcwplt";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "my_react_preset";

function Company() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    location: "",
    website: "",
    userId: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const data = response.data.data || response.data;

      console.log(response.data)
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
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
    fetchCompanies();
    fetchUsers();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const uploadToCloudinary = async (file) => {
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploadingImage(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        cloudinaryData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.error?.message || "Cloudinary upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    if (!formData.userId) {
      alert("Please select a User");
      return;
    }

    try {
      setSubmitting(true);
      let finalLogoUrl = logoPreview && !logoPreview.startsWith("blob:") ? logoPreview : "";

      if (logoFile) {
        finalLogoUrl = await uploadToCloudinary(logoFile);
      }

      const payload = {
        companyName: formData.companyName.trim(),
        description: formData.description ? formData.description.trim() : "",
        location: formData.location ? formData.location.trim() : "",
        website: formData.website ? formData.website.trim() : "",
        userId: Number(formData.userId),
        logo: finalLogoUrl || "",
      };

      if (editingCompany) {
        await axios.put(`${API_BASE_URL}/${editingCompany.id}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }

      closeModal();
      fetchCompanies();
    } catch (err) {
      console.error("Failed to save company:", err);
      const backendMessage = err.response?.data?.message || err.message;
      alert(`Save failed: ${backendMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCompanies((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  const handleDeleteLogo = async (company, e) => {
    e.stopPropagation();
    if (!window.confirm("Remove company logo?")) return;

    try {
      const payload = {
        companyName: company.companyName || company.company_name,
        description: company.description || "",
        location: company.location || "",
        website: company.website || "",
        userId: Number(company.userId || company.user_id),
        logo: "",
      };

      await axios.put(`${API_BASE_URL}/${company.id}`, payload);
      fetchCompanies();
    } catch (err) {
      console.error("Failed to delete logo:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        companyName: company.companyName || company.company_name || "",
        description: company.description || "",
        location: company.location || "",
        website: company.website || "",
        userId: company.userId || company.user_id || (users[0]?.id || ""),
      });
      setLogoPreview(company.logo || company.logoUrl || null);
    } else {
      setEditingCompany(null);
      setFormData({
        companyName: "",
        description: "",
        location: "",
        website: "",
        userId: users[0]?.id || "",
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({
      companyName: "",
      description: "",
      location: "",
      website: "",
      userId: "",
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const name = c.companyName || c.company_name || "";
      const loc = c.location || "";
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
      
      const isVerified = c.isVerified || c.verified || false;
      const matchesVerified = verifiedOnly ? isVerified : true;

      return matchesSearch && matchesVerified;
    });
  }, [companies, searchQuery, verifiedOnly]);

  const userMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.name || user.username || `User ${user.id}`;
      return acc;
    }, {});
  }, [users]);

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 font-sans pb-12">
      <header className="bg-white border-b-2 border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/70 border border-transparent rounded-full text-xs text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 transition">
            <HelpCircle size={18} />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-slate-700">Admin User</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Partner Companies
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage and monitor all corporate partners within the EnterpriseSuite ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              Verified Only
            </label>

            <button
              onClick={() => {
                fetchCompanies();
                fetchUsers();
              }}
              className="p-2 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
              title="Refresh Data"
            >
              <RefreshCw size={15} />
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <SlidersHorizontal size={14} />
              Filter
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <Download size={14} />
              Export CSV
            </button>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md shadow-indigo-100 transition"
            >
              <Plus size={15} />
              Add Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Companies
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {companies.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Verified
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {companies.filter(c => c.isVerified || c.verified).length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pending
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {companies.filter(c => !(c.isVerified || c.verified)).length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Jobs
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">3,105</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Industry / Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                      Loading companies...
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No companies match your query.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => {
                    const logoPath = company.logo || company.logoUrl;
                    const name = company.companyName || company.company_name;
                    const userId = company.userId || company.user_id;

                    return (
                      <tr key={company.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group/logo w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {logoPath ? (
                                <>
                                  <img
                                    src={logoPath}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={(e) => handleDeleteLogo(company, e)}
                                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"
                                    title="Delete Logo"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <Building2 className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{name}</p>
                              <p className="text-[11px] text-slate-400">
                                {company.location || "Location not set"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div>
                            <p className="text-xs text-slate-800 font-medium truncate max-w-[180px]">
                              {company.description || "General Industry"}
                            </p>
                            {company.website && (
                              <a
                                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline mt-0.5"
                              >
                                <Globe size={11} />
                                Website
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            company.isVerified || company.verified 
                              ? "bg-emerald-100/70 text-emerald-700" 
                              : "bg-amber-100/70 text-amber-700"
                          }`}>
                            <CheckCircle2 size={12} />
                            {company.isVerified || company.verified ? "Verified" : "Pending"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {userId ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">
                              <User size={11} className="text-slate-400" />
                              {userMap[userId] ? userMap[userId] : `ID: ${userId}`}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-slate-500">
                            <button
                              onClick={() => openModal(company)}
                              className="p-1.5 hover:text-indigo-600 hover:bg-slate-100 rounded transition"
                              title="Edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(company.id)}
                              className="p-1.5 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
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

          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <p>
              Showing <span className="font-semibold text-slate-700">{filteredCompanies.length > 0 ? 1 : 0}</span> to{" "}
              <span className="font-semibold text-slate-700">{filteredCompanies.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{companies.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-slate-200 rounded hover:bg-white transition text-slate-400">
                <ChevronLeft size={14} />
              </button>
              <button className="px-2.5 py-1 bg-indigo-600 text-white font-semibold rounded text-xs">
                1
              </button>
              <button className="p-1 border border-slate-200 rounded hover:bg-white transition text-slate-400">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingCompany ? "Edit Company Details" : "Add New Company"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="logo-file-input"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-file-input"
                    className="cursor-pointer px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    {logoFile ? logoFile.name : "Upload Image"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="e.g. Nexa Systems"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    User Owner *
                  </label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="" disabled>Select a User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.username || `User ${u.id}`} (ID: {u.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                  placeholder="Enter industry or description..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-100 transition disabled:opacity-50"
                >
                  {(submitting || uploadingImage) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {uploadingImage ? "Uploading Logo..." : editingCompany ? "Update Company" : "Save Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Company;