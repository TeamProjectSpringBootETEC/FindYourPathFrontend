import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  GripVertical,
  Layers,
  TrendingUp,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  ArrowUpDown,
  Pencil,
  Folder,
} from "lucide-react";
import { Link } from "react-router-dom";

const JOBS_API_URL = "http://localhost:8089/api/jobs";
const CATEGORIES_API_URL = "http://localhost:8089/api/job-categories";

const initialFormState = {
  title: "",
  description: "",
  company_id: "",
  category_id: "",
  location: "",
  job_type: "Full-time",
  workplace_type: "Remote",
  experience_level: "Senior",
  salary: "",
  status: "OPEN",
  deadline: "",
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, jobRes] = await Promise.all([
        axios.get(CATEGORIES_API_URL).catch(() => ({ data: [] })),
        axios.get(JOBS_API_URL).catch(() => ({ data: [] })),
      ]);

      const catData = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.data || [];
      const jobData = Array.isArray(jobRes.data)
        ? jobRes.data
        : jobRes.data.data || [];

      // Debugging: មើល Structure នៃទិន្នន័យក្នុង Console
      console.log("Categories API Response:", catData);
      console.log("Jobs API Response:", jobData);

      setCategories(catData);
      setJobs(jobData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Safe extraction of Category ID from Job Object
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

  const filteredJobs = selectedCategoryId
    ? jobs.filter((job) => getJobCategoryId(job) === String(selectedCategoryId))
    : jobs;

  const getJobCountByCategoryId = (categoryId) => {
    if (!categoryId) return 0;
    return jobs.filter((job) => getJobCategoryId(job) === String(categoryId))
      .length;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      company_id: job.company_id || job.companyId || job.company?.id || "",
      category_id: getJobCategoryId(job) || "",
      location: job.location || "",
      job_type: job.job_type || job.jobType || "Full-time",
      workplace_type: job.workplace_type || job.workplaceType || "Remote",
      experience_level: job.experience_level || job.experienceLevel || "Senior",
      salary: job.salary ? String(job.salary) : "",
      status: job.status || "OPEN",
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();

    const cleanSalary = formData.salary
      ? parseFloat(String(formData.salary).replace(/[^0-9.]/g, ""))
      : null;

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      salary: isNaN(cleanSalary) ? null : cleanSalary,
      status: formData.status,
      deadline: formData.deadline || null,
      jobType: formData.job_type,
      job_type: formData.job_type,
      workplaceType: formData.workplace_type,
      workplace_type: formData.workplace_type,
      experienceLevel: formData.experience_level,
      experience_level: formData.experience_level,
      company_id: Number(formData.company_id),
      companyId: Number(formData.company_id),
      category_id: Number(formData.category_id),
      categoryId: Number(formData.category_id),
      jobCategoryId: Number(formData.category_id),
    };

    try {
      let response;
      if (editingJobId) {
        response = await axios.put(`${JOBS_API_URL}/${editingJobId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(JOBS_API_URL, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        fetchData();
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error("Error saving job:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data;
      alert(
        `Failed to save job: ${typeof serverMsg === "string" ? serverMsg : "Verify inputs."}`,
      );
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await axios.delete(`${JOBS_API_URL}/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Job Postings
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage and track active and historical job opportunities.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/dashboard/categories"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-indigo-900 hover:bg-slate-50 transition shadow-xs"
            >
              <Layers size={16} className="text-indigo-600" /> Manage Categories
            </Link>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-100"
            >
              <Plus size={16} /> Post New Job
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Categories</h2>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${selectedCategoryId === null ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder size={16} className="text-indigo-600" />{" "}
                    <span>All Categories</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-500">
                    {jobs.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected =
                    String(selectedCategoryId) === String(cat.id);
                  const count = getJobCountByCategoryId(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${isSelected ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GripVertical size={14} className="text-slate-300" />
                        <Folder
                          size={16}
                          className={
                            isSelected ? "text-indigo-600" : "text-slate-400"
                          }
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 shadow-lg min-h-[160px] flex flex-col justify-end">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <TrendingUp size={14} /> Talent Insight
                </div>
                <p className="text-sm font-bold leading-snug">
                  Your applications are up{" "}
                  <span className="text-emerald-400">24% this week.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                    All Statuses <ChevronDown size={14} />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                    Date Posted <ArrowUpDown size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Showing{" "}
                  <span className="text-slate-700 font-semibold">
                    {filteredJobs.length}
                  </span>{" "}
                  total jobs
                </p>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 className="animate-spin mr-2" size={20} /> Loading
                    Jobs...
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-5">Job Title & Category</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Workplace</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {filteredJobs.map((job) => {
                        const jobCatId = getJobCategoryId(job);
                        const matchedCat = categories.find(
                          (c) => String(c.id) === String(jobCatId),
                        );

                        return (
                          <tr
                            key={job.id}
                            className="hover:bg-slate-50/60 transition"
                          >
                            <td className="py-4 px-5">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-700">
                                  {job.title
                                    ? job.title.substring(0, 2).toUpperCase()
                                    : "JOB"}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900 text-xs">
                                    {job.title}
                                  </h3>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {matchedCat
                                      ? matchedCat.name
                                      : "Uncategorized"}{" "}
                                    •{" "}
                                    <span className="text-slate-500">
                                      ${job.salary || "N/A"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              {job.location || "N/A"}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider bg-indigo-50 text-indigo-600">
                                {job.workplace_type ||
                                  job.workplaceType ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${job.status === "OPEN" ? "bg-emerald-500" : "bg-rose-500"}`}
                                ></span>
                                <span
                                  className={`font-semibold ${job.status === "OPEN" ? "text-emerald-600" : "text-rose-600"}`}
                                >
                                  {job.status}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditModal(job)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition rounded-lg hover:bg-indigo-50"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredJobs.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-8 text-slate-400"
                          >
                            No jobs found for this category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingJobId ? "Edit Job Posting" : "Post New Job"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">
                    Company ID *
                  </label>
                  <input
                    type="number"
                    name="company_id"
                    required
                    value={formData.company_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Phnom Penh, Cambodia"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Salary ($)</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Workplace Type
                  </label>
                  <select
                    name="workplace_type"
                    value={formData.workplace_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter job description..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  {editingJobId ? "Update Job" : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
