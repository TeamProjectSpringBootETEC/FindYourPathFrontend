import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  X,
  Loader2,
  Trash2,
  Edit,
  Building2,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8089/api/job-categories";
const JOBS_API_URL = "http://localhost:8089/api/jobs";

function CategoryJob() {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // 1. READ: Fetch Categories & Jobs ចេញពី Backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [catRes, jobRes] = await Promise.all([
        axios.get(API_BASE_URL),
        axios.get(JOBS_API_URL).catch(() => ({ data: [] })),
      ]);

      const catData = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.data || [];

      const jobData = Array.isArray(jobRes.data)
        ? jobRes.data
        : jobRes.data.data || [];

      // Console.log មើល Structure ទិន្នន័យ Backend ក្នុង F12
      console.log("Categories Data:", catData);
      console.log("Jobs Data:", jobData);

      setCategories(catData);
      setJobs(jobData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        "Failed to load data. Make sure your API is running at http://localhost:8089."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Safe extraction of Category ID from Job Object (ដកស្រង់ Category ID ពី Job ឲ្យគ្រប់ទម្រង់)
  const getJobCategoryId = (job) => {
    if (!job) return null;

    const id =
      job.category_id ??
      job.categoryId ??
      job.job_category_id ??
      job.jobCategoryId ??
      job.category?.id ??
      job.jobCategory?.id ??
      job.jobCategories?.id;

    return id !== undefined && id !== null ? String(id) : null;
  };

  // មុខងារគណនាចំនួន Job តាម Category ID ដោយប្រើ String Comparison
  const getJobCountByCategoryId = (categoryId) => {
    if (!categoryId) return 0;
    return jobs.filter((job) => {
      const jobCatId = getJobCategoryId(job);
      return jobCatId === String(categoryId);
    }).length;
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);

      if (editingCategory) {
        const response = await axios.put(
          `${API_BASE_URL}/${editingCategory.id}`,
          {
            name: formData.name,
            description: formData.description,
          }
        );

        const updatedItem = response.data.data || response.data || {
          ...editingCategory,
          ...formData,
        };

        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...updatedItem } : cat
          )
        );
      } else {
        const response = await axios.post(API_BASE_URL, {
          name: formData.name,
          description: formData.description,
        });

        const createdItem = response.data.data || response.data;
        setCategories((prev) => [createdItem, ...prev]);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
      fetchData(); // Refresh Data ក្រោយពេលបង្កើត ឬកែប្រែ
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Failed to save category. Please check server logs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category. Please check backend response.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = cat.name && cat.name.toLowerCase().includes(query);
    const descMatch =
      cat.description && cat.description.toLowerCase().includes(query);
    return nameMatch || descMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Category Jobs Page
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search job categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <button
            onClick={fetchData}
            className="p-2 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            <Plus size={16} />
            Add New Category
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Categories
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              {categories.length}
            </h2>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
              <p className="text-sm">Fetching categories from backend...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500">
              <p className="font-semibold">{error}</p>
              <button
                onClick={fetchData}
                className="mt-3 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-md text-xs font-medium hover:bg-rose-100 transition"
              >
                Retry API
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Jobs Count</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCategories.map((item, index) => {
                  // ប្រសិនបើ Category មាន nested array 'jobs' ស្រាប់ ប្រើវា បើគ្មានប្រើ helper function រាប់
                  const jobCount = Array.isArray(item.jobs)
                    ? item.jobs.length
                    : getJobCountByCategoryId(item.id);

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        #{item.id}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {item.name || "Unnamed Category"}
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-md truncate">
                        {item.description || "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                          {jobCount} Jobs
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                            title="Edit Category"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(item.id)}
                            disabled={deletingId === item.id}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
                            title="Delete Category"
                          >
                            {deletingId === item.id ? (
                              <Loader2
                                size={16}
                                className="animate-spin text-rose-600"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400"
                    >
                      No job categories found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal Form for CREATE & EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingCategory ? "Edit Job Category" : "Add Job Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technology"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryJob;