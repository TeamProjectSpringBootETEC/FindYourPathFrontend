import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  Trash2,
  Edit3,
  X,
  UploadCloud,
  ExternalLink,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/companies";

// CLOUDINARY CONFIGURATION
const CLOUDINARY_CLOUD_NAME = "gazcwplt"; 
const CLOUDINARY_UPLOAD_PRESET = "my_react_preset"; // Unsigned preset configured in Cloudinary

function Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // 1. READ: Fetch Companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const data = response.data.data || response.data;
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // Upload Logo Helper to Cloudinary (Unsigned Strategy)
  const uploadToCloudinary = async (file) => {
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploadingImage(true);
      // Use a clean axios instance to avoid sending application auth headers to Cloudinary
      const res = await axios.create().post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        cloudinaryData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Error Details:", err.response?.data || err.message);
      throw new Error(err.response?.data?.error?.message || "Cloudinary upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 2. CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    try {
      setSubmitting(true);
      
      // Keep existing URL if editing, or set to null if blob preview is active without submission
      let finalLogoUrl = logoPreview && !logoPreview.startsWith("blob:") ? logoPreview : null;

      // Upload new file to Cloudinary if selected
      if (logoFile) {
        finalLogoUrl = await uploadToCloudinary(logoFile);
      }

      const payload = {
        companyName: formData.companyName,
        description: formData.description,
        location: formData.location,
        website: formData.website,
        userId: formData.userId ? Number(formData.userId) : null,
        logo: finalLogoUrl,
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
      alert(err.message || "Failed to save company.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. DELETE COMPANY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCompanies((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  // 4. REMOVE LOGO FROM RECORD
  const handleDeleteLogo = async (companyId, e) => {
    e.stopPropagation();
    if (!window.confirm("Remove company logo?")) return;

    try {
      await axios.put(`${API_BASE_URL}/${companyId}`, { logo: null });
      fetchCompanies();
    } catch (err) {
      console.error("Failed to delete logo:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        userId: company.userId || company.user_id || "",
      });
      setLogoPreview(company.logo || company.logoUrl || null);
    } else {
      setEditingCompany(null);
      setFormData({
        companyName: "",
        description: "",
        location: "",
        website: "",
        userId: "",
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

  const filteredCompanies = companies.filter((c) => {
    const name = c.companyName || c.company_name || "";
    const loc = c.location || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Company Directory
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage registered companies and Cloudinary logos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={fetchCompanies}
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
              Add Company
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Website</th>
                <th className="py-4 px-6">User ID</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                    <p className="text-xs">Loading companies...</p>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400">
                    No companies match your query.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => {
                  const logoPath = company.logo || company.logoUrl;
                  const name = company.companyName || company.company_name;
                  const userId = company.userId || company.user_id;

                  return (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative group/logo w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0">
                            {logoPath ? (
                              <>
                                <img
                                  src={logoPath}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={(e) => handleDeleteLogo(company.id, e)}
                                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"
                                  title="Delete Logo"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <Building2 className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{name}</p>
                            <p className="text-xs text-slate-400 max-w-xs truncate">
                              {company.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        {company.location ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {company.location}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {userId ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-xs font-mono font-medium">
                            <User className="w-3 h-3 text-slate-400" />
                            ID: {userId}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openModal(company)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCompany ? "Edit Company Details" : "Add New Company"}
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
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-slate-400" />
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
                    className="cursor-pointer px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    {logoFile ? logoFile.name : "Upload Image"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="e.g. Acme Corporation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="e.g. Phnom Penh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    User ID
                  </label>
                  <input
                    type="number"
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="e.g. 102"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                  placeholder="Enter company description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {(submitting || uploadingImage) && <Loader2 className="w-4 h-4 animate-spin" />}
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